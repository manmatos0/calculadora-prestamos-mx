import type { MetadataRoute } from "next";
import { allowIndexing, sitePageUrl } from "@/lib/site";
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return allowIndexing
    ? { rules: { userAgent: "*", allow: "/" }, sitemap: sitePageUrl("/sitemap.xml").href }
    : { rules: { userAgent: "*", disallow: "/" } };
}
