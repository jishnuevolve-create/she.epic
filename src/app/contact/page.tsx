import { ContactForm } from "@/features/contact/ContactForm";
import { site } from "@/config/site";
import { ButtonLink } from "@/components/ui/Button";
export const metadata = {
  title: "Contact",
  description: "Get in touch with She.Epics about your wedding photography and films.",
  alternates: { canonical: "/contact" },
};
export default function Contact() {
  return (
    <>
      <section className="container page-intro">
        <span className="eyebrow">A CONVERSATION, A CONNECTION</span>
        <h1>
          We’d love to
          <br />
          <em>hear your story.</em>
        </h1>
      </section>
      <section className="container form-layout">
        <aside>
          <p>
            A question, a plan, a date you have in mind. Leave us a note and we’ll take it from
            there.
          </p>
          {site.email && (
            <p>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
          )}
          {site.phone && (
            <p>
              <a href={`tel:${site.phone}`}>{site.phone}</a>
            </p>
          )}
          {site.address && <p>{site.address}</p>}
          {site.whatsapp && (
            <p>
              <a className="text-link" href={site.whatsapp}>
                Chat on WhatsApp ↗
              </a>
            </p>
          )}
          {site.instagram && (
            <p>
              <a className="text-link" href={site.instagram}>
                Find us on Instagram ↗
              </a>
            </p>
          )}
          <h3>Prefer a conversation?</h3>
          <ButtonLink href="/book-consultation">Book a consultation</ButtonLink>
        </aside>
        <ContactForm />
      </section>
    </>
  );
}
