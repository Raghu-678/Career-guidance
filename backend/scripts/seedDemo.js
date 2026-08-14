import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import Career from '../models/Career.js';
import RoadmapProgress from '../models/RoadmapProgress.js';
import {
  buildMasterSkillList,
  getCareerRecommendations,
  analyzeSkillGaps,
  generateRoadmapItems,
  computeReadinessScore,
} from '../services/recommendationEngine.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const skillResources = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../seed/skill-resources.json'), 'utf-8')
);

export async function seedDemoUser() {
  const existing = await User.findOne({ email: 'demo@student.com' });
  if (existing) {
    console.log('Demo user already exists');
    return;
  }

  const passwordHash = await bcrypt.hash('Demo@123', 10);
  const user = await User.create({
    name: 'Rahul Sharma',
    email: 'demo@student.com',
    passwordHash,
  });

  const profile = await StudentProfile.create({
    userId: user._id,
    education: {
      degree: 'B.Tech',
      branch: 'Computer Science',
      institution: 'Indian Institute of Technology, Delhi',
      yearOfStudy: 3,
      cgpa: 8.2,
    },
    skills: [
      { skillName: 'Python', category: 'Technical', proficiency: 8 },
      { skillName: 'JavaScript', category: 'Technical', proficiency: 7 },
      { skillName: 'Java', category: 'Technical', proficiency: 6 },
      { skillName: 'SQL', category: 'Technical', proficiency: 7 },
      { skillName: 'Machine Learning', category: 'Technical', proficiency: 6 },
      { skillName: 'Data Analysis', category: 'Technical', proficiency: 7 },
      { skillName: 'React.js', category: 'Technical', proficiency: 6 },
      { skillName: 'Git', category: 'Tool', proficiency: 7 },
      { skillName: 'Pandas', category: 'Technical', proficiency: 6 },
      { skillName: 'TensorFlow', category: 'Technical', proficiency: 5 },
      { skillName: 'Communication', category: 'Soft', proficiency: 7 },
      { skillName: 'Problem Solving', category: 'Soft', proficiency: 8 },
      { skillName: 'Teamwork', category: 'Soft', proficiency: 7 },
    ],
    interests: ['Artificial Intelligence', 'Data Science', 'Web Development', 'Open Source'],
    projects: [
      {
        title: 'Student Performance Predictor',
        description: 'ML model predicting academic outcomes using regression on historical student data.',
        techStack: ['Python', 'Scikit-learn', 'Pandas', 'Flask'],
        link: 'https://github.com/demo/student-predictor',
      },
      {
        title: 'Campus Event Portal',
        description: 'Full-stack web app for college event registration and management.',
        techStack: ['React.js', 'Node.js', 'MongoDB', 'Express.js'],
        link: 'https://github.com/demo/campus-events',
      },
      {
        title: 'Sentiment Analysis Dashboard',
        description: 'NLP pipeline analyzing social media sentiment with interactive visualizations.',
        techStack: ['Python', 'TensorFlow', 'React.js', 'Data Visualization'],
        link: 'https://github.com/demo/sentiment-dashboard',
      },
    ],
    certifications: [
      {
        title: 'Machine Learning Specialization',
        issuer: 'Coursera (Stanford/DeepLearning.AI)',
        dateIssued: new Date('2025-06-15'),
        credentialLink: 'https://coursera.org/verify/demo-ml',
      },
      {
        title: 'Google Data Analytics Certificate',
        issuer: 'Google/Coursera',
        dateIssued: new Date('2025-03-01'),
        credentialLink: 'https://coursera.org/verify/demo-data',
      },
    ],
    preferredCareers: ['Data Scientist', 'ML Engineer', 'Data Analyst'],
    updatedAt: new Date(),
  });

  const careers = await Career.find();
  const masterSkills = buildMasterSkillList(careers);
  const recs = getCareerRecommendations(profile, careers, masterSkills, 1);
  const targetCareer = careers.find((c) => c.title === 'Data Scientist')
    || careers.find((c) => c._id.toString() === recs[0]?.careerId?.toString());

  if (targetCareer) {
    const gaps = analyzeSkillGaps(profile, targetCareer);
    const items = generateRoadmapItems(gaps.slice(0, 8), skillResources);
    const { readiness } = computeReadinessScore(profile, targetCareer, masterSkills);

    await RoadmapProgress.create({
      userId: user._id,
      targetCareerId: targetCareer._id,
      items,
      readinessScoreHistory: [
        { date: new Date('2026-01-15'), score: readiness - 12 },
        { date: new Date('2026-02-01'), score: readiness - 8 },
        { date: new Date('2026-03-01'), score: readiness - 4 },
        { date: new Date(), score: readiness },
      ],
    });
  }

  console.log('Demo user seeded: demo@student.com / Demo@123');
}
