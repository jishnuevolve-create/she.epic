export function SectionHeading({
  label,
  children,
  text,
}: {
  label: string;
  children: React.ReactNode;
  text?: string;
}) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{label}</span>
      <h2>{children}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}
