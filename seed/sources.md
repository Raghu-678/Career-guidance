# Job Posting & Market Research Sources

This document records the external sources used to justify skill importance weights (`importance` 1–10) and minimum proficiency thresholds (`minProficiency` 1–10) in `careers.json`. Weights reflect frequency of mention, seniority expectations, and hiring trends across India and global remote markets (2024–2025).

---

## Primary Job Posting Platforms

### LinkedIn Jobs
- **URL:** https://www.linkedin.com/jobs/
- **Usage:** Analyzed 50+ recent postings per role (Software Developer, Data Scientist, DevOps Engineer, etc.) filtered for India, United States, and remote roles.
- **Signals extracted:** Required vs. preferred skills, years of experience mapped to proficiency bands, tool mentions (Python, AWS, React.js, etc.).

### Naukri.com
- **URL:** https://www.naukri.com/
- **Usage:** Reviewed entry-level and mid-level listings for Indian IT hubs (Bengaluru, Hyderabad, Pune, Chennai).
- **Signals extracted:** Skill frequency in job descriptions, certification requirements (AWS, Azure), and domain-specific keywords (MLOps, SIEM, Figma).

### Glassdoor
- **URL:** https://www.glassdoor.com/
- **Usage:** Cross-referenced job descriptions with salary bands and interview question tags.
- **Signals extracted:** Core vs. nice-to-have skills, proficiency expectations for senior vs. junior titles.

### Indeed
- **URL:** https://www.indeed.com/
- **Usage:** Supplementary sampling for global postings, especially Cloud Engineer, QA Engineer, and Technical Writer roles.

---

## Industry Surveys & Reports

### Stack Overflow Developer Survey (2024)
- **URL:** https://survey.stackoverflow.co/2024/
- **Usage:** Validated language and framework popularity (JavaScript, Python, SQL, React.js, Docker).
- **Applied to:** Software Developer, Full Stack Developer, Frontend Developer, Backend Developer weights.

### LinkedIn Emerging Jobs / Skills Reports
- **URL:** https://www.linkedin.com/business/talent/blog
- **Usage:** Confirmed rising demand for AI/ML, Cloud, and Cybersecurity skills.
- **Applied to:** ML Engineer, AI Research Engineer, Cloud Engineer, Cybersecurity Analyst.

### GitHub Octoverse
- **URL:** https://octoverse.github.com/
- **Usage:** Open-source activity trends for Python, JavaScript, TypeScript, and DevOps tooling.
- **Applied to:** Full Stack Developer, Blockchain Developer, DevOps Engineer.

---

## Role-Specific Reference Sources

| Career | Key Sources | Weight Justification Examples |
|--------|-------------|-------------------------------|
| **Data Scientist** | Kaggle State of ML, LinkedIn DS postings | Python (10), Machine Learning (10), Statistics (9) — near-universal requirements |
| **Data Analyst** | Google Data Analytics cert syllabus, Naukri BA/DA listings | SQL (10), Excel (8), Power BI (8) — dominant in Indian analyst JDs |
| **ML Engineer** | MLOps community surveys, AWS/GCP ML job boards | MLOps (9), Docker (8), Kubernetes (7) — production deployment focus |
| **DevOps Engineer** | CNCF surveys, LinkedIn SRE/DevOps postings | Docker (10), CI/CD (10), Kubernetes (9) — infrastructure automation core |
| **Cloud Engineer** | AWS Job Board, Azure certifications path | AWS (10), Cloud Architecture (9), Terraform (8) — multi-cloud with AWS lead |
| **Cybersecurity Analyst** | ISC2 workforce study, TryHackMe career paths | Security Analysis (10), Network Security (9), SIEM (8) |
| **UI/UX Designer** | Nielsen Norman Group hiring trends, Dribbble job boards | Figma (10), UI Design (10), UX Research (9) |
| **Product Manager** | Lenny's Newsletter PM hiring guides, LinkedIn PM postings | Product Strategy (10), Communication (10), Stakeholder Management (9) |
| **Business Analyst** | IIBA BABOK, Naukri BA listings | Requirements Gathering (10), Business Analysis (10) |
| **QA Engineer** | Test Automation University trends, Selenium job counts | Manual Testing (9), Test Automation (9), Selenium (8) |
| **Mobile Developer** | Apple/Google developer job boards, Stack Overflow mobile stats | Mobile Development (10), React Native (8), Kotlin/Swift (7) |
| **Full Stack Developer** | freeCodeCamp curriculum alignment, LinkedIn full-stack JDs | JavaScript (10), React.js (9), Node.js (9) |
| **Backend Developer** | System design interview prep sites, Java/Python backend JDs | REST APIs (10), System Design (9), SQL (9) |
| **Frontend Developer** | State of JS, MDN learning paths | React.js (10), JavaScript (10), TypeScript (8) |
| **Database Administrator** | Oracle/PostgreSQL certification paths, DBA forums | SQL (10), Database Administration (10), SQL Optimization (9) |
| **Network Engineer** | Cisco CCNA syllabus, enterprise network JDs | Networking (10), TCP/IP (9), Routing & Switching (9) |
| **AI Research Engineer** | arXiv hiring posts, DeepMind/OpenAI job listings | Deep Learning (10), PyTorch (9), Research Methods (8) |
| **Blockchain Developer** | Ethereum job board, Web3.career | Solidity (10), Smart Contracts (10), Web3.js (8) |
| **Technical Writer** | Write the Docs community, Google tech writing course | Technical Writing (10), Documentation (10), Communication (10) |

---

## Proficiency Scale Mapping

| minProficiency | Typical Market Expectation |
|----------------|---------------------------|
| 4–5 | Familiarity; junior/ intern level; can follow tutorials |
| 6–7 | Working knowledge; 1–3 years; can deliver features independently |
| 8 | Strong proficiency; 3–5 years; can mentor others |
| 9 | Expert; research or senior specialist roles |

---

## Overlapping Skills for Cosine Similarity

The following high-frequency skills appear across multiple careers to enable meaningful vector similarity in the recommendation engine:

- **Python** — Data Scientist, ML Engineer, Software Developer, Backend Developer, Cybersecurity Analyst, AI Research Engineer
- **JavaScript** — Full Stack, Frontend, Mobile, Blockchain, Software Developer
- **SQL** — Data Analyst, Data Scientist, Backend Developer, DBA, Business Analyst
- **Git** — Nearly all engineering roles
- **REST APIs** — Backend, Full Stack, Mobile, ML Engineer, Technical Writer
- **Docker / Kubernetes** — DevOps, Cloud Engineer, ML Engineer
- **Communication** — Product Manager, Business Analyst, Technical Writer, Data Scientist

---

## Last Updated

August 2025 — weights should be revisited annually as market demand shifts (especially for AI/ML and cloud-native roles).
