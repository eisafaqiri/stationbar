import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { Atmosphere, Motion } from "@/components/motion";
import HeroSplash from "@/components/hero-splash";
import { localBusiness, pageMetadata } from "@/lib/site";
export const metadata = pageMetadata(
  "Shisha, Bar & Lounge in Wohlen",
  "Shisha, Cocktails und entspannte Lounge-Abende direkt am Bahnhofplatz 1 in Wohlen. Entdecke unsere Karte, Öffnungszeiten und Kontaktmöglichkeiten.",
  "/",
);
export default function Home() {
  return (
    <Motion>
      <main id="main" className="night-home">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusiness).replace(/</g, "\\u003c"),
          }}
        />
        <section className="night-hero" aria-labelledby="hero-heading">
          <Atmosphere />
          <HeroSplash />
          <div className="hero-kicker">
            <span>
              <i /> SHISHA. DRINKS. GOOD COMPANY.
            </span>
            <span>WOHLEN, CH — BAHNHOFPLATZ 1</span>
          </div>
          <div className="hero-orbit" aria-hidden="true">
            <span className="orbit-cross">+</span>
            <span className="orbit-label">THE ART OF SLOW NIGHTS</span>
          </div>
          <div className="hero-portrait">
            <Image
              src="/images/shisha-night.webp"
              alt="Schwarze Shisha mit Kristallglas und silbernen Rauchschwaden im warmen Licht"
              fill
              sizes="(max-width: 700px) 95vw, 48vw"
              preload
              className="hero-photo"
            />
          </div>
          <h1 id="hero-heading" className="night-title">
            <span className="title-left">LANGE</span>
            <span className="title-right">NÄCHTE.</span>
            <span className="title-script">Gute Zeiten.</span>
          </h1>
          <div className="hero-side-label">
            SHISHA & COCKTAIL LOUNGE / WOHLEN
          </div>
          <div className="hero-intro">
            <span className="eyebrow">WILLKOMMEN IN DER STAIONBAR</span>
            <p>
              Der Tag hat genug Tempo.
              <br />
              Dein Abend braucht nur den richtigen Ort.
            </p>
            <Link href="/menu" className="text-link">
              Entdecke die Karte <ArrowUpRight size={18} />
            </Link>
          </div>
          <a
            className="scroll-disc"
            href="#lounge"
            aria-label="Die Lounge entdecken"
          >
            <ArrowDown size={20} aria-hidden="true" />
          </a>
          <div className="hero-reserve">
            <a href="tel:+41762355000" className="button">
              Dein Tisch. Dein Abend. <ArrowUpRight size={19} />
            </a>
            <span>DO – SO AB 16:00 UHR</span>
          </div>
          <div className="hero-exit" aria-hidden="true">
            <span className="eyebrow">RAUS AUS DEM ALLTAG.</span>
            <p>
              Rein in <em>die Nacht.</em>
            </p>
          </div>
          <div className="hero-index">
            <span>01 / ANKOMMEN</span>
            <span>TAKE YOUR TIME.</span>
          </div>
        </section>
        <section
          id="lounge"
          className="night-story"
          aria-labelledby="story-heading"
        >
          <div className="story-top">
            <span className="eyebrow">02 / LOSLASSEN</span>
            <span className="eyebrow">WENIGER ALLTAG. MEHR MOMENT.</span>
          </div>
          <div className="story-stage">
            <div className="story-copy">
              <span className="eyebrow accent">
                GUTE ABENDE HABEN KEINEN ZEITDRUCK.
              </span>
              <h2 id="story-heading">
                <span className="story-word">ANKOMMEN.</span>
                <span className="story-word">ABSCHALTEN.</span>
                <span className="story-word italic-word">BLEIBEN.</span>
              </h2>
              <p>
                Deine Lieblingsshisha. Eis im Glas. Gute Gespräche.
                <br />
                Mitten in Wohlen schaffen wir Platz für das,
                <br className="desktop-break" /> was einen Abend besonders
                macht.
              </p>
              <Link href="/kontakt" className="text-link">
                Hier findest du uns <ArrowUpRight size={18} />
              </Link>
            </div>
            <div className="story-photo-wrap">
              <div className="story-image">
                <Image
                  src="/images/cocktail-night.webp"
                  alt="Amberfarbener Cocktail mit Eis und Orangenzeste in stimmungsvoll dunkler Atmosphäre"
                  fill
                  sizes="(max-width: 700px) 100vw, 55vw"
                />
              </div>
              <span className="photo-caption">SLOW SIPS. LONG TALKS.</span>
              <div className="story-seal" aria-hidden="true">
                <span>STAIONBAR</span>
                <b className="seal-monogram">s</b>
                <span>AFTER HOURS</span>
              </div>
            </div>
          </div>
          <div className="story-bottom">
            <span>SHISHA CULTURE</span>
            <i />
            <span>COCKTAIL MOMENTS</span>
            <i />
            <span>GOOD COMPANY</span>
          </div>
        </section>
        <section className="night-menu" aria-labelledby="menu-heading">
          <div className="menu-heading-row">
            <div>
              <span className="eyebrow">03 / GENIESSEN</span>
              <h2 id="menu-heading">
                <span className="menu-title-mask">
                  <span className="menu-title-line">DEINE NACHT.</span>
                </span>
                <span className="menu-title-mask">
                  <em className="menu-title-line">Dein Geschmack.</em>
                </span>
              </h2>
            </div>
            <p>
              Du bringst deine Leute.
              <br />
              Wir haben den Rest.
            </p>
          </div>
          <div className="night-menu-links">
            {[
              {
                n: "01",
                title: "SHISHA",
                note: "Von frischer Minze bis zu deinem Lieblingsmix.",
                q: "Shisha",
                tag: "FIND YOUR FLAVOUR",
              },
              {
                n: "02",
                title: "DRINKS",
                note: "Cocktails, Klassiker & alkoholfreie Lieblingsdrinks.",
                q: "Drinks",
                tag: "RAISE YOUR GLASS",
              },
              {
                n: "03",
                title: "FOOD & SWEETS",
                note: "Für den kleinen Hunger. Und die süssen Momente.",
                q: "Food",
                tag: "ONE MORE BITE",
              },
            ].map((item) => (
              <Link
                key={item.n}
                href={"/menu?category=" + item.q}
                className="menu-night-row"
              >
                <span className="menu-row-rule" aria-hidden="true" />
                <span className="menu-night-number">{item.n}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.note}</p>
                </div>
                <span className="row-tag">{item.tag}</span>
                <span className="row-arrow">
                  <ArrowUpRight />
                </span>
              </Link>
            ))}
          </div>
          <div className="night-menu-bottom">
            <span>172 ENTDECKUNGEN. DEIN NÄCHSTER LIEBLING IST DABEI.</span>
            <Link className="button" href="/menu">
              Zur ganzen Karte <ArrowUpRight size={18} />
            </Link>
          </div>
        </section>
      </main>
    </Motion>
  );
}
