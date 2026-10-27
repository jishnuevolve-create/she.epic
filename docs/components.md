# Components and content

Shared ButtonLink, Field, SectionHeading, Modal, Photo and Reveal components own recurring presentation. Header and Footer are mounted once in the root layout.

Modal uses a native dialog for focus trapping and Escape behavior, restores focus and locks background scrolling. The photo lightbox adds arrow keys and swipe gestures. Navigation uses active-route indicators and a modal mobile menu. Motion honors reduced-motion preferences; CSS also disables optional animation.

Photo wraps Next Image with responsive sizes, reserved layout dimensions and an error fallback. Only opening imagery is prioritized. FilmPlayer mounts external embeds only after interaction and unmounts on close.

The booking form owns wizard state and client feedback; BookingCalendar requests live availability. Business validation belongs in the shared schema and server service. Database rules remain authoritative. Contact uses the same form/input conventions.

Content sources:

- config/site.ts: business identifiers, contact links, hero and approved testimonials.
- config/services.ts: service copy and imagery.
- features/portfolio/data/stories.ts: curated stories, categories, gallery photographs and optional film sources.

Missing credentials and media must stay visible as honest unavailable/empty states. Do not add fictional couples, quotations, achievements or prices to fill sections.
