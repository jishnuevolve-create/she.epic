import { ButtonLink } from "@/components/ui/Button";
export function BookingCTA() {
  return (
    <section className="booking-cta container">
      <span className="eyebrow">EVERY STORY STARTS WITH A CONVERSATION</span>
      <h2>
        Your day. Your people.
        <br />
        <em>Your forever.</em>
      </h2>
      <p>Tell us what you’re dreaming of. We’ll begin there.</p>
      <ButtonLink href="/book-consultation">Let’s create something beautiful</ButtonLink>
    </section>
  );
}
