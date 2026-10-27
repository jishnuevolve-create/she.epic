import Link from "next/link";
import { Photo } from "@/components/shared/Photo";
import type { Story } from "../types";
export function StoryCard({ story }: { story: Story }) {
  return (
    <article className="story-card">
      <Link href={`/portfolio/${story.slug}`} className="story-image">
        <Photo src={story.cover} alt={story.images[0].alt} />
      </Link>
      <div className="story-caption">
        <div>
          <span className="eyebrow">
            {story.category}
            {story.sample ? " · EDITORIAL SAMPLE" : ""}
          </span>
          <h3>
            <Link href={`/portfolio/${story.slug}`}>{story.title}</Link>
          </h3>
        </div>
        <Link href={`/portfolio/${story.slug}`} aria-label={`View ${story.title}`}>
          ↗
        </Link>
      </div>
    </article>
  );
}
