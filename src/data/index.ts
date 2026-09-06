/**
 * Single source of truth for every piece of CV content on the site.
 * Nothing here may be invented: it mirrors the data in CLAUDE.md exactly.
 */

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

export type SectionId =
  | "home"
  | "about"
  | "skills"
  | "projects"
  | "experience"
  | "contact";

export interface NavItem {
  id: SectionId;
  /** Label shown in the navigation. */
  label: string;
  /** Route index rendered as a technical prefix (0, 1, 2, ...). */
  index: string;
}

export interface Profile {
  name: string;
  role: string;
  headline: string;
  /** Long-form sentence used for the <meta name="description"> and OG tags. */
  metaDescription: string;
  education: {
    degree: string;
    institution: string;
    period: string;
  };
  languages: string[];
}

export interface SkillGroup {
  id: string;
  label: string;
  items: string[];
}

/** A public source repository backing a project or a placement. */
export interface RepoLink {
  /** Short role of the repo, e.g. "Backend" — used as the link text. */
  label: string;
  url: string;
}

/**
 * Where the source for a record lives.
 *
 * A closed record carries no URL at all. The 88ninety and Khawla repositories
 * are private enterprise repositories, so any link to them would 404 for a
 * visitor; the UI shows a locked badge instead of a dead link.
 */
export type SourceAccess =
  | { visibility: "public"; repos: RepoLink[] }
  | { visibility: "private"; note: string };

/** Wording reused by every closed record, so the badges read identically. */
export const PRIVATE_SOURCE_NOTE = "Private Enterprise Repo (NDA)";

export interface Experience {
  id: string;
  role: string;
  programme: string;
  company: string;
  period: string;
  stack: string[];
  highlights: string[];
  /** How the source can be reached, omitted when there is no repository. */
  source?: SourceAccess;
}

export interface Project {
  id: string;
  name: string;
  platform: string;
  date: string;
  summary: string;
  stack: string[];
  highlights: string[];
  /** How the source can be reached, omitted when there is no repository. */
  source?: SourceAccess;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
}

export interface ContactChannel {
  id: string;
  label: string;
  /** `null` until the real value is supplied — never render a guessed value. */
  value: string | null;
  href: string | null;
}

/* -------------------------------------------------------------------------- */
/*  Navigation                                                                 */
/* -------------------------------------------------------------------------- */

export const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", index: "0" },
  { id: "about", label: "About", index: "1" },
  { id: "skills", label: "Skills", index: "2" },
  { id: "projects", label: "Projects", index: "3" },
  { id: "experience", label: "Experience", index: "4" },
  { id: "contact", label: "Contact", index: "5" },
];

/* -------------------------------------------------------------------------- */
/*  Profile                                                                    */
/* -------------------------------------------------------------------------- */

export const PROFILE: Profile = {
  name: "Motaz Al-Masri",
  role: "Backend Developer",
  headline:
    "Backend Developer & 3rd-Year Information Engineering Student at Damascus University.",
  metaDescription:
    "Portfolio of Motaz Al-Masri, a passionate Backend Developer and Information Engineering student specializing in scalable systems, clean architecture, and secure APIs.",
  education: {
    degree: "Information Engineering — 3rd Year",
    institution: "Damascus University",
    period: "2023 – Present",
  },
  languages: ["English — C2"],
};

