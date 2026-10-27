import { ButtonLink } from "@/components/ui/Button";
export default function NotFound() {
  return (
    <section className="container section">
      <span className="eyebrow">404</span>
      <h1>
        This chapter
        <br />
        <em>isn’t here.</em>
      </h1>
      <ButtonLink href="/">Back to the beginning</ButtonLink>
    </section>
  );
}
