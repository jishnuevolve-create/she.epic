import { notFound } from "next/navigation";
import Link from "next/link";
import { stories } from "@/features/portfolio/data/stories";
import { Photo } from "@/components/shared/Photo";
import { LightboxGallery } from "@/features/portfolio/components/LightboxGallery";
import { FilmPlayer } from "@/features/portfolio/components/FilmPlayer";
import { StoryCard } from "@/features/portfolio/components/StoryCard";
import { BookingCTA } from "@/components/shared/BookingCTA";
export function generateStaticParams() {
  return stories.map((story) => ({ slug: story.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = stories.find((item) => item.slug === slug);
  return {
    title: story?.title || "Story not found",
    description: story?.description,
    alternates: { canonical: `/portfolio/${slug}` },
  };
}
export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = stories.findIndex((item) => item.slug === slug);
  if (index < 0) notFound();
  const story = stories[index];
  return (
    <>
      <div className="container page-intro">
        <span className="eyebrow">
          {story.category}
          {story.sample && " · EDITORIAL SAMPLE"}
        </span>
        <h1>{story.title}</h1>
        {story.location && <p>{story.location}</p>}
        <p>{story.description}</p>
      </div>
      <div className="story-hero">
        <Photo src={story.cover} alt={story.images[0].alt} priority sizes="100vw" />
      </div>
      <section className="container section">
        <LightboxGallery images={story.images} />
        {story.film && <FilmPlayer film={story.film} title={story.title} />}
        <nav className="story-navigation" aria-label="Adjacent stories">
          <Link href={`/portfolio/${stories[(index - 1 + stories.length) % stories.length].slug}`}>
            ← Previous story
          </Link>
          <Link href={`/portfolio/${stories[(index + 1) % stories.length].slug}`}>
            Next story →
          </Link>
        </nav>
      </section>
      <section className="container">
        <h2>Another chapter.</h2>
        <div className="story-grid">
          {stories
            .filter((item) => item.slug !== slug)
            .slice(0, 2)
            .map((item) => (
              <StoryCard key={item.slug} story={item} />
            ))}
        </div>
      </section>
      <BookingCTA />
    </>
  );
}
