import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import {
  CAREER_DOMAINS,
  EDUCATION_BRANCHES,
  INTEREST_TAGS,
  getRequiredSkills
} from '../utils/careerEngine';

const STEPS = ['Basics', 'Skills', 'Experience', 'Goals'];

export default function ProfileSetup() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const p = user?.profile || {};

  const [step, setStep] = useState(0);
  const [qualifications, setQualifications] = useState(p.qualifications || '');
  const [educationBranch, setEducationBranch] = useState(p.educationBranch || '');
  const [interests, setInterests] = useState(p.interests || []);
  const [skills, setSkills] = useState(p.skills || []);
  const [projects, setProjects] = useState(p.projects || []);
  const [certifications, setCertifications] = useState(p.certifications || []);
  const [preferredCareer, setPreferredCareer] = useState(p.preferredCareer || '');

  const [newProject, setNewProject] = useState({ title: '', description: '', tech: '' });
  const [newCert, setNewCert] = useState({ name: '', issuer: '', year: '' });
  const [customSkill, setCustomSkill] = useState({ name: '', proficiency: 50 });

  const suggestedSkills = preferredCareer ? getRequiredSkills(preferredCareer) : [];

  const toggleInterest = tag => {
    setInterests(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const updateSkillProficiency = (name, proficiency) => {
    setSkills(prev => {
      const exists = prev.find(s => s.name === name);
      if (exists) return prev.map(s => (s.name === name ? { ...s, proficiency } : s));
      return [...prev, { name, proficiency }];
    });
  };

  const getSkillProficiency = name => skills.find(s => s.name === name)?.proficiency || 0;

  const addProject = () => {
    if (!newProject.title.trim()) return;
    setProjects(prev => [...prev, { ...newProject, id: crypto.randomUUID() }]);
    setNewProject({ title: '', description: '', tech: '' });
  };

  const removeProject = id => setProjects(prev => prev.filter(pj => pj.id !== id));

  const addCert = () => {
    if (!newCert.name.trim()) return;
    setCertifications(prev => [...prev, { ...newCert, id: crypto.randomUUID() }]);
    setNewCert({ name: '', issuer: '', year: '' });
  };

  const removeCert = id => setCertifications(prev => prev.filter(c => c.id !== id));

  const addCustomSkill = () => {
    if (!customSkill.name.trim()) return;
    updateSkillProficiency(customSkill.name, customSkill.proficiency);
    setCustomSkill({ name: '', proficiency: 50 });
  };

  const handleSave = () => {
    updateProfile({
      qualifications,
      educationBranch,
      interests,
      skills,
      projects,
      certifications,
      preferredCareer
    });
    navigate('/dashboard');
  };

  const canNext = () => {
    if (step === 0) return qualifications && educationBranch;
    if (step === 1) return skills.length >= 1;
    if (step === 3) return preferredCareer;
    return true;
  };

  return (
    <div className="profile-setup">
      <Navbar variant="light" />
      <div className="profile-setup__container">
        <header className="profile-setup__header">
          <h1>Build Your Profile</h1>
          <p>Tell us about your background so we can personalise your career insights.</p>
        </header>

        <div className="steps">
          {STEPS.map((s, i) => (
            <div key={s} className={`step-indicator ${i <= step ? 'step-indicator--active' : ''}`}>
              <span className="step-indicator__num">{i + 1}</span>
              <span className="step-indicator__label">{s}</span>
            </div>
          ))}
        </div>

        <div className="profile-form card">
          {step === 0 && (
            <div className="form-section">
              <h2>Education & Qualifications</h2>
              <label>
                Qualifications / Degree
                <input
                  value={qualifications}
                  onChange={e => setQualifications(e.target.value)}
                  placeholder="B.Tech Computer Science, 3rd Year"
                />
              </label>
              <label>
                Education Branch
                <select value={educationBranch} onChange={e => setEducationBranch(e.target.value)}>
                  <option value="">Select branch</option>
                  {EDUCATION_BRANCHES.map(b => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </label>
              <div className="form-group">
                <span className="form-group__label">Interests</span>
                <div className="tag-grid">
                  {INTEREST_TAGS.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      className={`tag ${interests.includes(tag) ? 'tag--selected' : ''}`}
                      onClick={() => toggleInterest(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="form-section">
              <h2>Technical Skills & Proficiency</h2>
              <label>
                Preferred Career (for skill suggestions)
                <select
                  value={preferredCareer}
                  onChange={e => setPreferredCareer(e.target.value)}
                >
                  <option value="">Select a career domain</option>
                  {CAREER_DOMAINS.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              {suggestedSkills.length > 0 && (
                <div className="skill-sliders">
                  {suggestedSkills.map(sk => (
                    <div key={sk.name} className="skill-slider">
                      <div className="skill-slider__header">
                        <span>{sk.name}</span>
                        <span className="skill-slider__value">{getSkillProficiency(sk.name)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={getSkillProficiency(sk.name)}
                        onChange={e => updateSkillProficiency(sk.name, Number(e.target.value))}
                      />
                    </div>
                  ))}
                </div>
              )}
              <div className="inline-add">
                <input
                  value={customSkill.name}
                  onChange={e => setCustomSkill(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Add custom skill"
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={customSkill.proficiency}
                  onChange={e =>
                    setCustomSkill(prev => ({ ...prev, proficiency: Number(e.target.value) }))
                  }
                />
                <button type="button" className="btn btn--secondary btn--sm" onClick={addCustomSkill}>
                  Add
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-section">
              <h2>Projects & Certifications</h2>
              <h3>Projects</h3>
              <div className="inline-add inline-add--stack">
                <input
                  value={newProject.title}
                  onChange={e => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Project title"
                />
                <input
                  value={newProject.tech}
                  onChange={e => setNewProject(prev => ({ ...prev, tech: e.target.value }))}
                  placeholder="Tech stack (e.g. React, Python)"
                />
                <textarea
                  value={newProject.description}
                  onChange={e => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description"
                  rows={2}
                />
                <button type="button" className="btn btn--secondary btn--sm" onClick={addProject}>
                  Add Project
                </button>
              </div>
              <ul className="item-list">
                {projects.map(pj => (
                  <li key={pj.id}>
                    <strong>{pj.title}</strong> — {pj.tech}
                    <button type="button" onClick={() => removeProject(pj.id)}>
                      ×
                    </button>
                  </li>
                ))}
              </ul>

              <h3>Certifications</h3>
              <div className="inline-add">
                <input
                  value={newCert.name}
                  onChange={e => setNewCert(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Certification name"
                />
                <input
                  value={newCert.issuer}
                  onChange={e => setNewCert(prev => ({ ...prev, issuer: e.target.value }))}
                  placeholder="Issuer"
                />
                <input
                  value={newCert.year}
                  onChange={e => setNewCert(prev => ({ ...prev, year: e.target.value }))}
                  placeholder="Year"
                />
                <button type="button" className="btn btn--secondary btn--sm" onClick={addCert}>
                  Add
                </button>
              </div>
              <ul className="item-list">
                {certifications.map(c => (
                  <li key={c.id}>
                    <strong>{c.name}</strong> — {c.issuer} ({c.year})
                    <button type="button" onClick={() => removeCert(c.id)}>
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {step === 3 && (
            <div className="form-section">
              <h2>Career Goals</h2>
              <label>
                Preferred Career / Domain
                <select value={preferredCareer} onChange={e => setPreferredCareer(e.target.value)}>
                  <option value="">Select target career</option>
                  {CAREER_DOMAINS.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <div className="summary-preview">
                <h3>Profile Summary</h3>
                <dl>
                  <dt>Qualifications</dt>
                  <dd>{qualifications || '—'}</dd>
                  <dt>Branch</dt>
                  <dd>{educationBranch || '—'}</dd>
                  <dt>Skills</dt>
                  <dd>{skills.length} assessed</dd>
                  <dt>Projects</dt>
                  <dd>{projects.length}</dd>
                  <dt>Certifications</dt>
                  <dd>{certifications.length}</dd>
                </dl>
              </div>
            </div>
          )}

          <div className="form-nav">
            {step > 0 && (
              <button type="button" className="btn btn--ghost" onClick={() => setStep(s => s - 1)}>
                Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                className="btn btn--primary"
                disabled={!canNext()}
                onClick={() => setStep(s => s + 1)}
              >
                Continue
              </button>
            ) : (
              <button type="button" className="btn btn--primary" disabled={!canNext()} onClick={handleSave}>
                Save & View Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
