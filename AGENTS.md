# Mohamed Elkadi - Project Guidelines & Permanent Agent Instructions (v2)

> For AI coding agents only. This file must NEVER be deployed to the public site
> (exclude it from the deploy, e.g. via `.assetsignore`) and must never contain real emails,
> phone numbers, account IDs, tokens or database identifiers.

---

## 1. Identity & Profile Constraints
- **Full Professional Name**: Always `"Mohamed Elkadi"` only. No middle names or extended versions.
- **Hometown / Current Location**: `"Cairo, Egypt"`. Do NOT set hometown to Alexandria.
- **Headline** (identical in hero, `<title>`, meta description, og/twitter tags, JSON-LD):
  `IT Infrastructure & Digital Solutions Specialist | Power Platform | Cybersecurity`
  Do not use "Project Development" as the main title.
- **Consistent facts on every page**: 20+ years of experience, 700+ users, Burullus Combined Cycle
  Power Plant (4,800 MW). Remove conflicting figures (e.g. "30+ projects").
- **Project counts are never hard-coded.** Any "N solutions" number, filter count or badge is computed
  from `data/projects.json` (see section 7). If the real count is below 17, show the real count.

---

## 2. Privacy & Data Protection Rules
1. **Confidential information**
   - NEVER display personal or corporate email addresses.
   - NEVER display phone numbers.
   - NEVER display or link GitHub profiles or repositories.
   - Approved public profiles: LinkedIn (`https://www.linkedin.com/in/melkadi/`) and the three
     verified portals in section 3.
2. **CV download is ALLOWED, in one controlled form**
   - Exactly one CV file: `assets/Mohamed-Elkadi-CV.pdf`, supplied and maintained by the owner.
     Agents never generate, overwrite or link any other CV version.
   - Button label: **"Download CV (PDF)"** (hero, top of About page, footer). Use a plain link with the
     `download` attribute pointing only to that file. No tracking scripts, no email gates.
   - The owner is responsible for keeping the PDF free of personal/corporate email and phone numbers
     (contact line in the PDF = LinkedIn + `melkadi.website` only, unless the owner decides otherwise).
     If asked to edit the PDF content, remind the owner of this rule.
   - Add a `_headers` rule (Cloudflare Pages / Workers static assets) so the PDF is not indexed:
     `X-Robots-Tag: noindex, nofollow` for `/assets/Mohamed-Elkadi-CV.pdf`. The owner may remove it later.
   - The About page must also read as a complete CV and print cleanly (print stylesheet: hide nav, footer,
     animations).
3. **Secrets**
   - Never write Cloudflare account IDs, database UUIDs, tokens or API keys into this file, HTML, JS or commits.
     They live only in `wrangler.toml` / Cloudflare secrets. Never commit `.env` or credential files.
4. **Screenshots & project content**
   - Every screenshot must be sanitized: no employee names, internal URLs, tenant IDs or confidential company data.
   - Each case-study page shows: "Screenshots are sanitized; confidential data removed."

---

## 3. Verified Credentials & Portals
Showcase achievements from these three official sources only:
1. **Google Developers Profile**: https://me.developers.google.com/u/mohamed_elkadi
   - Verified Program Member since 2020; Google Skills Badge; Android Studio User Badge
2. **Credly Digital Badges**: https://www.credly.com/users/mohamedelkadi/badges
   - Cisco: Introduction to Cybersecurity
   - Cisco: Introduction to Packet Tracer
   - Cisco: Career Preparation Workshop
   - ISC2 Candidate badge (candidate only, NOT a certification)
3. **Microsoft Learn Profile**: https://learn.microsoft.com/en-us/users/melkadise/
   - Level 6 (24,525+ XP); 16 Badges & 3 Trophies (Power BI Security, Cloud Concepts, Azure Fundamentals)

---

## 4. Content Integrity Rules (critical)
- The training section is titled **"Professional Training & Development"**. Every item says
  **"Training completed"**, never "Certification" or "Credential".
