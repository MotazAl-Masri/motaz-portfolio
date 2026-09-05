import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Scene } from "@/components/3d/Scene";
import { Backdrop } from "@/components/ui/Backdrop";
import { BootSequence } from "@/components/ui/BootSequence";
import { Footer } from "@/components/ui/Footer";
import { Navbar } from "@/components/ui/Navbar";
import { NodeDetailPanel } from "@/components/ui/NodeDetailPanel";
import { ScrollSpy } from "@/components/ui/ScrollSpy";
import { SmoothAnchors } from "@/components/ui/SmoothAnchors";
import { CONTACT_CHANNELS, PROFILE, SKILL_GROUPS } from "@/data";
import { SITE_URL } from "@/utils/site";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_TITLE = `${PROFILE.name} | ${PROFILE.role}`;
const OG_IMAGE = "/og-image.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    // Any future sub-page gets the name appended without restating it.
    template: `%s | ${PROFILE.name}`,
  },
  description: PROFILE.metaDescription,
  applicationName: `${PROFILE.name} — Portfolio`,
  keywords: [
    PROFILE.name,
    "Backend Developer",
    "Backend Developer Portfolio",
    ".NET",
    "C#",
    "Node.js",
    "Laravel",
    "REST API",
    "Clean Architecture",
    "Information Engineering",
    "Damascus University",
  ],
  authors: [{ name: PROFILE.name }],
  creator: PROFILE.name,
  publisher: PROFILE.name,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Let Google use the full OG card and snippet rather than a clipped one.
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: `${PROFILE.name} — Portfolio`,
    title: SITE_TITLE,
    description: PROFILE.metaDescription,
    locale: "en_US",
    images: [
      {
        // Placeholder until the real card art is dropped into /public.
        url: OG_IMAGE,
        // LinkedIn and X both want 1.91:1; anything else gets cropped.
        width: 1200,
        height: 630,
        alt: `${PROFILE.name} — ${PROFILE.role} portfolio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: PROFILE.metaDescription,
    images: [OG_IMAGE],
  },
  category: "technology",
};

export const viewport: Viewport = {
  // Matches the canvas clear colour, so mobile browser chrome does not flash
  // white around a black page.
  themeColor: "#050505",
  colorScheme: "dark",
};

/**
 * Person schema. Built from the same CV data the page renders, so it can never
 * drift from the visible content — which is exactly what a validator checks.
 */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: PROFILE.name,
  jobTitle: PROFILE.role,
  description: PROFILE.metaDescription,
  url: SITE_URL,
  email: CONTACT_CHANNELS.find((channel) => channel.id === "email")?.value,
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: PROFILE.education.institution,
  },
  knowsAbout: SKILL_GROUPS.flatMap((group) => group.items),
  sameAs: CONTACT_CHANNELS.filter((channel) =>
    channel.href?.startsWith("http"),
  ).map((channel) => channel.href),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-void text-signal">
        <script
          type="application/ld+json"
          // Serialised from a local object literal, never from user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <a href="#main" className="skip-link rounded-sm border border-core bg-void px-4 py-2 font-mono text-sm text-core">
          Skip to content
        </a>
        <Backdrop />
        <Scene />
        <ScrollSpy />
        <SmoothAnchors />
        <Navbar />
        {/* Sits above the canvas (z-10 over z-0) but is pointer-transparent,
            so clicks in empty regions fall through to the 3D scene. Every
            content column opts back in with pointer-events-auto. */}
        <main id="main" className="pointer-events-none relative z-10 flex-1">
          {children}
        </main>
        <NodeDetailPanel />
        <BootSequence />
        <Footer />
      </body>
    </html>
  );
}
