# CareerPath AI

AI-Based Skill Gap & Career Recommendation System — a hackathon-ready web platform for students.

## Features

- **Student accounts** — register, login, and manage profiles (localStorage-backed for demo)
- **Profile builder** — qualifications, education branch, interests, skills with proficiency sliders, projects, certifications, preferred career domain
- **Student dashboard**
  - Overall career readiness score
  - Skill radar chart (current vs target)
  - Top 5 career recommendations with match scores
  - Skill gap analysis table
  - Personalised learning roadmap
  - Progress tracking with milestones

## Tech Stack

- React 18 + Vite
- React Router
- Recharts (radar chart)
- [MoltenMetal](https://reactbits.dev) (React Bits) + **ogl** WebGL hero background

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Project Structure

```
src/
  components/
    MoltenMetal/     # React Bits MoltenMetal component
    Navbar.jsx
    ProtectedRoute.jsx
  context/
    AuthContext.jsx  # Auth + profile persistence
  pages/
    Landing.jsx      # Hero with MoltenMetal
    Login.jsx
    Register.jsx
    ProfileSetup.jsx
    Dashboard.jsx
  utils/
    careerEngine.js  # Recommendation & gap analysis logic
```

## MoltenMetal Integration

The landing page hero uses the MoltenMetal component with purple/pink theme colors matching the app brand. Dependencies: `ogl`.

## Hackathon Theme

**Problem:** Students struggle to understand skills required for desired careers and identify gaps in their skill set.

**Solution:** An intelligent platform that analyses skills, interests, and career goals to deliver personalised recommendations and skill-development pathways.
