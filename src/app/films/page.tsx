import { stories } from "@/features/portfolio/data/stories";
import { FilmPlayer } from "@/features/portfolio/components/FilmPlayer";
import { Photo } from "@/components/shared/Photo";
import { BookingCTA } from "@/components/shared/BookingCTA";
export const metadata = {
  title: "Wedding films",
  description: "Wedding films that bring you back to the feeling.",
  alternates: { canonical: "/films" },
};
export default function FilmsPage() {
  const films = stories.filter((story) => story.film);
  return (
    <div className="charcoal">
      <section className="container page-intro">
        <span className="eyebrow">THE MOVING IMAGE</span>
        <h1>
          Hear the laughter.
          <br />
          <em>Feel it again.</em>
        </h1>
        <p className="muted-light">
          Wedding films for the voices, the movement and the moments a photograph can only hint at.
        </p>
      </section>
      <section className="container section" style={{ paddingTop: 0 }}>
        {films.length ? (
          films.map((story) => (
            <article key={story.slug}>
              <div className="service-photo">
                <Photo src={story.cover} alt={story.title} />
              </div>
              <h2>{story.title}</h2>
              <p>{story.description}</p>
              {story.film && <FilmPlayer film={story.film} title={story.title} />}
            </article>
          ))
        ) : (
          <div className="empty-state">
            <h2>A collection in the making.</h2>
            <p style={{ marginInline: "auto" }}>
              Our film collection will be shared here soon. Tell us about your plans to discuss
              cinematography for your celebration.
            </p>
          </div>
        )}
      </section>
      <BookingCTA />
    </div>
  );
}
