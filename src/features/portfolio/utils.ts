import type { Category, Story } from "./types";
export function filterStories(stories: Story[], category: Category) {
  return category === "All Stories"
    ? stories
    : stories.filter((story) =>
        category === "Films" ? Boolean(story.film) : story.category === category,
      );
}
