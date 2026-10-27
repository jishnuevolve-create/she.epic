begin;
create table public.studio_settings (
 id integer primary key check(id=1), timezone text not null default 'Asia/Kolkata',
 appointment_duration integer not null default 30 check(appointment_duration between 15 and 180),
 booking_notice integer not null default 1440 check(booking_notice between 0 and 43200),
 booking_horizon integer not null default 180 check(booking_horizon between 1 and 365),
 updated_at timestamptz not null default now()
);
insert into public.studio_settings(id) values(1);
create table public.availability_rules (
 id uuid primary key default gen_random_uuid(), weekday integer not null check(weekday between 0 and 6),
 start_time time not null, end_time time not null, is_active boolean not null default true,
 check(end_time>start_time), unique(weekday,start_time,end_time)
);
-- No invented opening hours: staff configure these before accepting requests.
create table public.blocked_dates (
 id uuid primary key default gen_random_uuid(),start_at timestamptz not null,end_at timestamptz not null,
 reason text not null default '',check(end_at>start_at)
);
create table public.appointments (
 id uuid primary key default gen_random_uuid(),request_id uuid not null unique,payload_hash text not null,
 customer_name text not null,customer_email text not null,customer_phone text not null,
 consultation_type text not null check(consultation_type in ('Wedding Photography','Wedding Cinematography','Photography + Film','Pre-Wedding','General Consultation')),
 event_type text not null,event_date date not null,event_location text not null,message text not null default '',
 consultation_start_at timestamptz not null,consultation_end_at timestamptz not null,
 status text not null default 'pending' check(status in ('pending','confirmed','cancelled')),
 created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 check(consultation_end_at>consultation_start_at),
 exclude using gist (tstzrange(consultation_start_at,consultation_end_at,'[)') with &&) where(status in ('pending','confirmed'))
);
create index appointments_status_start_idx on public.appointments(status,consultation_start_at);
create table public.contact_enquiries (
 id uuid primary key default gen_random_uuid(), request_id uuid not null unique,
 name text not null,email text not null,message text not null,created_at timestamptz not null default now()
);
create table public.notification_outbox (
 id uuid primary key default gen_random_uuid(),appointment_id uuid not null unique references public.appointments(id) on delete cascade,
 sent_at timestamptz,last_error text,created_at timestamptz not null default now()
);
create table public.rate_limits (key text primary key,window_start timestamptz not null,hits integer not null);
alter table public.studio_settings enable row level security;
alter table public.availability_rules enable row level security;
alter table public.blocked_dates enable row level security;
alter table public.appointments enable row level security;
alter table public.contact_enquiries enable row level security;
alter table public.notification_outbox enable row level security;
alter table public.rate_limits enable row level security;
-- No browser policies. Data access is server-only, after explicit authorization.
revoke all on public.studio_settings,public.availability_rules,public.blocked_dates,public.appointments,public.contact_enquiries,public.notification_outbox,public.rate_limits from anon,authenticated;

create function public.available_slots(p_date date)
returns table(start_at timestamptz,end_at timestamptz)
language sql stable security invoker set search_path=public as $$
 with settings as (select * from studio_settings where id=1),
 candidates as (
 select distinct candidate as start_at,candidate+make_interval(mins=>s.appointment_duration) as end_at
 from settings s
 join availability_rules r on r.weekday=extract(dow from p_date)::integer and r.is_active
 cross join lateral generate_series(
  (p_date+r.start_time) at time zone s.timezone,
  ((p_date+r.end_time) at time zone s.timezone)-make_interval(mins=>s.appointment_duration),
  make_interval(mins=>s.appointment_duration)
 ) candidate
 where p_date >= (now() at time zone s.timezone)::date
 and p_date <= (now() at time zone s.timezone)::date+s.booking_horizon
 and candidate >= now()+make_interval(mins=>s.booking_notice)
 )
 select c.start_at,c.end_at from candidates c
 where not exists(select 1 from appointments a where a.status in ('pending','confirmed') and tstzrange(a.consultation_start_at,a.consultation_end_at,'[)') && tstzrange(c.start_at,c.end_at,'[)'))
 and not exists(select 1 from blocked_dates b where tstzrange(b.start_at,b.end_at,'[)') && tstzrange(c.start_at,c.end_at,'[)'))
 order by c.start_at;
$$;