/* -------------------------------------------------------------------------- */
/*  Skills                                                                     */
/* -------------------------------------------------------------------------- */

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: "backend-core",
    label: "Backend Core",
    items: [
      ".NET 10.0",
      "C#",
      "Node.js",
      "Express.js",
      "Laravel",
      "PHP",
      "JavaScript",
      "Java",
      "C++",
    ],
  },
  {
    id: "api-architecture",
    label: "API & Architecture",
    items: [
      "REST API Design",
      "Clean Architecture",
      "Swagger/OpenAPI Documentation",
    ],
  },
  {
    id: "databases-orm",
    label: "Databases & ORM",
    items: [
      "SQL Server",
      "PostgreSQL",
      "MySQL",
      "Entity Framework Core (EF 10)",
      "Prisma ORM",
    ],
  },
  {
    id: "testing-security",
    label: "Testing & Security",
    items: [
      "Integration Testing (xUnit)",
      "JWT Authentication",
      "RBAC",
      "File Magic Bytes Validation",
    ],
  },
  {
    id: "tools-devops",
    label: "Tools & DevOps",
    items: [
      "Git",
      "GitHub Actions",
      "Docker",
      "Redis",
      "BullMQ",
      "Firebase Cloud Messaging (FCM) / Push Notifications",
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Experience                                                                 */
/* -------------------------------------------------------------------------- */

export const EXPERIENCES: Experience[] = [
  {
    id: "88ninety-intern",
    role: "Backend Developer Intern",
    programme: "Intensive Training Program",
    company: "88ninety",
    period: "July 2026 – August 2026",
    stack: [".NET 10.0", "EF Core 10", "Clean Architecture"],
    highlights: [
      "Built the Hospital Storage Management System (HSMS).",
      "Engineered robust logistics workflows with State Machines.",
      "Wrapped inventory batch creations in atomic database transactions.",
      "Implemented Magic Bytes validation to mitigate DoS.",
      "Wrote xUnit integration tests.",
    ],
    source: { visibility: "private", note: PRIVATE_SOURCE_NOTE },
  },
];

/* -------------------------------------------------------------------------- */
/*  Projects                                                                   */
/* -------------------------------------------------------------------------- */

export const PROJECTS: Project[] = [
  {
    id: "khawla-sms",
    name: "Khawla School Management System",
    platform: "Node.js",
    date: "May 2026",
    summary:
      "A role-based school management API serving 5 distinct roles, built on Node.js with transactional data guarantees.",
    stack: [
      "JWT",
      "Zod",
      "Redis Rate Limiting",
      "Prisma Transactions",
      "Docker",
      "Swagger UI",
      "Firebase Cloud Messaging",
    ],
    highlights: [
      "5 distinct roles",
      "Sub-50ms API responses",
      "100% data consistency",
      "Firebase for real-time notifications",
    ],
    source: { visibility: "private", note: PRIVATE_SOURCE_NOTE },
  },
  {
    id: "staysphere-api",
    name: "Rental Houses Platform (StaySphere API)",
    platform: "Laravel",
    date: "March 2026",
    summary:
      "A rental listings platform API with OTP-validated access and query-tuned property search.",
    stack: ["REST APIs", "OTP validation"],
    highlights: [
      "Minimized property search times by 75%",
      "Optimized relational database queries",
    ],
    source: {
      visibility: "public",
      repos: [
        {
          label: "Source",
          url: "https://github.com/MotazAl-Masri/StaySphere-API",
        },
      ],
    },
  },
];

/* -------------------------------------------------------------------------- */
/*  Certifications                                                             */
/* -------------------------------------------------------------------------- */

export const CERTIFICATIONS: Certification[] = [
  {
    id: "csharp-specialization",
    name: "C# Programming Specialization",
    issuer: "Coursera",
  },
  {
    id: "python-developer",
    name: "Python Developer Certification",
    issuer: "SoloLearn",
  },
  {
    id: "sql-intermediate",
    name: "SQL Intermediate",
    issuer: "SoloLearn",
  },
  {
    id: "sql-intro",
    name: "Intro to SQL",
    issuer: "SoloLearn",
  },
];

/* -------------------------------------------------------------------------- */
/*  Contact                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Real contact details from the CV. A channel with a `null` value is skipped by
 * the Contact section rather than rendered as a guess.
 */
export const CONTACT_CHANNELS: ContactChannel[] = [
  {
    id: "email",
    label: "Email",
    value: "haitm_1969@icloud.com",
    href: "mailto:haitm_1969@icloud.com",
  },
  {
    id: "phone",
    label: "Phone",
    value: "+963959493837",
    href: "tel:+963959493837",
  },
  {
    id: "github",
    label: "GitHub",
    value: "github.com/MotazAl-Masri",
    href: "https://github.com/MotazAl-Masri",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "linkedin.com/in/motaz-al-masri-b37a833a2",
    href: "https://www.linkedin.com/in/motaz-al-masri-b37a833a2",
  },
];
