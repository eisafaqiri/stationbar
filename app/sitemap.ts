import type { MetadataRoute } from "next";
import { indexable, siteUrl } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  return indexable
    ? ["/", "/menu", "/kontakt"].map((path) => ({
        url: new URL(path, siteUrl).href,
      }))
    : [];
}
