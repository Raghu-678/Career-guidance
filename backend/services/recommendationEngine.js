/**
 * Core recommendation engine — transparent, explainable scoring.
 * Uses cosine similarity for career matching and a weighted composite for readiness.
 */

export const READINESS_WEIGHTS = {
  skillMatch: 0.5,
  projectScore: 0.2,
  certScore: 0.15,
  educationFit: 0.15,
};

/** Maps academic branches to career domain affinity scores (0-100). */
export const BRANCH_DOMAIN_AFFINITY = {
  'Computer Science': {
    'Software Engineering': 100, 'Data & AI': 90, 'Cloud & DevOps': 85,
    'Cybersecurity': 80, 'Design & Product': 70, 'Business & Analysis': 65,
    'Infrastructure': 75, 'Emerging Tech': 85, 'Content & Documentation': 60,
  },
  'Information Technology': {
    'Software Engineering': 95, 'Data & AI': 80, 'Cloud & DevOps': 90,
    'Cybersecurity': 85, 'Design & Product': 65, 'Business & Analysis': 70,
    'Infrastructure': 90, 'Emerging Tech': 75, 'Content & Documentation': 55,
  },
  'Electronics & Communication': {
    'Software Engineering': 70, 'Data & AI': 75, 'Cloud & DevOps': 65,
    'Cybersecurity': 70, 'Design & Product': 60, 'Business & Analysis': 55,
    'Infrastructure': 85, 'Emerging Tech': 80, 'Content & Documentation': 50,
  },
  'Electrical Engineering': {
    'Software Engineering': 60, 'Data & AI': 65, 'Cloud & DevOps': 70,
    'Cybersecurity': 65, 'Design & Product': 50, 'Business & Analysis': 55,
    'Infrastructure': 90, 'Emerging Tech': 70, 'Content & Documentation': 45,
  },
  'Mechanical Engineering': {
    'Software Engineering': 45, 'Data & AI': 50, 'Cloud & DevOps': 40,
    'Cybersecurity': 35, 'Design & Product': 55, 'Business & Analysis': 60,
    'Infrastructure': 50, 'Emerging Tech': 40, 'Content & Documentation': 50,
  },
  'Business Administration': {
    'Software Engineering': 40, 'Data & AI': 55, 'Cloud & DevOps': 35,
    'Cybersecurity': 30, 'Design & Product': 75, 'Business & Analysis': 95,
    'Infrastructure': 30, 'Emerging Tech': 40, 'Content & Documentation': 70,
  },
};

export const SKILL_CATEGORIES = {
  Python: 'Programming', JavaScript: 'Programming', Java: 'Programming',
  'C++': 'Programming', 'C#': 'Programming', TypeScript: 'Programming',
  Go: 'Programming', Rust: 'Programming', Swift: 'Programming', Kotlin: 'Programming',
  'React.js': 'Programming', 'Node.js': 'Programming', 'Spring Boot': 'Programming',
  Django: 'Programming', Flask: 'Programming', 'Express.js': 'Programming',
  'REST APIs': 'Programming', GraphQL: 'Programming', 'System Design': 'Programming',
  'Data Structures & Algorithms': 'Programming', Git: 'Programming',
  SQL: 'Data/AI', 'Machine Learning': 'Data/AI', 'Deep Learning': 'Data/AI',
  'Data Analysis': 'Data/AI', Statistics: 'Data/AI', Pandas: 'Data/AI',
  NumPy: 'Data/AI', TensorFlow: 'Data/AI', PyTorch: 'Data/AI',
  'Data Visualization': 'Data/AI', 'Power BI': 'Data/AI', Tableau: 'Data/AI',
  'Big Data': 'Data/AI', Spark: 'Data/AI', 'NLP': 'Data/AI',
  AWS: 'Cloud & DevOps', Azure: 'Cloud & DevOps', GCP: 'Cloud & DevOps',
  Docker: 'Cloud & DevOps', Kubernetes: 'Cloud & DevOps', 'CI/CD': 'Cloud & DevOps',
  Terraform: 'Cloud & DevOps', Linux: 'Cloud & DevOps', Networking: 'Cloud & DevOps',
  'Network Security': 'Cybersecurity', 'Penetration Testing': 'Cybersecurity',
  'Security Analysis': 'Cybersecurity', Cryptography: 'Cybersecurity',
  'Risk Assessment': 'Cybersecurity', 'Incident Response': 'Cybersecurity',
  'Threat Modeling': 'Cybersecurity', SIEM: 'Cybersecurity',
  'UI Design': 'Soft Skills', 'UX Research': 'Soft Skills',
  Figma: 'Soft Skills', 'Wireframing': 'Soft Skills', Prototyping: 'Soft Skills',
  'User Research': 'Soft Skills', Communication: 'Soft Skills',
  'Problem Solving': 'Soft Skills', Teamwork: 'Soft Skills',
  Leadership: 'Soft Skills', 'Agile/Scrum': 'Soft Skills',
  'Product Strategy': 'Soft Skills', 'Stakeholder Management': 'Soft Skills',
  'Business Analysis': 'Soft Skills', 'Requirements Gathering': 'Soft Skills',
  'Technical Writing': 'Soft Skills', Documentation: 'Soft Skills',
  'Test Automation': 'Programming', Selenium: 'Programming', JUnit: 'Programming',
  'Manual Testing': 'Programming', 'API Testing': 'Programming',
  MongoDB: 'Programming', PostgreSQL: 'Programming', Redis: 'Programming',
  'Mobile Development': 'Programming', 'React Native': 'Programming',
  Flutter: 'Programming', 'iOS Development': 'Programming',
  'Android Development': 'Programming', Blockchain: 'Programming',
  Solidity: 'Programming', 'Smart Contracts': 'Programming',
  'Database Administration': 'Programming', 'Network Administration': 'Cloud & DevOps',
  'Cloud Architecture': 'Cloud & DevOps', 'DevOps Practices': 'Cloud & DevOps',
  'Project Management': 'Soft Skills', 'Market Research': 'Soft Skills',
  'SQL Optimization': 'Programming', 'ETL Pipelines': 'Data/AI',
  'Computer Vision': 'Data/AI', 'MLOps': 'Data/AI', 'A/B Testing': 'Data/AI',
  Jira: 'Soft Skills', Confluence: 'Soft Skills',
};

