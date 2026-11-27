import type { MetadataRoute } from "next";
import { allowIndexing, routes, sitePageUrl } from "@/lib/site";
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return allowIndexing ? routes.map((path) => ({ url: sitePageUrl(path).href })) : [];
}
