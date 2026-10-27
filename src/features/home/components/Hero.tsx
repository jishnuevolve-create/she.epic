import { Photo } from "@/components/shared/Photo";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/shared/Reveal";
import { site } from "@/config/site";
export function Hero() {
  return (
    <section className="hero">
      <Photo
        src={site.hero}
        alt="A wedding celebration framed by flowers and warm light"
        priority
        sizes="100vw"
      />
      <div className="hero-shade" />
      <div className="container hero-content">
        <Reveal>
          <span className="eyebrow">THE ART OF REMEMBERING</span>
          <h1>
            Some moments
            <br />
            deserve to become
            <br />
            <em>forever.</em>
          </h1>
          <p>{site.description}</p>
          <div className="button-row">
            <ButtonLink href="/portfolio">Explore our stories</ButtonLink>
            <ButtonLink href="/book-consultation" secondary>
              Book your date
            </ButtonLink>
          </div>
        </Reveal>
      </div>
      <div className="hero-bottom container">
        <span>WEDDING PHOTOGRAPHY & FILMS</span>
        <a href="#introduction">SCROLL TO FEEL MORE ↓</a>
      </div>
    </section>
  );
}
