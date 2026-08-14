import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { analyzeProfile } from '../utils/careerEngine';

function ScoreRing({ score }) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div className="score-ring">
      <svg viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" className="score-ring__bg" />
        <circle
          cx="60"
          cy="60"
          r="54"
          className="score-ring__fill"
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="score-ring__value">
        <span className="score-ring__num">{score}</span>
        <span className="score-ring__label">Readiness</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const analysis = useMemo(() => analyzeProfile(user?.profile || {}), [user]);

  const {
    readinessScore,
    radarData,
    gaps,
    recommendations,
    roadmap,
    progress,
    targetCareer
  } = analysis;

  return (
    <div className="dashboard">
      <Navbar variant="light" />
      <div className="dashboard__container">
        <header className="dashboard__header">
          <div>
            <h1>Welcome, {user?.name?.split(' ')[0] || 'Student'}</h1>
            <p>
              Target career: <strong>{targetCareer}</strong>
              {' · '}
              <Link to="/profile-setup">Edit profile</Link>
            </p>
          </div>
        </header>

        <div className="dashboard__grid">
          <section className="card card--score">
            <h2>Career Readiness Score</h2>
            <ScoreRing score={readinessScore} />
            <p className="score-desc">
              {readinessScore >= 70
                ? 'Strong foundation — focus on advanced skills and portfolio depth.'
                : readinessScore >= 40
                  ? 'Good progress — keep closing skill gaps on your roadmap.'
                  : 'Early stage — follow your personalised roadmap to build momentum.'}
            </p>
          </section>

          <section className="card card--radar">
            <h2>Skill Radar</h2>
            <div className="radar-chart">
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar
                    name="Current"
                    dataKey="current"
                    stroke="#5227FF"
                    fill="#5227FF"
                    fillOpacity={0.35}
                  />
                  <Radar
                    name="Target"
                    dataKey="target"
                    stroke="#FF9FFC"
                    fill="#FF9FFC"
                    fillOpacity={0.15}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="card card--recommendations">
            <h2>Top Career Recommendations</h2>
            <ul className="rec-list">
              {recommendations.map((rec, i) => (
                <li key={rec.career} className="rec-item">
                  <span className="rec-item__rank">#{i + 1}</span>
                  <div className="rec-item__body">
                    <strong>{rec.career}</strong>
                    <div className="rec-item__bar">
                      <div className="rec-item__fill" style={{ width: `${rec.matchScore}%` }} />
                    </div>
                    <span className="rec-item__score">{rec.matchScore}% match</span>
                    {rec.missing.length > 0 && (
                      <span className="rec-item__missing">
                        Missing: {rec.missing.join(', ')}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="card card--gaps">
            <h2>Skill Gap Analysis</h2>
            <div className="gap-table">
              <div className="gap-table__head">
                <span>Skill</span>
                <span>Current</span>
                <span>Gap</span>
                <span>Status</span>
              </div>
              {gaps.map(g => (
                <div key={g.name} className="gap-table__row">
                  <span>{g.name}</span>
                  <span>{g.current}%</span>
                  <span>{g.gap}%</span>
                  <span className={`status status--${g.status}`}>{g.status}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="card card--roadmap">
            <h2>Personalised Roadmap</h2>
            <div className="roadmap">
              {roadmap.map(phase => (
                <article key={phase.phase} className={`roadmap__phase priority--${phase.priority}`}>
                  <div className="roadmap__phase-header">
                    <span className="roadmap__phase-num">Phase {phase.phase}</span>
                    <strong>{phase.title}</strong>
                    <span className="roadmap__duration">{phase.duration}</span>
                  </div>
                  <ul>
                    {phase.actions.map(a => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section className="card card--progress">
            <h2>Progress Tracking</h2>
            <div className="progress-summary">
              <div className="progress-bar">
                <div className="progress-bar__fill" style={{ width: `${progress.percentage}%` }} />
              </div>
              <p>
                {progress.completed} of {progress.total} target skills at proficiency level
              </p>
            </div>
            <ul className="milestones">
              {progress.milestones.map(m => (
                <li key={m.label} className={m.done ? 'milestone--done' : ''}>
                  <span className="milestone__check">{m.done ? '✓' : '○'}</span>
                  {m.label}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
