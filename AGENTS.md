# Mohamed Elkadi - Project Guidelines & Permanent Agent Instructions

## Identity & Profile Constraints
- **Full Professional Name**: Always use `"Mohamed Elkadi"` only. (Never use middle names like "Mohamed Abdelsalam Elkadi" or extended versions).
- **Hometown / Current Location**: `"Cairo, Egypt"`. (Do NOT set hometown to Alexandria, Egypt).

---

## Strict Privacy & Data Protection Rules
1. **Confidential Information Prohibition**:
   - **NEVER** share or display personal or corporate email addresses (e.g. `mohamed.osn4@gmail.com`, `mohamed.elkadi@siemens-energy.com`).
   - **NEVER** share or display phone numbers (e.g. `01206464632`, `01063327444`).
   - **NEVER** share or display GitHub profile or repository links (`github.com/melkadi84` or `github.com/...`).
   - Only public professional profiles approved for display are LinkedIn (`https://www.linkedin.com/in/melkadi/`) and verified accreditation portals listed below.

2. **No CV Downloads**:
   - **NEVER** provide a "Download CV" button, file link, or allow downloading the CV PDF file. All qualifications, experience, and accomplishments must be rendered directly on the web page.

---

## Verified Credentials & Portals
Always showcase achievements and badges from these three official verified sources:
1. **Google Developers Profile**: https://me.developers.google.com/u/mohamed_elkadi
   - Verified Program Member since 2020
   - Google Skills Badge
   - Android Studio User Badge
2. **Credly Digital Badges**: https://www.credly.com/users/mohamedelkadi/badges
   - Cisco: Introduction to Cybersecurity
   - Cisco: Introduction to Packet Tracer
   - Cisco: Career Preparation Workshop
   - ISC2: ISC2 Candidate Badge
3. **Microsoft Learn Profile**: https://learn.microsoft.com/en-us/users/melkadise/
   - Level 6 (24,525+ XP)
   - 16 Badges & 3 Trophies (Power BI Security, Cloud Concepts, Azure Fundamentals)

---

## Contact Form & Cloudflare Database
- Maintain a direct Contact Form on the website for visitor inquiries (Full Name, Email, Subject, Message).
- The form is configured to connect to the Cloudflare D1 SQL database:
  - Database Name: `mk_contactme`
  - Database UUID: `cc5b3b12-7148-464a-9117-644c0b03305c`
  - Account ID: `f30fc791edbe31adc0ec0f7216f55126`
  - Worker code: `cloudflare-worker.js`
  - Wrangler config: `wrangler.toml`

---

## Design & Aesthetic Directives
- **Personal Brand Style**: High-end executive portfolio for an enterprise IT leader and digital enablement professional.
- **Two Color Themes (Light / Dark)**:
  - **Light Mode is the DEFAULT** theme.
  - Dark Mode is toggleable via the theme switcher in the header.
  - Persist user selection in `localStorage`.
- **No Generic AI Colors**:
  - Do NOT use standard AI neon purple, bright violet, or saturated ChatGPT teal gradients.
  - Use an executive corporate palette: Deep Enterprise Cobalt Blue (`#1d4ed8`), Spruce Teal (`#0f766e`), Warm Bronze/Amber (`#b45309`), and crisp Slate/Charcoal typography.
- **Mobile-First Responsive Design**:
  - The design must be responsive, touch-friendly, and optimized for mobile screens first, scaling gracefully to tablet, laptop, and ultra-wide displays.