create function public.create_appointment(p_request_id uuid,p_hash text,p_details jsonb)
returns uuid language plpgsql security invoker set search_path=public as $$
declare s studio_settings%rowtype; existing appointments%rowtype; chosen record; result uuid; requested timestamptz;
begin
 -- Shared mutex also taken by every schedule mutation; recheck after locking.
 select * into s from studio_settings where id=1 for update;
 select * into existing from appointments where request_id=p_request_id;
 if found then
  if existing.payload_hash<>p_hash then raise exception 'Idempotency mismatch';end if;
  return existing.id;
 end if;
 requested:=(p_details->>'startAt')::timestamptz;
 select * into chosen from available_slots((requested at time zone s.timezone)::date) where start_at=requested;
 if not found then raise exception 'Slot unavailable';end if;
 if (p_details->>'eventDate')::date < (now() at time zone s.timezone)::date then raise exception 'Past event';end if;
 insert into appointments(request_id,payload_hash,customer_name,customer_email,customer_phone,consultation_type,event_type,event_date,event_location,message,consultation_start_at,consultation_end_at)
 values(p_request_id,p_hash,p_details->>'name',p_details->>'email',p_details->>'phone',p_details->>'consultationType',p_details->>'eventType',(p_details->>'eventDate')::date,p_details->>'eventLocation',p_details->>'message',chosen.start_at,chosen.end_at)
 returning id into result;
 insert into notification_outbox(appointment_id) values(result);
 return result;
end;
$$;

create function public.lock_schedule()
returns trigger language plpgsql security invoker set search_path=public as $$
begin
 perform 1 from studio_settings where id=1 for update;
 return null;
end;
$$;
create trigger availability_lock before insert or update or delete on public.availability_rules for each statement execute function public.lock_schedule();
create trigger blocked_lock before insert or update or delete on public.blocked_dates for each statement execute function public.lock_schedule();

create function public.set_appointment_status(p_id uuid,p_status text)
returns void language plpgsql security invoker set search_path=public as $$
declare current_status text;
begin
 perform 1 from studio_settings where id=1 for update;
 select status into current_status from appointments where id=p_id for update;
 if not found then raise exception 'Unknown appointment';end if;
 if p_status not in ('confirmed','cancelled') then raise exception 'Invalid status';end if;
 if current_status='cancelled' and p_status<>'cancelled' then raise exception 'Cancelled appointments cannot be reopened';end if;
 update appointments set status=p_status,updated_at=now() where id=p_id;
end;
$$;

create function public.take_rate_limit(p_key text,p_limit integer)
returns boolean language plpgsql security invoker set search_path=public as $$
declare count_now integer;
begin
 insert into rate_limits(key,window_start,hits) values(p_key,now(),1)
 on conflict(key) do update set
 hits=case when rate_limits.window_start<now()-interval '15 minutes' then 1 else rate_limits.hits+1 end,
 window_start=case when rate_limits.window_start<now()-interval '15 minutes' then now() else rate_limits.window_start end
 returning hits into count_now;
 return count_now<=p_limit;
end;
$$;
revoke execute on function public.available_slots(date) from public,anon,authenticated;
revoke execute on function public.create_appointment(uuid,text,jsonb) from public,anon,authenticated;
revoke execute on function public.lock_schedule() from public,anon,authenticated;
revoke execute on function public.set_appointment_status(uuid,text) from public,anon,authenticated;
revoke execute on function public.take_rate_limit(text,integer) from public,anon,authenticated;
grant execute on function public.available_slots(date),public.create_appointment(uuid,text,jsonb),public.lock_schedule(),public.set_appointment_status(uuid,text),public.take_rate_limit(text,integer) to service_role;
grant all on public.studio_settings,public.availability_rules,public.blocked_dates,public.appointments,public.contact_enquiries,public.notification_outbox,public.rate_limits to service_role;
create function public.available_month(p_month date)
returns table(date date,start_at timestamptz,end_at timestamptz)
language sql stable security invoker set search_path=public as $
 select day::date,slots.start_at,slots.end_at
 from generate_series(p_month::timestamp,(p_month+interval '1 month'-interval '1 day')::timestamp,interval '1 day') day
 cross join lateral available_slots(day::date) slots
 order by day,slots.start_at;
$;
revoke execute on function public.available_month(date) from public,anon,authenticated;
grant execute on function public.available_month(date) to service_role;
commit;
