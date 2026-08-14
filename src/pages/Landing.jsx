import { Link } from 'react-router-dom';
import MoltenMetal from '../components/MoltenMetal/MoltenMetal';
import Navbar from '../components/Navbar';

const features = [
  {
    icon: '🎯',
    title: 'Career Readiness Score',
    desc: 'Get an AI-calculated score based on your skills, projects, and certifications.'
  },
  {
    icon: '📊',
    title: 'Skill Radar Analysis',
    desc: 'Visualize strengths and gaps across key competencies for your target role.'
  },
  {
    icon: '🗺️',
    title: 'Personalized Roadmap',
    desc: 'Follow a step-by-step learning path tailored to close your skill gaps.'
  },
  {
    icon: '🚀',
    title: 'Top Career Matches',
    desc: 'Discover careers that align with your profile, interests, and education branch.'
  }
];

export default function Landing() {
  return (
    <div className="landing">
      <section className="hero">
        <div className="hero__bg">
          <MoltenMetal
            color1="#5227FF"
            color2="#FF9FFC"
            color3="#FFFFFF"
            speed={0.35}
            scale={4}
            detail={3}
            glow={1.6}
            coreSize={0.1}
            swirl={1}
            fold={-0.2}
            blackPoint={0.05}
            brightness={1.3}
            colorMode="molten"
            grain={true}
            grainIntensity={0.05}
            mouseInteraction={true}
            mouseStrength={0.3}
            opacity={0.85}
          />
        </div>
        <Navbar variant="transparent" />
        <div className="hero__content">
          <span className="hero__badge">AI-Powered Career Guidance</span>
          <h1>
            Bridge Your Skill Gaps.
            <br />
            <span className="gradient-text">Launch Your Dream Career.</span>
          </h1>
          <p className="hero__subtitle">
            An intelligent platform that analyses your skills, interests, and goals — then delivers
            personalised career recommendations and skill-development pathways.
          </p>
          <div className="hero__actions">
            <Link to="/register" className="btn btn--primary btn--lg">
              Create Free Account
            </Link>
            <Link to="/login" className="btn btn--outline btn--lg">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <section className="section features">
        <h2>Everything you need to become career-ready</h2>
        <p className="section__subtitle">
          Built for students navigating employability, education, and AI-driven career planning.
        </p>
        <div className="features__grid">
          {features.map(f => (
            <article key={f.title} className="feature-card">
              <span className="feature-card__icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section cta">
        <div className="cta__inner">
          <h2>Ready to discover your career path?</h2>
          <p>Upload your skills, set your goals, and get your personalised dashboard in minutes.</p>
          <Link to="/register" className="btn btn--primary btn--lg">
            Start Your Journey
          </Link>
        </div>
      </section>

      <footer className="footer">
        <p>CareerPath AI — Hackathon Project · Education · Employability · AI · Data Analytics</p>
      </footer>
    </div>
  );
}
