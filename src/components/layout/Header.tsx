"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { site, navigation } from "@/config/site";
import { Modal } from "@/components/ui/Modal";
export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const change = () => setScrolled(window.scrollY > 30);
    change();
    window.addEventListener("scroll", change, { passive: true });
    return () => window.removeEventListener("scroll", change);
  }, []);
  const links = navigation.map((item) => (
    <Link
      key={item.href}
      href={item.href}
      aria-current={path.startsWith(item.href) ? "page" : undefined}
      onClick={() => setOpen(false)}
    >
      {item.label}
    </Link>
  ));
  return (
    <header className={`header ${path === "/" && !scrolled ? "header-transparent" : ""}`}>
      <Link href="/" className="brand" aria-label="She.Epics Photography home">
        {site.logo ? (
          <Image
            src={site.logo}
            alt="She.Epics Photography"
            width={160}
            height={60}
            style={{ objectFit: "contain" }}
          />
        ) : (
          <span>
            She.Epics<small>PHOTOGRAPHY</small>
          </span>
        )}
      </Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        {links}
      </nav>
      <Link href="/book-consultation" className="header-book">
        Let’s make memories <span aria-hidden="true">↗</span>
      </Link>
      <button
        className="mobile-toggle icon-button"
        aria-label="Open navigation"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Menu />
      </button>
      {open && (
        <Modal title="Navigation" onClose={() => setOpen(false)}>
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {links}
            <Link href="/book-consultation" onClick={() => setOpen(false)}>
              Book a consultation
            </Link>
          </nav>
        </Modal>
      )}
    </header>
  );
}
