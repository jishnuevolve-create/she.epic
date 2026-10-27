import { expect, it } from "vitest";
import { filterStories } from "@/features/portfolio/utils";
import { stories } from "@/features/portfolio/data/stories";
it("returns all stories without losing their order", () =>
  expect(filterStories(stories, "All Stories")).toEqual(stories));
it("filters only the selected category", () =>
  expect(filterStories(stories, "Weddings").every((story) => story.category === "Weddings")).toBe(
    true,
  ));
it("does not fabricate films for stories without a source", () =>
  expect(filterStories(stories, "Films")).toEqual([]));
