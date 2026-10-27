"use client";
import { useState, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, consultationTypes, type BookingInput } from "../schemas/booking";
import { BookingCalendar } from "./BookingCalendar";
import { appointmentLabel, studioDate } from "../utils";
import { Field } from "@/components/ui/Field";
const steps = ["Coverage", "Your details", "A time to talk", "Review"];
export function BookingForm() {
  const [step, setStep] = useState(0);
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const locked = useRef(false);
  const form = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      requestId: "",
      consultationType: "Photography + Film",
      name: "",
      email: "",
      phone: "",
      eventType: "Wedding",
      eventDate: "",
      eventLocation: "",
      message: "",
      startAt: "",
      website: "",
    },
  });
  const {
    register,
    watch,
    setValue,
    trigger,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;
  const values = watch();
  const updateTimezone = useCallback((value: string) => setTimezone(value), []);
  async function next() {
    setError("");
    const fields: (keyof BookingInput)[][] = [
      ["consultationType"],
      ["name", "email", "phone", "eventType", "eventDate", "eventLocation", "message"],
      ["startAt"],
    ];
    if (await trigger(fields[step])) {
      if (step === 1 && values.eventDate < studioDate(new Date(), timezone)) {
        form.setError("eventDate", { message: "Choose a future event date." });
        return;
      }
      if (!values.requestId) setValue("requestId", crypto.randomUUID());
      setStep(step + 1);
    }
  }
  async function submit(data: BookingInput) {
    if (locked.current) return;
    locked.current = true;
    setError("");
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 409) {
          setValue("startAt", "");
          setValue("requestId", crypto.randomUUID());
          setStep(2);
        }
        throw new Error(result.error || "Your request could not be saved.");
      }
      setSuccess(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not connect. Please try again.");
    } finally {
      locked.current = false;
    }
  }
  if (success)
    return (
      <div className="success-panel" role="status">
        <span className="eyebrow">REQUEST RECEIVED</span>
        <h2>
          Thank you for
          <br />
          <em>letting us in.</em>
        </h2>
        <p>
          Your consultation request has been received. We&apos;ll contact you to confirm your
          appointment.
        </p>
        <p>This is a pending request, not a confirmed appointment.</p>
      </div>
    );
  const input = (
    key: "name" | "email" | "phone" | "eventType" | "eventDate" | "eventLocation",
    label: string,
    type = "text",
  ) => (
    <Field id={key} label={label} error={errors[key]?.message}>
      <input
        id={key}
        type={type}
        {...register(key)}
        min={type === "date" ? studioDate(new Date(), timezone) : undefined}
        aria-invalid={!!errors[key]}
        aria-describedby={errors[key] ? key + "-error" : undefined}
        autoComplete={
          key === "name" ? "name" : key === "email" ? "email" : key === "phone" ? "tel" : "off"
        }
      />
    </Field>
  );
  return (
    <form
      className="form-panel"
      onSubmit={(event) => {
        event.preventDefault();
        if (step === 3) void handleSubmit(submit)(event);
      }}
      noValidate
    >
      <ol className="booking-steps">
        {steps.map((label, index) => (
          <li key={label} aria-current={step === index ? "step" : undefined}>
            {index + 1}. {label}
          </li>
        ))}
      </ol>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>
      {step === 0 && (
        <>
          <h2>
            What are you
            <br />
            <em>dreaming of?</em>
          </h2>
          <div className="choice-list">
            {consultationTypes.map((type) => (
              <label className="choice" key={type}>
                <input type="radio" value={type} {...register("consultationType")} />
                {type}
              </label>
            ))}
          </div>
        </>
      )}
      {step === 1 && (
        <>
          <h2>
            A little about
            <br />
            <em>your celebration.</em>
          </h2>
          <div className="form-grid">
            {input("name", "Your name")}
            {input("email", "Email address", "email")}
            {input("phone", "Phone / WhatsApp", "tel")}
            {input("eventType", "Event type")}
            {input("eventDate", "Event date", "date")}
            {input("eventLocation", "Event location")}
          </div>
          <Field
            id="message"
            label="Anything you’d like us to know? (optional)"
            error={errors.message?.message}
          >
            <textarea id="message" {...register("message")} maxLength={2000} />
          </Field>
        </>
      )}
      {step === 2 && (
        <>
          <h2>
            Make a little
            <br />
            <em>time for us.</em>
          </h2>
          <BookingCalendar
            value={values.startAt}
            onChange={(value) => setValue("startAt", value, { shouldValidate: true })}
            onTimezone={updateTimezone}
          />
          {errors.startAt && (
            <p role="alert" className="field-error">
              Please choose an available time.
            </p>
          )}
        </>
      )}
      {step === 3 && (
        <>
          <h2>
            Your story
            <br />
            <em>starts here.</em>
          </h2>
          <dl className="summary">
            <dt>Coverage</dt>
            <dd>{values.consultationType}</dd>
            <dt>Name</dt>
            <dd>{values.name}</dd>
            <dt>Email</dt>
            <dd>{values.email}</dd>
            <dt>Phone</dt>
            <dd>{values.phone}</dd>
            <dt>Event</dt>
            <dd>
              {values.eventType} · {values.eventDate}
            </dd>
            <dt>Location</dt>
            <dd>{values.eventLocation}</dd>
            <dt>Consultation</dt>
            <dd>
              {values.startAt && appointmentLabel(values.startAt, timezone)} ({timezone})
            </dd>
            {values.message && (
              <>
                <dt>Message</dt>
                <dd>{values.message}</dd>
              </>
            )}
          </dl>
          <p className="notice">
            Submitting requests a consultation. The studio will contact you to confirm. Your details
            are used to respond to this enquiry; see our{" "}
            <a className="text-link" href="/privacy">
              privacy information
            </a>
            .
          </p>
        </>
      )}
      {error && (
        <p role="alert" className="error-message">
          {error}
        </p>
      )}
      <div className="form-actions">
        {step > 0 ? (
          <button
            className="button button-secondary"
            type="button"
            disabled={isSubmitting}
            onClick={() => setStep(step - 1)}
          >
            Back
          </button>
        ) : (
          <span />
        )}
        {step < 3 ? (
          <button
            className="button"
            key="continue"
            type="button"
            onClick={(event) => {
              event.preventDefault();
              void next();
            }}
          >
            Continue →
          </button>
        ) : (
          <button key="submit-request" className="button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending request…" : "Request consultation ↗"}
          </button>
        )}
      </div>
    </form>
  );
}
