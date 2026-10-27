import Link from "next/link";
import { Hero } from "./Hero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Photo } from "@/components/shared/Photo";
import { Reveal } from "@/components/shared/Reveal";
import { BookingCTA } from "@/components/shared/BookingCTA";
import { StoryCard } from "@/features/portfolio/components/StoryCard";
import { stories } from "@/features/portfolio/data/stories";
import { services } from "@/config/services";
import { site, testimonials } from "@/config/site";
export function HomePage() {
  return (
    <>
      <Hero />
      <section id="introduction" className="section container introduction">
        <span className="eyebrow">A LITTLE ABOUT US</span>
        <Reveal>
          <h2>
            Not just how it looked.
            <br />
            <em>How it felt.</em>
          </h2>
          <div className="intro-copy">
            <p>
              The nervous laughter. A hand held a little tighter. The people who make a place feel
              like home.
            </p>
            <p>
              At She.Epics, these are the moments we look for. Photographs and films that hold the
              feeling of your day, long after the last song.
            </p>
            <Link className="text-link" href="/about">
              Meet the studio ↗
            </Link>
          </div>
        </Reveal>
      </section>
      <section className="section cream">
        <div className="container">
          <div className="section-row">
            <SectionHeading label="THE STORIES WE TELL">
              Love, in its
              <br />
              <em>own words.</em>
            </SectionHeading>
            <p>
              No two celebrations feel the same.
              <br />
              Your photographs shouldn’t either.
            </p>
          </div>
          <div className="story-grid">
            {stories.slice(0, 2).map((story) => (
              <StoryCard key={story.slug} story={story} />
            ))}
          </div>
          <div className="section-end">
            <ButtonLink href="/portfolio" secondary>
              Discover all stories
            </ButtonLink>
          </div>
        </div>
      </section>
      <section className="section container services-preview">
        <SectionHeading label="THOUGHTFULLY SEEN. BEAUTIFULLY KEPT.">
          A way to remember
          <br />
          <em>every chapter.</em>
        </SectionHeading>
        <div>
          {services.slice(0, 3).map((service) => (
            <Link key={service.title} href="/services" className="service-row">
              <h3>{service.title}</h3>
              <span aria-hidden="true">↗</span>
              <p>{service.description}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="film-preview">
        <Photo src={services[1].image} alt="Wedding couple together" sizes="100vw" />
        <div className="film-overlay">
          <span className="eyebrow">FEEL IT ALL OVER AGAIN</span>
          <h2>
            Some stories
            <br />
            <em>need to move.</em>
          </h2>
          <ButtonLink href="/films" secondary>
            Explore wedding films
          </ButtonLink>
        </div>
      </section>
      <section className="section container approach">
        <div className="approach-image">
          <Photo src={services[2].image} alt="A couple enjoying an unhurried moment together" />
        </div>
        <div>
          <SectionHeading label="PRESENT IN THE MOMENT">
            Less posing.
            <br />
            <em>More being.</em>
          </SectionHeading>
          <p>
            We make room for the unexpected. The fleeting glances, the loud laughter, the quiet
            pauses. A considered approach that lets you stay in your day.
          </p>
          <div className="approach-details">
            <h3>A conversation first</h3>
            <p>Your plans, your people, and what matters most to you.</p>
            <h3>Space to be yourselves</h3>
            <p>Gentle direction when you need it. Room to forget the camera when you don’t.</p>
            <h3>A story with intention</h3>
            <p>
              A carefully considered collection, with the little moments kept alongside the big
              ones.
            </p>
          </div>
        </div>
      </section>
      {testimonials.length > 0 && (
        <section className="section cream">
          <div className="container">
            <SectionHeading label="WORDS FROM OUR COUPLES">Remembered with love.</SectionHeading>
            {testimonials.map((item) => (
              <blockquote key={item.attribution}>
                <p>{item.quote}</p>
                <cite>{item.attribution}</cite>
              </blockquote>
            ))}
          </div>
        </section>
      )}
      <section className="consultation-preview charcoal">
        <div className="container section-row">
          <SectionHeading label="LET’S BEGIN">
            A little conversation.
            <br />
            <em>A beautiful beginning.</em>
          </SectionHeading>
          <div>
            <p>
              Share your plans, explore what feels right, and request a time to speak with the
              studio.
            </p>
            <p className="muted-light">Every request is personally reviewed before confirmation.</p>
            <ButtonLink href="/book-consultation">Request a consultation</ButtonLink>
          </div>
        </div>
      </section>
      {site.instagram && (
        <section className="section container">
          <div className="section-row">
            <SectionHeading label="BETWEEN THE BIG MOMENTS">From the journal.</SectionHeading>
            <a href={site.instagram} className="text-link">
              Follow on Instagram ↗
            </a>
          </div>
          <div className="instagram-grid">
            {stories.map((story) => (
              <a
                key={story.slug}
                href={site.instagram}
                className="instagram-photo"
                aria-label="Visit She.Epics on Instagram"
              >
                <Photo src={story.cover} alt={story.images[0].alt} />
              </a>
            ))}
          </div>
        </section>
      )}
      <BookingCTA />
      <p className="asset-notice container">
        Preview photography is used for layout reference and is not presented as She.Epics client
        work. Official imagery and brand logo are pending.
      </p>
    </>
  );
}
