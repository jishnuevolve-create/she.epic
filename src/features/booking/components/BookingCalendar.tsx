"use client";
import { useEffect, useState } from "react";
import { slotLabel, studioDate } from "../utils";
type Slot = { date: string; start_at: string; end_at: string };
type Availability = { timezone: string; slots: Slot[] };
export function BookingCalendar({
  value,
  onChange,
  onTimezone,
}: {
  value: string;
  onChange: (value: string) => void;
  onTimezone: (value: string) => void;
}) {
  const [month, setMonth] = useState(studioDate().slice(0, 7));
  const [date, setDate] = useState("");
  const [data, setData] = useState<Availability | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch("/api/availability?month=" + month, {
          signal: controller.signal,
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Could not load availability.");
        setData(result);
        onTimezone(result.timezone);
      } catch (error) {
        if (!controller.signal.aborted)
          setError(error instanceof Error ? error.message : "Could not load availability.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [month, onTimezone]);
  const [year, monthNumber] = month.split("-").map(Number);
  const firstDay = new Date(Date.UTC(year, monthNumber - 1, 1)).getUTCDay();
  const days = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
  function changeMonth(next: string) {
    if (!next) return;
    setMonth(next);
    setDate("");
    onChange("");
    setData(null);
    setError("");
    setLoading(true);
  }
  return (
    <div>
      <div className="field">
        <label htmlFor="consultation-month">Consultation month</label>
        <input
          id="consultation-month"
          type="month"
          min={studioDate(new Date(), data?.timezone).slice(0, 7)}
          value={month}
          onChange={(event) => changeMonth(event.target.value)}
        />
      </div>
      <p className="notice">
        Times shown in {data?.timezone || "Asia/Kolkata"}. Unavailable days are disabled using the
        studio’s current schedule.
      </p>
      {loading && <p role="status">Checking availability…</p>}
      {error && (
        <p role="alert" className="error-message">
          {error}
        </p>
      )}
      <div className="calendar-grid" role="group" aria-label="Choose consultation date">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <span key={index} aria-hidden="true">
            {day}
          </span>
        ))}
        {Array.from({ length: firstDay }, (_, index) => (
          <span key={"blank" + index} />
        ))}
        {Array.from({ length: days }, (_, index) => {
          const day = month + "-" + String(index + 1).padStart(2, "0");
          const available = data?.slots.some((slot) => slot.date === day);
          return (
            <button
              type="button"
              key={day}
              className="calendar-day"
              disabled={loading || !available}
              aria-label={day}
              aria-pressed={date === day}
              onClick={() => {
                setDate(day);
                onChange("");
              }}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
      {!loading && !error && data?.slots.length === 0 && (
        <p role="status">No appointments are available this month. Please choose another month.</p>
      )}
      <div className="slots" role="group" aria-label="Available consultation times">
        {data?.slots
          .filter((slot) => slot.date === date)
          .map((slot) => (
            <button
              type="button"
              className="slot"
              key={slot.start_at}
              aria-pressed={value === slot.start_at}
              onClick={() => onChange(slot.start_at)}
            >
              {slotLabel(slot.start_at, data.timezone)}
            </button>
          ))}
      </div>
    </div>
  );
}