const RADAR_CATEGORIES = [
  'Programming', 'Data/AI', 'Cloud & DevOps', 'Cybersecurity', 'Soft Skills', 'Domain Knowledge',
];

function dot(a, b) {
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

function norm(v) {
  return Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
}

export function buildMasterSkillList(careers) {
  const skills = new Set();
  for (const career of careers) {
    for (const s of career.requiredSkills) {
      skills.add(s.skillName);
    }
  }
  return [...skills].sort();
}

export function vectorizeStudent(profile, masterSkills) {
  const skillMap = Object.fromEntries(
    (profile.skills || []).map((s) => [s.skillName, s.proficiency])
  );
  return masterSkills.map((name) => skillMap[name] || 0);
}

export function vectorizeCareer(career, masterSkills) {
  const skillMap = Object.fromEntries(
    career.requiredSkills.map((s) => [s.skillName, s.importance])
  );
  return masterSkills.map((name) => skillMap[name] || 0);
}

export function cosineSimilarity(vecA, vecB) {
  const nA = norm(vecA);
  const nB = norm(vecB);
  if (nA === 0 || nB === 0) return 0;
  return dot(vecA, vecB) / (nA * nB);
}

function getStudentProficiency(profile, skillName) {
  const skill = (profile.skills || []).find((s) => s.skillName === skillName);
  return skill?.proficiency || 0;
}

function countRelevantItems(profile, career) {
  const careerSkills = new Set(career.requiredSkills.map((s) => s.skillName.toLowerCase()));
  const careerTech = new Set(
    career.requiredSkills.flatMap((s) => [s.skillName.toLowerCase()])
  );

  let relevantProjects = 0;
  for (const project of profile.projects || []) {
    const stack = (project.techStack || []).map((t) => t.toLowerCase());
    if (stack.some((t) => careerTech.has(t) || [...careerSkills].some((cs) => t.includes(cs) || cs.includes(t)))) {
      relevantProjects++;
    }
  }

  let relevantCerts = 0;
  for (const cert of profile.certifications || []) {
    const title = (cert.title || '').toLowerCase();
    if ([...careerSkills].some((cs) => title.includes(cs))) {
      relevantCerts++;
    }
  }

  return { relevantProjects, relevantCerts };
}

export function computeEducationFit(profile, career) {
  const branch = profile.education?.branch || 'Computer Science';
  const domain = career.domain || 'Software Engineering';
  const affinityMap = BRANCH_DOMAIN_AFFINITY[branch] || BRANCH_DOMAIN_AFFINITY['Computer Science'];
  return affinityMap[domain] ?? 50;
}

export function computeProjectScore(profile, career) {
  const { relevantProjects } = countRelevantItems(profile, career);
  return Math.min(100, relevantProjects * 20);
}

export function computeCertScore(profile, career) {
  const { relevantCerts } = countRelevantItems(profile, career);
  return Math.min(100, relevantCerts * 25);
}

export function computeReadinessScore(profile, career, masterSkills) {
  const studentVec = vectorizeStudent(profile, masterSkills);
  const careerVec = vectorizeCareer(career, masterSkills);
  const skillMatch = cosineSimilarity(studentVec, careerVec) * 100;
  const projectScore = computeProjectScore(profile, career);
  const certScore = computeCertScore(profile, career);
  const educationFit = computeEducationFit(profile, career);

  const readiness =
    READINESS_WEIGHTS.skillMatch * skillMatch +
    READINESS_WEIGHTS.projectScore * projectScore +
    READINESS_WEIGHTS.certScore * certScore +
    READINESS_WEIGHTS.educationFit * educationFit;

  return {
    readiness: Math.round(readiness * 10) / 10,
    breakdown: {
      skillMatch: Math.round(skillMatch * 10) / 10,
      projectScore,
      certScore,
      educationFit,
    },
  };
}

export function getCareerRecommendations(profile, careers, masterSkills, topN = 5) {
  const studentVec = vectorizeStudent(profile, masterSkills);

  const results = careers.map((career) => {
    const careerVec = vectorizeCareer(career, masterSkills);
    const matchPercent = cosineSimilarity(studentVec, careerVec) * 100;
    const topSkills = career.requiredSkills
      .filter((s) => getStudentProficiency(profile, s.skillName) >= s.minProficiency * 0.7)
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 3)
      .map((s) => s.skillName);

    const rationale = topSkills.length > 0
      ? `Strong alignment with ${topSkills.join(', ')}`
      : `Potential fit in ${career.domain} — build core skills to improve match`;

    return {
      careerId: career._id,
      title: career.title,
      domain: career.domain,
      matchPercent: Math.round(matchPercent * 10) / 10,
      rationale,
    };
  });

  return results.sort((a, b) => b.matchPercent - a.matchPercent).slice(0, topN);
}

