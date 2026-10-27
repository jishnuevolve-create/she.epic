import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { stories } from "@/features/portfolio/data/stories";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "/",
    "/about",
    "/portfolio",
    "/services",
    "/films",
    "/contact",
    "/book-consultation",
    ...stories.filter((story) => !story.sample).map((story) => `/portfolio/${story.slug}`),
  ].map((path) => ({ url: site.url + path }));
}
