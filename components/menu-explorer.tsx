"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X, ArrowUpRight } from "lucide-react";
import * as menu from "@/menu/menu";
type Item = {
  code: string;
  name: string;
  price: number;
  newPrice?: number | null;
};
type Section = { section: string; items: Item[] };
const groups: Record<string, Section[]> = {
  Shisha: [menu.shishas],
  Drinks: [
    menu.cocktails,
    menu.mocktailsOhneAlkohol,
    menu.spritz,
    // menu.softgetraenke,
    menu.saefte,
    menu.heissgetraenke,
    menu.bier,
    menu.aperitif,
    menu.likoere,
    menu.vodka,
    menu.whiskys,
    menu.rum,
    menu.gin,
    menu.wein,
    menu.prosecco,
    menu.champagner,
    menu.shots,
  ],
  Food: [menu.speisen, menu.snacks, menu.dessert, menu.iceCream],
};
const price = (value: number) =>
  new Intl.NumberFormat("de-CH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
export default function MenuExplorer() {
  const params = useSearchParams();
  const initial = params.get("category") || "Alle";
  return <MenuContent key={initial} initial={initial} />;
}
export function MenuContent({ initial }: { initial: string }) {
  const [category, setCategory] = useState(
    Object.prototype.hasOwnProperty.call(groups, initial) ? initial : "Alle",
  );
  const [query, setQuery] = useState("");
  const all =
    category === "Alle" ? Object.values(groups).flat() : groups[category];
  const term = query.trim().toLocaleLowerCase("de-CH");
  const filtered = all
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        `${item.name} ${item.code} ${section.section}`
          .toLocaleLowerCase("de-CH")
          .includes(term),
      ),
    }))
    .filter((section) => section.items.length);
  const count = filtered.reduce((sum, s) => sum + s.items.length, 0);
  return (
    <div className="menu-explorer">
      <div className="menu-toolbar">
        <div className="category-tabs" aria-label="Menükategorien">
          {["Alle", "Shisha", "Drinks", "Food"].map((c) => (
            <button
              key={c}
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
            >
              {c === "Food" ? "Food & Sweets" : c}
              <span>
                {c === "Alle"
                  ? Object.values(groups)
                      .flat()
                      .reduce((n, s) => n + s.items.length, 0)
                  : groups[c].reduce((n, s) => n + s.items.length, 0)}
              </span>
            </button>
          ))}
        </div>
        <div className="search-field">
          <Search size={18} />
          <input
            aria-label="Menü durchsuchen"
            placeholder="Worauf hast du Lust?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button aria-label="Suche löschen" onClick={() => setQuery("")}>
              <X size={17} />
            </button>
          )}
        </div>
      </div>
      <div className="menu-meta">
        <span aria-live="polite">
          {count} ENTDECKUNGEN{query ? ` FÜR „${query}“` : " FÜR DEINEN ABEND"}
        </span>
        <span>ALLE PREISE IN CHF</span>
      </div>
      {filtered.length ? (
        <div className="menu-sections">
          {filtered.map((section, index) => (
            <section key={section.section} className="menu-section">
              <div className="menu-section-title">
                <span className="eyebrow">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2>{section.section}</h2>
                {section.section === "SHISHAS" && (
                  <p>Finde deinen Lieblingsgeschmack.</p>
                )}
              </div>
              <div className="menu-items">
                {section.items.map((item, i) => (
                  <div key={`${item.code}-${i}`} className="menu-item">
                    <div>
                      <h3>{item.name}</h3>
                      <span className="item-code">{item.code}</span>
                    </div>
                    <div className="item-price">
                      {item.newPrice != null && <del>{price(item.price)}</del>}
                      <span>{price(item.newPrice ?? item.price)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>Noch nicht das Richtige?</h2>
          <p>Versuche einen anderen Suchbegriff oder eine andere Kategorie.</p>
          <button
            className="button"
            onClick={() => {
              setQuery("");
              setCategory("Alle");
            }}
          >
            Alle anzeigen <ArrowUpRight size={17} />
          </button>
        </div>
      )}
      <div className="menu-note">
        <span>GUT ZU WISSEN</span>
        <p>
          Fragen zu Zutaten oder Allergenen? Sprich uns vor deiner Bestellung
          an.
        </p>
      </div>
    </div>
  );
}