export function analyzeSkillGaps(profile, career) {
  const gaps = [];

  for (const req of career.requiredSkills) {
    const current = getStudentProficiency(profile, req.skillName);
    if (current < req.minProficiency) {
      const gapSize = req.minProficiency - current;
      const priorityScore = req.importance * gapSize;
      gaps.push({
        skillName: req.skillName,
        currentProficiency: current,
        requiredProficiency: req.minProficiency,
        gapSize,
        importance: req.importance,
        priorityScore,
        priority: priorityScore >= 30 ? 'High' : priorityScore >= 15 ? 'Medium' : 'Low',
      });
    }
  }

  return gaps.sort((a, b) => b.priorityScore - a.priorityScore);
}

export function generateRoadmapItems(gaps, skillResources) {
  return gaps.map((gap) => {
    const resources = skillResources[gap.skillName] || [
      { name: `${gap.skillName} — Official Documentation`, url: `https://www.google.com/search?q=learn+${encodeURIComponent(gap.skillName)}` },
    ];
    const resource = resources[0];
    return {
      skillName: gap.skillName,
      resource: { name: resource.name, url: resource.url },
      status: 'not-started',
      priority: gap.priority,
    };
  });
}

export function computeRadarData(profile, career) {
  const categories = {};
  for (const cat of RADAR_CATEGORIES) {
    categories[cat] = { student: [], required: [] };
  }

  for (const skill of profile.skills || []) {
    const cat = SKILL_CATEGORIES[skill.skillName] || 'Domain Knowledge';
    if (categories[cat]) {
      categories[cat].student.push(skill.proficiency);
    }
  }

  for (const req of career?.requiredSkills || []) {
    const cat = SKILL_CATEGORIES[req.skillName] || 'Domain Knowledge';
    if (categories[cat]) {
      categories[cat].required.push(req.minProficiency);
    }
  }

  return RADAR_CATEGORIES.map((category) => ({
    category,
    student: categories[category].student.length
      ? Math.round(categories[category].student.reduce((a, b) => a + b, 0) / categories[category].student.length * 10) / 10
      : 0,
    required: categories[category].required.length
      ? Math.round(categories[category].required.reduce((a, b) => a + b, 0) / categories[category].required.length * 10) / 10
      : 0,
  }));
}

export function computeProfileCompleteness(profile) {
  const weights = {
    education: 20,
    skills: 30,
    projects: 20,
    certifications: 10,
    interests: 10,
    preferredCareers: 10,
  };

  let score = 0;
  const edu = profile.education || {};
  if (edu.degree && edu.branch && edu.institution && edu.yearOfStudy) score += weights.education;
  if ((profile.skills || []).length >= 3) score += weights.skills;
  if ((profile.projects || []).length >= 1) score += weights.projects;
  if ((profile.certifications || []).length >= 1) score += weights.certifications;
  if ((profile.interests || []).length >= 2) score += weights.interests;
  if ((profile.preferredCareers || []).length >= 1) score += weights.preferredCareers;

  return score;
}

export function bumpSkillProficiency(profile, skillName, targetMin = 7) {
  const skills = profile.skills || [];
  const idx = skills.findIndex((s) => s.skillName === skillName);
  if (idx >= 0) {
    skills[idx].proficiency = Math.min(10, Math.max(skills[idx].proficiency + 1, targetMin));
  } else {
    skills.push({
      skillName,
      category: 'Technical',
      proficiency: Math.min(targetMin, 5),
    });
  }
  profile.skills = skills;
  return profile;
}
