import { z } from "zod";
export const consultationTypes = [
  "Wedding Photography",
  "Wedding Cinematography",
  "Photography + Film",
  "Pre-Wedding",
  "General Consultation",
] as const;
export const dateOnly = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine(
    (value) =>
      !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value,
    "Enter a valid date.",
  );
export const bookingSchema = z
  .object({
    requestId: z.uuid(),
    consultationType: z.enum(consultationTypes),
    name: z.string().trim().min(2, "Please enter your name.").max(100),
    email: z.email().max(254),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[\d\s()-]{8,22}$/, "Enter a valid phone number."),
    eventType: z.string().trim().min(2).max(80),
    eventDate: dateOnly,
    eventLocation: z.string().trim().min(2).max(200),
    message: z.string().trim().max(2000),
    startAt: z.iso.datetime({ offset: true }),
    website: z.string().max(0),
  })
  .strict();
export type BookingInput = z.infer<typeof bookingSchema>;
