import Link from "next/link";
import { AdminForm } from "./AdminForms";
import { signOut } from "./actions";
import { appointmentLabel } from "@/features/booking/utils";
type Appointment = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  consultation_type: string;
  consultation_start_at: string;
  status: string;
  event_date: string;
  event_location: string;
  message: string;
  event_type: string;
};
type Rule = { id: string; weekday: number; start_time: string; end_time: string };
type Block = { id: string; start_at: string; end_at: string; reason: string };
type Settings = {
  timezone: string;
  appointment_duration: number;
  booking_notice: number;
  booking_horizon: number;
};
type Enquiry = { id: string; name: string; email: string; message: string };
type Notification = { id: string; appointment_id: string; last_error: string | null };
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export function AppointmentManager({
  appointments,
  rules,
  blocks,
  settings,
  enquiries,
  notifications,
  selected,
}: {
  appointments: Appointment[];
  rules: Rule[];
  blocks: Block[];
  settings: Settings;
  enquiries: Enquiry[];
  notifications: Notification[];
  selected: string;
}) {
  return (
    <>
      <div className="section-row">
        <div>
          <span className="eyebrow">PRIVATE STUDIO WORKSPACE</span>
          <h1 style={{ fontSize: "4rem" }}>The next chapter.</h1>
        </div>
        <form action={signOut}>
          <button className="button button-secondary">Sign out</button>
        </form>
      </div>
      <p>
        Showing up to 200 {selected} requests, ordered by consultation time. Times:{" "}
        {settings.timezone}.
      </p>
      <nav className="filter-bar" aria-label="Appointment status">
        {["pending", "confirmed", "cancelled"].map((status) => (
          <Link
            key={status}
            href={`?status=${status}`}
            aria-current={status === selected ? "page" : undefined}
            className="button button-secondary"
          >
            {status}
          </Link>
        ))}
      </nav>
      <div className="table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Consultation</th>
              <th>Customer</th>
              <th>Event & details</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((item) => (
              <tr key={item.id}>
                <td>
                  {appointmentLabel(item.consultation_start_at, settings.timezone)}
                  <br />
                  {item.consultation_type}
                  <br />
                  {item.status}
                </td>
                <td>
                  {item.customer_name}
                  <br />
                  <a href={`mailto:${item.customer_email}`}>{item.customer_email}</a>
                  <br />
                  {item.customer_phone}
                </td>
                <td>
                  <details>
                    <summary>
                      {item.event_type} · {item.event_date}
                    </summary>
                    <p>{item.event_location}</p>
                    <p>{item.message}</p>
                  </details>
                </td>
                <td>
                  {item.status !== "cancelled" && (
                    <AdminForm label="Update status">
                      <input type="hidden" name="action" value="status" />
                      <input type="hidden" name="id" value={item.id} />
                      <select
                        name="status"
                        aria-label={`New status for ${item.customer_name}`}
                        defaultValue={item.status === "pending" ? "confirmed" : "cancelled"}
                      >
                        <option value="confirmed">Confirm</option>
                        <option value="cancelled">Cancel and release slot</option>
                      </select>
                    </AdminForm>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!appointments.length && <p>No {selected} requests.</p>}
      </div>
      <section className="section">
        <h2>Availability settings.</h2>
        <p>
          Schedule changes affect new requests. Existing appointments keep their reserved time.
          Blocking a period does not cancel appointments already in it.
        </p>
        <div className="form-grid">
          <div className="form-panel">
            <h3>Studio schedule</h3>
            <AdminForm>
              <input type="hidden" name="action" value="settings" />
              {Object.entries(settings)
                .filter(([key]) =>
                  [
                    "timezone",
                    "appointment_duration",
                    "booking_notice",
                    "booking_horizon",
                  ].includes(key),
                )
                .map(([key, value]) => (
                  <div className="field" key={key}>
                    <label htmlFor={key}>
                      {key.replaceAll("_", " ")}
                      {key === "booking_notice"
                        ? " (minutes)"
                        : key === "booking_horizon"
                          ? " (days)"
                          : key === "appointment_duration"
                            ? " (minutes)"
                            : ""}
                    </label>
                    <input
                      id={key}
                      name={key}
                      type={key === "timezone" ? "text" : "number"}
                      defaultValue={value}
                      required
                    />
                  </div>
                ))}
            </AdminForm>
          </div>
          <div className="form-panel">
            <h3>Working hours</h3>
            {rules.map((rule) => (
              <div key={rule.id}>
                <p>
                  {days[rule.weekday]} {rule.start_time}–{rule.end_time}
                </p>
                <AdminForm label="Remove hours">
                  <input type="hidden" name="action" value="remove-rule" />
                  <input type="hidden" name="id" value={rule.id} />
                </AdminForm>
              </div>
            ))}
            <AdminForm label="Add working hours">
              <input type="hidden" name="action" value="rule" />
              <div className="field">
                <label htmlFor="weekday">Day</label>
                <select name="weekday" id="weekday">
                  {days.map((day, index) => (
                    <option key={day} value={index}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="start_time">Opens</label>
                <input type="time" id="start_time" name="start_time" required />
              </div>
              <div className="field">
                <label htmlFor="end_time">Closes</label>
                <input type="time" id="end_time" name="end_time" required />
              </div>
            </AdminForm>
          </div>
        </div>
      </section>
      <section>
        <h2>Blocked periods.</h2>
        {blocks.map((block) => (
          <div key={block.id}>
            <p>
              {appointmentLabel(block.start_at, settings.timezone)} –{" "}
              {appointmentLabel(block.end_at, settings.timezone)} · {block.reason}
            </p>
            <AdminForm label="Release period">
              <input type="hidden" name="action" value="remove-block" />
              <input type="hidden" name="id" value={block.id} />
            </AdminForm>
          </div>
        ))}
        <AdminForm label="Block period">
          <input type="hidden" name="action" value="block" />
          <div className="form-grid">
            <div className="field">
              <label htmlFor="start_at">Start (ISO timestamp with offset)</label>
              <input
                id="start_at"
                name="start_at"
                placeholder="2026-12-01T09:00:00+05:30"
                required
                pattern=".+(Z|[+-][0-9]{2}:[0-9]{2})"
              />
            </div>
            <div className="field">
              <label htmlFor="end_at">End (ISO timestamp with offset)</label>
              <input
                id="end_at"
                name="end_at"
                placeholder="2026-12-01T18:00:00+05:30"
                required
                pattern=".+(Z|[+-][0-9]{2}:[0-9]{2})"
              />
            </div>
            <div className="field">
              <label htmlFor="reason">Reason</label>
              <input id="reason" name="reason" maxLength={200} />
            </div>
          </div>
        </AdminForm>
      </section>
      <section className="section">
        <h2>Contact enquiries.</h2>
        <p>Latest 50 messages.</p>
        {enquiries.map((enquiry) => (
          <details key={enquiry.id}>
            <summary>
              {enquiry.name} · {enquiry.email}
            </summary>
            <p style={{ whiteSpace: "pre-wrap" }}>{enquiry.message}</p>
          </details>
        ))}
      </section>
      <section>
        <h2>Notification delivery.</h2>
        <p>Unsent notices remain here. Configure the email provider before retrying.</p>
        {notifications.map((notification) => (
          <div key={notification.id}>
            <p>
              {notification.appointment_id} ·{" "}
              {notification.last_error || "Awaiting delivery / provider configuration"}
            </p>
            <AdminForm label="Retry notification">
              <input type="hidden" name="action" value="notify" />
              <input type="hidden" name="id" value={notification.appointment_id} />
            </AdminForm>
          </div>
        ))}
      </section>
    </>
  );
}
