import { BookingForm } from "@/features/booking/components/BookingForm";
export const metadata = {
  title: "Book a consultation",
  description: "Tell us about your celebration and request a time to speak with She.Epics.",
  alternates: { canonical: "/book-consultation" },
};
export default function BookingPage() {
  return (
    <>
      <div className="container page-intro">
        <span className="eyebrow">LET’S BEGIN YOUR STORY</span>
        <h1>
          A date to
          <br />
          <em>look forward to.</em>
        </h1>
      </div>
      <section className="container form-layout">
        <aside>
          <p>
            We’d love to hear what you’re planning. Share a few details and choose a time for a
            conversation.
          </p>
          <h3>Before the big day.</h3>
          <p>
            We’ll talk about your celebration, the people at its heart, and how you’d like to
            remember it.
          </p>
          <p className="notice">
            Consultations are requests until reviewed by the studio. All availability is shown in
            the studio’s time zone.
          </p>
        </aside>
        <BookingForm />
      </section>
    </>
  );
}