- NEVER claim as held credentials: "ISC2 certified", "Certified in Cybersecurity (CC)", "ISO 27001 Lead Auditor",
  "PMP", "PMI-ACP", "ITIL certified", "AZ-900 / AZ-104 certified".
  Correct example: `ISO 27001:2022 Lead Auditor - Training completed (2026)`.
- Apply the same wording in the homepage "Cybersecurity & Governance" card, About page, meta tags, JSON-LD
  and alt text.
- Never invent metrics, clients, dates, titles, projects or testimonials. If a number is missing, leave
  `<!-- TODO: add metric -->` and tell the owner. Numbers already on the site (e.g. 98.4%, 90%, 6 hours) stay
  only if the owner confirms how they were measured; flag them in the review.
- NDT methods (PT, MT, RT, UT): write "supervised" unless the owner supplies an accreditation level.
- Before finishing any task, grep for `certified`, `Certification`, `PMP`, `Lead Auditor`, `ISC2` and verify
  every hit follows these rules.

---

## 5. Job Titles (ATS-optimized, truthful)
Display these functional titles; keep the official title in parentheses where it differs.

| Company | Title to display |
|---|---|
| Siemens Energy (Jul 2020 - Present) | IT Infrastructure & Digital Solutions Specialist (Power Platform Developer, Cybersecurity Ambassador) |
| Siemens AG (Apr 2019 - Jul 2020) | IT Infrastructure & Operations Specialist |
| Five Builders (Dec 2018 - Apr 2019) | Project Coordinator - Solar EPC (50 MW) |
| Siemens HTT (Jan - Oct 2018) | Quality Assurance Manager (QA Head) |
| NEM Energy (2015 - 2018) | QA/QC Lead - NDT Inspection (ASME I, B31.1) |
| NEM Energy (2012 - 2015) | Senior Document Controller (separate entry) |
| PSC (2009 - 2012) | Project Planner & Production Control Specialist |
| HCC (2007 - 2009) | Technical Office Specialist - Engineering Submittals |
| IEMSA (2006 - 2007) | Document Controller (EDMS) |

### Experience writing rules
- Bullets: **Action + Tool + Measurable Result**. Use only numbers present on the site or supplied by the owner.
- Roles from 2006-2012: 1-2 bullets each, framed as the path toward IT/digital work.
- Consistent date format; job title before company name.

### Professional Summary (top of About)
IT Infrastructure and Digital Solutions Specialist with 20+ years in industrial and power-generation projects.
Currently at Siemens Energy (Burullus 4,800 MW plant), supporting 700+ users, building Power Platform
applications, and serving as the site Cybersecurity Ambassador. A background in QA/QC, planning, and project
coordination gives an end-to-end view of how technology supports plant operations, safety, and compliance.
(The owner will adjust the closing "seeking" sentence; the application count follows `data/projects.json`.)

---

## 6. Page Structure & Recruiter/ATS Readiness
- **Hero**: headline, one value sentence, buttons **"Download CV (PDF)"** (primary) and
  **"Connect on LinkedIn"** (secondary), plus a small "Open to opportunities" line.
- **About**: Professional Summary, grouped Key Skills (Infrastructure, Security, Automation/Power Platform,
  Cloud, Project Management), Languages (owner supplies), Experience, Education, Training & Development.
- **Testimonials**: 4 featured recommendations (full text), manual prev/next with aria-labels, NO auto-play,
  plus "See all recommendations on LinkedIn". Respect `prefers-reduced-motion`.
- **Companies strip**: each company once in the source HTML; any marquee duplication is done by JS and hidden
  from assistive tech.
- **Footer**: remove "Strict professional privacy" and "Response within 24 hours". No email, phone or GitHub.
  Keep LinkedIn, the three portals, the Download CV link and the Contact link.
