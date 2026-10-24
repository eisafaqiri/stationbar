import type { Metadata } from "next";
const configuredUrl = process.env.SITE_URL?.trim();
export const siteUrl = new URL(configuredUrl || "http://localhost:3000");
if (
  configuredUrl &&
  (siteUrl.protocol !== "https:" ||
    siteUrl.pathname !== "/" ||
    siteUrl.search ||
    siteUrl.hash ||
    siteUrl.username ||
    siteUrl.password)
)
  throw new Error("SITE_URL must be an HTTPS origin");
export const indexable =
  Boolean(configuredUrl) && process.env.SITE_INDEXABLE === "true";
export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "Staionbar",
      locale: "de_CH",
      type: "website",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Staionbar – Shisha, Bar & Lounge in Wohlen",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}
export const localBusiness = {
  "@context": "https://schema.org",
  "@type": "BarOrPub",
  "@id": new URL("/#business", siteUrl).href,
  name: "Staionbar",
  url: siteUrl.href,
  telephone: "+41 76 235 50 00",
  email: "stationbar4@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Bahnhofplatz 1",
    postalCode: "5610",
    addressLocality: "Wohlen",
    addressCountry: "CH",
  },
  hasMenu: new URL("/menu", siteUrl).href,
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Thursday", "Sunday"],
      opens: "16:00",
      closes: "23:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Friday", "Saturday"],
      opens: "16:00",
      closes: "02:00",
    },
  ],
};
