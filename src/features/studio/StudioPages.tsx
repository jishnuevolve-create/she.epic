import { Photo } from "@/components/shared/Photo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { BookingCTA } from "@/components/shared/BookingCTA";
import { services } from "@/config/services";
import { site } from "@/config/site";
export function AboutPage() {
  return (
    <>
      <section className="container page-intro">
        <span className="eyebrow">THE STUDIO</span>
        <h1>
          For the feeling
          <br />
          <em>that stays.</em>
        </h1>
        <p>
          She.Epics is a wedding photography and cinematography studio built around a simple idea:
          the most meaningful images begin with being present.
        </p>
      </section>
      <div className="about-image">
        <Photo
          src={site.hero}
          alt="Wedding celebration, editorial reference image"
          priority
          sizes="100vw"
        />
      </div>
      <section className="container section introduction">
        <span className="eyebrow">OUR APPROACH</span>
        <div>
          <h2>
            Real moments.
            <br />
            <em>Considered storytelling.</em>
          </h2>
          <p>
            A wedding is more than a sequence of events. It is a gathering of histories,
            relationships and little gestures that belong only to you. We approach that story with
            curiosity and care.
          </p>
          <p>
            We start by listening. We learn what matters to you, understand the rhythm of your
            celebration, and make a plan that leaves room for life to happen.
          </p>
        </div>
      </section>
      <section className="section cream">
        <div className="container">
          <SectionHeading label="FROM HELLO TO HEIRLOOM">The way we work.</SectionHeading>
          <div className="process">
            <div>
              <span className="eyebrow">01 · CONNECT</span>
              <h3>Tell us your story.</h3>
              <p>
                A consultation to talk about your celebration, priorities and the coverage you need.
              </p>
            </div>
            <div>
              <span className="eyebrow">02 · CREATE</span>
              <h3>Be in your day.</h3>
              <p>Thoughtful preparation and a calm presence, with guidance whenever you need it.</p>
            </div>
            <div>
              <span className="eyebrow">03 · REMEMBER</span>
              <h3>Come back to the feeling.</h3>
              <p>
                A considered edit that lets the story unfold. Delivery details are agreed with each
                couple.
              </p>
            </div>
          </div>
        </div>
      </section>
      <BookingCTA />
    </>
  );
}
export function ServicesPage() {
  return (
    <>
      <section className="container page-intro">
        <span className="eyebrow">WHAT WE DO</span>
        <h1>
          Every chapter,
          <br />
          <em>beautifully kept.</em>
        </h1>
        <p>
          Photography and films shaped around your celebration. Talk to us about your plans for
          coverage tailored to your day.
        </p>
      </section>
      <section className="container">
        {services.map((service) => (
          <article className="service-detail" key={service.title}>
            <div className="service-photo">
              <Photo src={service.image} alt={service.title + " editorial reference"} />
            </div>
            <div>
              <h2>{service.title}</h2>
              <p>{service.description}</p>
              <ButtonLink href="/book-consultation">Enquire about coverage</ButtonLink>
            </div>
          </article>
        ))}
      </section>
      <BookingCTA />
    </>
  );
}
