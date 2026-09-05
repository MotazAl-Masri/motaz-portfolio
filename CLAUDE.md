# Project Overview
This project is a 3D Interactive Portfolio for Motaz Al-Masri, a Backend Developer and Information Engineering student.
The core concept is "My Portfolio is my Server". The website is a 3D futuristic Central Server Core, representing a clean, professional, and highly optimized data center environment.

## 1. Tech Stack
- **Framework:** Next.js (App Router) with TypeScript.
- **Styling:** Tailwind CSS.
- **3D Engine:** Three.js via @react-three/fiber & @react-three/drei.
- **Animations:** GSAP & @gsap/react (for linking camera movement with page scroll).
- **State Management:** Zustand (for syncing HTML UI states with 3D interactions).
- **Icons:** lucide-react.

## 2. Design & Vibe
- **Theme:** Futuristic Server Core / Modern Data Center.
- **Colors:** Deep Space Black (`#050505`), Cyan/Neon Blue (`#00F0FF`) for energy/data flow, Gunmetal Grey for server chassis.
- **UI:** Minimalist, technical, resembling Developer Tools or Server Monitoring Dashboards. 
- **HTML Overlay:** The 3D scene acts as a background canvas. All textual information (Projects, Skills, etc.) MUST be standard HTML/React components overlaid on top for SEO and Accessibility.

## 3. Core Data (Strictly adhere to this, DO NOT INVENT DATA)
**About:**
- Name: Motaz Al-Masri
- Title: Backend Developer & 3rd-Year Information Engineering Student at Damascus University (2023–Present). English C2.

**Technical Skills:**
- Backend Core: .NET 10.0, C#, Node.js, Express.js, Laravel, PHP, JavaScript, Java, C++
- API & Architecture: REST API Design, Clean Architecture, Swagger/OpenAPI Documentation
- Databases & ORM: SQL Server, PostgreSQL, MySQL, Entity Framework Core (EF 10), Prisma ORM
- Testing & Security: Integration Testing (xUnit), JWT Authentication, RBAC, File Magic Bytes Validation
- Tools & DevOps: Git, GitHub Actions, Docker, Redis, BullMQ

**Experience:**
- Backend Developer Intern (Intensive Training Program) | 88ninety (July 2026 – August 2026)
  - Tech: .NET 10.0, EF Core 10, Clean Architecture.
  - Highlights: Built Hospital Storage Management System (HSMS), engineered robust logistics workflows with State Machines, wrapped inventory batch creations in atomic Database Transactions, implemented Magic Bytes validation to mitigate DoS, wrote xUnit Integration Tests.

**Projects:**
1. Khawla School Management System (Node.js) - May 2026
   - Tech: JWT, Zod, Redis Rate Limiting, Prisma Transactions, Docker, Swagger UI.
   - Highlights: 5 distinct roles, sub-50ms API responses, 100% data consistency.
2. Rental Houses Platform (StaySphere API) (Laravel) - March 2026
   - Tech: REST APIs, OTP validation.
   - Highlights: Minimized property search times by 75%, optimized relational database queries.

**Certifications:**
- C# Programming Specialization (Coursera)
- Python Developer Certification (SoloLearn)
- SQL Intermediate & Intro to SQL (SoloLearn)

*(Note: Dates like May 2026 and July 2026 are intentional and correct).*

## 4. Architecture & Folder Structure
Follow this structure:
src/
├── app/                  # Next.js pages, layout, and global CSS
├── components/
│   ├── ui/               # Standard DOM components (Cards, Nav, Buttons)
│   ├── 3d/               # Three.js components (ServerMesh, Lights, Scene)
│   └── sections/         # The main portfolio sections (Home, About, Skills...)
├── store/                # Zustand store (e.g., useAppStore.ts)
├── data/                 # Extract the CV data into a typed index.ts file here
├── hooks/                # Custom hooks (e.g., useScrollCamera)
└── utils/                # Helper functions

## 5. Development Strategy (Execute Phase by Phase)
**DO NOT build everything at once.** Follow these phases. Wait for user approval before moving to the next phase:

- **Phase 1: Project Setup & Data Extraction.** Setup Next.js boilerplate, Tailwind config, and create `src/data/index.ts` with all the provided CV data.
- **Phase 2: Base HTML UI.** Build the full website using standard HTML/Tailwind overlays (Home, About, Skills, Projects, Experience, Contact). Ensure it is fully responsive and readable.
- **Phase 3: Basic 3D Environment.** Add `<Canvas>`, standard lighting, and basic placeholder geometries (cylinders/boxes) representing the Central Core and Data Racks.
- **Phase 4: Camera & Scroll Integration (GSAP).** Implement GSAP ScrollTrigger to move the 3D camera dynamically based on the user's scroll position through the HTML sections.
- **Phase 5: 3D Refinement.** Enhance the Server models, add glowing materials (Cyan), and subtle animations (like blinking server lights).

## 6. Strict Rules
- **Performance First:** Minimize draw calls in Three.js (use InstancedMesh for server racks if applicable). Compress textures.
- **Accessibility:** Ensure the HTML overlay is semantic and accessible.
- **No Hallucination:** Only use the tech stack and personal data provided.