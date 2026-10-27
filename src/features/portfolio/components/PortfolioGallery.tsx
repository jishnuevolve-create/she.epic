"use client";
import { useState } from "react";
import { categories, type Category, type Story } from "../types";
import { filterStories } from "../utils";
import { StoryCard } from "./StoryCard";
export function PortfolioGallery({ stories }: { stories: Story[] }) {
  const [category, setCategory] = useState<Category>("All Stories");
  const visible = filterStories(stories, category);
  return (
    <>
      <div className="filter-bar" role="group" aria-label="Filter stories">
        {categories.map((item) => (
          <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>
            {item}
          </button>
        ))}
      </div>
      <div aria-live="polite">
        <p className="eyebrow">
          {visible.length} {visible.length === 1 ? "STORY" : "STORIES"}
        </p>
        {visible.length ? (
          <div className="story-grid">
            {visible.map((story) => (
              <StoryCard key={story.slug} story={story} />
            ))}
          </div>
        ) : (
          <p className="empty-state">Stories in this collection will be shared soon.</p>
        )}
      </div>
    </>
  );
}
