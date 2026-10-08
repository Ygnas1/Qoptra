import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Qoptra · Industrial AI", template: "%s · Qoptra" },
  description:
    "Qoptra builds camera and AI systems for manufacturers. See how our hardware works and try the live LineSight inspection demo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
        />
      </head>
      <body>
        <header className="nav">
          <div className="container nav-inner">
            <Link href="/" aria-label="Qoptra home" className="nav-home">
              <Logo size={28} />
            </Link>
            <nav aria-label="Main">
              <Link href="/#how">How it works</Link>
              <Link href="/#hardware">Hardware</Link>
              <Link href="/demos">Demos</Link>
              <Link href="/#contact" className="nav-cta">
                Contact
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="footer">
          <div className="container footer-inner">
            <Logo size={22} />
            <span>Industrial AI, built in Austria.</span>
            <span className="mono">© {new Date().getFullYear()} Qoptra</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
