import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MapPin, Phone, Mail } from "lucide-react";
import { Atmosphere, Motion } from "@/components/motion";
import { pageMetadata } from "@/lib/site";
import ContactForm from "@/components/contact-form";
export const metadata: Metadata = pageMetadata(
  "Kontakt, Anfahrt & Öffnungszeiten",
  "Kontaktiere die Staionbar am Bahnhofplatz 1 in 5610 Wohlen. Kontaktformular, Telefonnummer, Anfahrt und Öffnungszeiten auf einen Blick.",
  "/kontakt",
);
const maps =
  "https://www.google.com/maps/search/?api=1&query=Bahnhofplatz+1+5610+Wohlen+Switzerland";
export default function ContactPage() {
  return (
    <Motion>
      <main id="main" className="contact-page">
        {/* <div className="page-intro">
          <Atmosphere />
          <span className="eyebrow">STAIONBAR / WIR SEHEN UNS</span>
          <h1>
            Dein nächster
            <br />
            <em>Lieblingsplatz.</em>
          </h1>
          <p>
            Direkt am Bahnhofplatz. Mitten in Wohlen. Wir freuen uns auf dich.
          </p>
        </div> */}
        <div className="contact-grid section-pad">
          <div className="contact-details reveal">
            <span className="eyebrow">KOMM VORBEI. BLEIB EIN BISSCHEN.</span>
            <h2>
              Ein Abend beginnt
              <br />
              mit einem Hallo.
            </h2>
            <a
              className="contact-row"
              href={maps}
              target="_blank"
              rel="noreferrer"
            >
              <MapPin />
              <span>
                <small>HIER FINDEST DU UNS</small>Bahnhofplatz 1<br />
                5610 Wohlen, Switzerland
              </span>
              <ArrowUpRight />
            </a>
            <a className="contact-row" href="tel:+41762355000">
              <Phone />
              <span>
                <small>FRAGEN & TISCHRESERVIERUNG</small>076 235 50 00
              </span>
              <ArrowUpRight />
            </a>
            <a className="contact-row" href="mailto:stationbar4@gmail.com">
              <Mail />
              <span>
                <small>SCHREIB UNS</small>stationbar4@gmail.com
              </span>
              <ArrowUpRight />
            </a>
          </div>
          <div className="hours-card reveal">
            <span className="eyebrow">ZEIT FÜR GUTE MOMENTE</span>
            <h2>Unsere Zeiten.</h2>
            {[
              ["Donnerstag", "16:00 – 23:00"],
              ["Freitag", "16:00 – 02:00"],
              ["Samstag", "16:00 – 02:00"],
              ["Sonntag", "16:00 – 23:00"],
            ].map(([day, time]) => (
              <div className="hours-row" key={day}>
                <span>{day}</span>
                <span>{time}</span>
              </div>
            ))}
            <p>
              Plane deinen nächsten Abend mit uns.
              <br />
              Für deinen Tisch ruf uns einfach an.
            </p>
            <a className="button" href="tel:+41762355000">
              Jetzt anrufen <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
        <ContactForm />
        <div className="location-banner section-pad reveal">
          <div className="location-graphic" aria-hidden="true">
            <div className="rail rail-one" />
            <div className="rail rail-two" />
            <div className="map-street" />
            <div className="map-pin">
              <MapPin size={26} />
              <span>staionbar</span>
            </div>
            <span className="station-label">BAHNHOF WOHLEN</span>
          </div>
          <div>
            <span className="eyebrow">DEIN ZIEL: EIN GUTER ABEND</span>
            <h2>
              Wir sind gleich
              <br />
              <em>am Bahnhof.</em>
            </h2>
            <p>Bahnhofplatz 1 · 5610 Wohlen</p>
            <a
              className="text-link"
              href={maps}
              target="_blank"
              rel="noreferrer"
            >
              Route auf Google Maps <ArrowUpRight size={20} />
            </a>
            <Link href="/menu" className="subtle-link">
              Vorher schon die Karte entdecken ↗
            </Link>
          </div>
        </div>
      </main>
    </Motion>
  );
}
