import type { MetadataRoute } from "next";

import { SITE_URL } from "@/utils/site";

/** Serves /robots.txt. Nothing here is private, so the whole site is crawlable. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
