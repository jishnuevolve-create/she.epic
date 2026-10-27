export const categories = [
  "All Stories",
  "Weddings",
  "Pre-Weddings",
  "Engagements",
  "Couple Portraits",
  "Films",
] as const;
export type Category = (typeof categories)[number];
export type Film = { provider: "youtube" | "vimeo" | "local"; source: string };
export type Story = {
  slug: string;
  title: string;
  category: Category;
  location?: string;
  description: string;
  cover: string;
  images: { src: string; alt: string }[];
  film?: Film;
  sample?: boolean;
};
