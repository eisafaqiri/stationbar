import type { Metadata } from "next";
import { Suspense } from "react";
import MenuExplorer, { MenuContent } from "@/components/menu-explorer";
import { pageMetadata } from "@/lib/site";
export const metadata: Metadata = pageMetadata(
  "Karte – Shisha, Cocktails & Snacks",
  "Entdecke die Staionbar-Karte in Wohlen: Shishas, Cocktails, alkoholfreie Drinks, Food und Süsses mit Preisen in CHF.",
  "/menu",
);
export default function MenuPage() {
  return (
    <main id="main" className="menu-page">
      <div className="page-intro">
        <span className="eyebrow">STAIONBAR / DIE KARTE</span>
        <h1>
          Dein Geschmack.
          <br />
          <em>Dein Abend.</em>
        </h1>
        <p>Lieblingsdrinks, feine Shishas und etwas für den kleinen Hunger.</p>
      </div>
      <Suspense fallback={<MenuContent initial="Alle" />}>
        <MenuExplorer />
      </Suspense>
    </main>
  );
}
