import type { Story } from "../types";
const wedding =
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85";
const couple =
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1600&q=85";
const celebration =
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=85";
// Editorial layout samples, explicitly labelled; never represented as studio commissions.
export const stories: Story[] = [
  {
    slug: "a-day-to-remember",
    title: "A day to remember",
    category: "Weddings",
    description:
      "A photographic mood study for the She.Epics website. These reference photographs are not a She.Epics commission.",
    cover: wedding,
    sample: true,
    images: [
      { src: wedding, alt: "Wedding celebration beneath a floral installation" },
      { src: celebration, alt: "A couple together on their wedding day" },
    ],
  },
  {
    slug: "just-the-two-of-you",
    title: "Just the two of you",
    category: "Pre-Weddings",
    description:
      "An editorial reference for intimate, unhurried couple photography. Replace with an approved studio story before launch.",
    cover: couple,
    sample: true,
    images: [{ src: couple, alt: "A couple sharing a quiet moment" }],
  },
  {
    slug: "the-in-between",
    title: "The in-between",
    category: "Couple Portraits",
    description:
      "A reference collection exploring connection and movement. These photographs are layout samples.",
    cover: celebration,
    sample: true,
    images: [
      { src: celebration, alt: "Wedding couple in a moment together" },
      { src: wedding, alt: "Atmospheric wedding setting" },
    ],
  },
];