- **SEO / structured data**
  - JSON-LD `Person` on the home page (name, jobTitle, url, `sameAs` = LinkedIn + 3 portals, `knowsAbout`, `worksFor`).
  - JSON-LD `CreativeWork` on every project page.
  - Absolute canonical, `og:url`, `og:image` on `https://melkadi.website/`.
  - `sitemap.xml` and `robots.txt` covering all pages (not the CV PDF). Remove `<meta name="keywords">`.
- **Semantics / accessibility**: one `<h1>` per page, ordered headings, real text (no key text inside images),
  alt text on every image, visible focus states, WCAG AA contrast in both themes.
- **Performance**: WebP images, `loading="lazy"` below the fold, explicit width/height, Lighthouse 90+.

---

## 7. Project Case-Study Pages (single source of truth)
- All projects live in `data/projects.json`. Homepage cards, portfolio cards, filter counts, the "N solutions"
  text, project pages, sitemap entries and JSON-LD are generated from it by `scripts/build-projects.mjs`.
  Generated files are committed; deployment stays fully static (no build step on Cloudflare).
- Page path: `projects/<slug>.html`. Page order: breadcrumb, title + one-line outcome + tags + my role,
  At a glance (role, timeline, users, platform, status), Problem, Solution, Impact, Screenshot gallery,
  Tech stack, Previous/Next + "Back to all projects".
- Screenshots: `assets/projects/<slug>/NN-name.webp`, alt text from the JSON. If a project has no screenshots
  yet, show a neutral "Screenshots coming soon" placeholder, never a broken image.
- Lightbox: keyboard accessible, lazy-loaded, works in Light and Dark themes.
- Fields that are unknown stay `"TODO"` in the JSON and are listed in the agent's final report; TODO text is
  never shown to visitors (hide sections whose content is still TODO, except the placeholder above).
- Every "Read case study" button and every card links to an existing page. No dead anchors.

---

## 8. Contact Form & Cloudflare Database
- The Contact Form is the only way to reach the owner (no email/phone displayed).
- Fields: Full Name, Email, Company, Role / Opportunity, Subject (dropdown: Recruiter inquiry,
  Job opportunity, Collaboration, Other), Message.
- Clear success and error states, client- and server-side validation, spam protection kept.
- Backend: Cloudflare Worker (`cloudflare-worker.js`) writing to the D1 database `mk_contactme`
  (identifiers are only in `wrangler.toml`).
- Never modify `cloudflare-worker.js`, `wrangler.toml` or `schema.sql` without showing the exact diff first.
  Schema changes require a migration shown to the owner BEFORE it is applied.

---

## 9. Design & Aesthetic Directives
- **Brand style**: high-end executive portfolio for an enterprise IT leader and digital enablement professional.
- **Themes**: Light is the DEFAULT; Dark via the header switcher; persist the choice in `localStorage`.
- **No generic AI colors**: no neon purple, bright violet or saturated ChatGPT-teal gradients.
  Palette: Deep Enterprise Cobalt Blue `#1d4ed8`, Spruce Teal `#0f766e`, Warm Bronze/Amber `#b45309`,
  crisp Slate/Charcoal typography.
- **Mobile-first**: responsive and touch-friendly, scaling to tablet, laptop and ultra-wide.
  Check layouts at 375px, 768px and desktop widths.

---

## 10. Working Agreement for Agents
- Read this file and the existing HTML/CSS/JS before editing. Small, focused changes.
- One task per commit on a feature branch (e.g. `cv-optimization`); never commit secrets; do not commit
  unless asked.
- After each task: diff summary + list of TODO markers the owner must fill.
- Prefer existing components and CSS variables over new frameworks or dependencies.
- Final review checklist: broken links, inconsistent numbers, duplicated content, leftover visible TODO text,
  prohibited credential claims (section 4), title consistency across pages and meta tags, mobile layout,
  no email/phone/GitHub anywhere in the built site or the CV PDF.