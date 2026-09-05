/**
 * Absolute origin for canonical, OpenGraph, robots and sitemap URLs.
 *
 * Relative metadata URLs have to be resolved against something absolute before
 * a crawler ever sees them, so this is deliberately not guessed: set
 * NEXT_PUBLIC_SITE_URL at build time, or deploy on Vercel and let it fill in
 * the production domain. The localhost fallback only ever applies in dev — if
 * an og:url ever reads localhost in production, this variable is the reason.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
