import type { Metadata } from "next";
import { PortfolioGallery } from "@/features/portfolio/components/PortfolioGallery";
import { stories } from "@/features/portfolio/data/stories";
import { BookingCTA } from "@/components/shared/BookingCTA";
export const metadata: Metadata = {
  title: "Our stories",
  description:
    "Wedding stories, couple portraits and films, thoughtfully seen and beautifully kept.",
  alternates: { canonical: "/portfolio" },
};
export default function PortfolioPage() {
  return (
    <>
      <section className="container page-intro">
        <span className="eyebrow">THE SHE.EPICS COLLECTION</span>
        <h1>
          Different stories.
          <br />
          <em>The same feeling.</em>
        </h1>
        <p>
          A place for the big moments and the beautifully ordinary ones. Current collections show
          clearly labelled editorial references while studio stories are prepared.
        </p>
      </section>
      <section className="container section" style={{ paddingTop: 0 }}>
        <PortfolioGallery stories={stories} />
      </section>
      <BookingCTA />
    </>
  );
}
