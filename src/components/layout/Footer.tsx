import Link from "next/link";
import { site, navigation } from "@/config/site";
export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-top">
        <div>
          <p className="footer-brand">She.Epics</p>
          <p>
            For the moments.
            <br />
            For the memories.
            <br />
            For you.
          </p>
        </div>
        <nav aria-label="Footer navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div>
          <span className="eyebrow">BEGIN YOUR STORY</span>
          <Link className="footer-contact" href="/book-consultation">
            Let’s talk about your day ↗
          </Link>
          {site.email && <a href={`mailto:${site.email}`}>{site.email}</a>}
          {site.instagram && <a href={site.instagram}>Instagram ↗</a>}
          {site.whatsapp && <a href={site.whatsapp}>WhatsApp ↗</a>}
        </div>
      </div>
      <div className="container footer-bottom">
        <small>© {new Date().getFullYear()} She.Epics Photography</small>
        <small>Made for memories that stay.</small>
        <Link href="/privacy">Privacy</Link>
      </div>
    </footer>
  );
}
