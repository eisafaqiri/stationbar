import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header, Footer } from "@/components/site-shell";
import "./globals.css";
import { siteUrl, indexable } from "@/lib/site";
const geist = localFont({
  src: "../node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2",
  variable: "--font-geist",
  display: "swap",
});
const display = localFont({
  src: "../node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-700-normal.woff2",
  variable: "--font-display",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: "Staionbar",
  robots: { index: indexable, follow: indexable },
  formatDetection: { telephone: false },
  title: {
    default: "Staionbar — Shisha, Bar & Lounge in Wohlen",
    template: "%s | Staionbar Wohlen",
  },
  description:
    "Dein Abend am Bahnhofplatz: Shisha, Cocktails und entspannte Lounge-Momente in der Staionbar, Bahnhofplatz 1, 5610 Wohlen.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      data-scroll-behavior="smooth"
      lang="de-CH"
      className={geist.variable + " " + display.variable}
    >
      <body>
        <a className="skip-link" href="#main">
          Zum Inhalt
        </a>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
