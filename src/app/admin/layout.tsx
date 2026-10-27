export const metadata = { title: "Studio administration", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="container section">{children}</div>;
}
