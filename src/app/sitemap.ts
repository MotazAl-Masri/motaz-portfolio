import type { MetadataRoute } from "next";

import { SITE_URL } from "@/utils/site";

/**
 * Serves /sitemap.xml. Single-page site: the section anchors are not separate
 * URLs, so listing them would only submit duplicates of the same document.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
