import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildMasterSkillList,
  cosineSimilarity,
  vectorizeStudent,
  vectorizeCareer,
  computeReadinessScore,
  analyzeSkillGaps,
  computeProfileCompleteness,
  bumpSkillProficiency,
  READINESS_WEIGHTS,
} from '../services/recommendationEngine.js';

const mockCareers = [
  {
    _id: '1',
    title: 'Data Scientist',
    domain: 'Data & AI',
    requiredSkills: [
      { skillName: 'Python', importance: 10, minProficiency: 8 },
      { skillName: 'Machine Learning', importance: 9, minProficiency: 7 },
      { skillName: 'SQL', importance: 8, minProficiency: 7 },
      { skillName: 'Statistics', importance: 8, minProficiency: 7 },
    ],
  },
  {
    _id: '2',
    title: 'Frontend Developer',
    domain: 'Software Engineering',
    requiredSkills: [
      { skillName: 'JavaScript', importance: 10, minProficiency: 8 },
      { skillName: 'React.js', importance: 9, minProficiency: 7 },
      { skillName: 'HTML/CSS', importance: 8, minProficiency: 7 },
    ],
  },
];

const mockProfile = {
  education: { branch: 'Computer Science' },
  skills: [
    { skillName: 'Python', proficiency: 8 },
    { skillName: 'Machine Learning', proficiency: 6 },
    { skillName: 'SQL', proficiency: 7 },
  ],
  projects: [{ title: 'ML Project', techStack: ['Python', 'Pandas'] }],
  certifications: [{ title: 'Machine Learning Certificate' }],
  interests: ['AI', 'Data'],
  preferredCareers: ['Data Scientist'],
};

describe('recommendationEngine', () => {
  it('builds master skill list from careers', () => {
    const skills = buildMasterSkillList(mockCareers);
    assert.ok(skills.includes('Python'));
    assert.ok(skills.includes('React.js'));
    assert.equal(skills.length, 7);
  });

  it('computes cosine similarity between aligned vectors', () => {
    const master = buildMasterSkillList(mockCareers);
    const studentVec = vectorizeStudent(mockProfile, master);
    const careerVec = vectorizeCareer(mockCareers[0], master);
    const sim = cosineSimilarity(studentVec, careerVec);
    assert.ok(sim > 0.5);
    assert.ok(sim <= 1);
  });

  it('returns 0 cosine similarity for zero vectors', () => {
    assert.equal(cosineSimilarity([0, 0], [1, 2]), 0);
  });

  it('computes readiness score with weighted breakdown', () => {
    const master = buildMasterSkillList(mockCareers);
    const result = computeReadinessScore(mockProfile, mockCareers[0], master);
    assert.ok(result.readiness >= 0 && result.readiness <= 100);
    assert.ok(result.breakdown.skillMatch >= 0);
    assert.equal(
      READINESS_WEIGHTS.skillMatch + READINESS_WEIGHTS.projectScore +
      READINESS_WEIGHTS.certScore + READINESS_WEIGHTS.educationFit,
      1
    );
  });

  it('identifies skill gaps sorted by priority', () => {
    const gaps = analyzeSkillGaps(mockProfile, mockCareers[0]);
    assert.ok(gaps.length > 0);
    const statsGap = gaps.find((g) => g.skillName === 'Statistics');
    assert.ok(statsGap);
    assert.ok(statsGap.priorityScore > 0);
    for (let i = 1; i < gaps.length; i++) {
      assert.ok(gaps[i - 1].priorityScore >= gaps[i].priorityScore);
    }
  });

  it('calculates profile completeness', () => {
    const score = computeProfileCompleteness(mockProfile);
    assert.ok(score >= 80);
  });

  it('bumps skill proficiency on roadmap completion', () => {
    const profile = { skills: [{ skillName: 'Statistics', proficiency: 4 }] };
    bumpSkillProficiency(profile, 'Statistics', 7);
    assert.equal(profile.skills[0].proficiency, 7);
  });
});
