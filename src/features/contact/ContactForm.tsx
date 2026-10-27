"use client";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "./schema";
import { Field } from "@/components/ui/Field";
export function ContactForm() {
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const requestId = useRef<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Omit<ContactInput, "requestId">>({
    resolver: zodResolver(contactSchema.omit({ requestId: true })),
    defaultValues: { name: "", email: "", message: "", website: "" },
  });
  async function submit(values: Omit<ContactInput, "requestId">) {
    setError("");
    requestId.current ||= crypto.randomUUID();
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, requestId: requestId.current }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Message could not be sent.");
      setResult(data.message);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not connect. Please try again.");
    }
  }
  if (result)
    return (
      <div className="success-panel" role="status">
        <h2>Thank you.</h2>
        <p>{result}</p>
      </div>
    );
  return (
    <form
      className="form-panel"
      onSubmit={(event) => {
        void handleSubmit(submit)(event);
      }}
      noValidate
    >
      <h2>A note to the studio.</h2>
      <Field label="Your name" id="contact-name" error={errors.name?.message}>
        <input
          id="contact-name"
          autoComplete="name"
          {...register("name")}
          aria-invalid={!!errors.name}
        />
      </Field>
      <Field label="Email address" id="contact-email" error={errors.email?.message}>
        <input
          id="contact-email"
          type="email"
          autoComplete="email"
          {...register("email")}
          aria-invalid={!!errors.email}
        />
      </Field>
      <Field label="Your message" id="contact-message" error={errors.message?.message}>
        <textarea id="contact-message" {...register("message")} aria-invalid={!!errors.message} />
      </Field>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>
      <p className="notice">
        We use these details to respond to your enquiry.{" "}
        <a className="text-link" href="/privacy">
          Privacy information
        </a>
      </p>
      {error && (
        <p role="alert" className="error-message">
          {error}
        </p>
      )}
      <button className="button" disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Send your note ↗"}
      </button>
    </form>
  );
}
