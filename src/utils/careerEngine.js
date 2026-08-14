export const CAREER_DOMAINS = [
  'Software Engineering',
  'Data Science & Analytics',
  'Cybersecurity',
  'Cloud & DevOps',
  'AI / Machine Learning',
  'Product Management',
  'UI/UX Design',
  'Digital Marketing',
  'Business Analytics',
  'Embedded Systems'
];

export const EDUCATION_BRANCHES = [
  'Computer Science',
  'Information Technology',
  'Electronics & Communication',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Mathematics',
  'Statistics',
  'Commerce',
  'Other'
];

export const SKILL_CATALOG = {
  'Software Engineering': [
    { name: 'JavaScript', category: 'Programming' },
    { name: 'React', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'SQL', category: 'Database' },
    { name: 'Git', category: 'Tools' },
    { name: 'System Design', category: 'Architecture' },
    { name: 'REST APIs', category: 'Backend' },
    { name: 'Testing', category: 'Quality' }
  ],
  'Data Science & Analytics': [
    { name: 'Python', category: 'Programming' },
    { name: 'Statistics', category: 'Math' },
    { name: 'Pandas', category: 'Libraries' },
    { name: 'SQL', category: 'Database' },
    { name: 'Machine Learning', category: 'AI' },
    { name: 'Data Visualization', category: 'Analytics' },
    { name: 'Excel', category: 'Tools' },
    { name: 'Tableau', category: 'Tools' }
  ],
  'Cybersecurity': [
    { name: 'Networking', category: 'Fundamentals' },
    { name: 'Linux', category: 'Systems' },
    { name: 'Penetration Testing', category: 'Offensive' },
    { name: 'Cryptography', category: 'Security' },
    { name: 'SIEM', category: 'Monitoring' },
    { name: 'Incident Response', category: 'Operations' },
    { name: 'Python', category: 'Scripting' },
    { name: 'Cloud Security', category: 'Cloud' }
  ],
  'Cloud & DevOps': [
    { name: 'AWS', category: 'Cloud' },
    { name: 'Docker', category: 'Containers' },
    { name: 'Kubernetes', category: 'Orchestration' },
    { name: 'CI/CD', category: 'Automation' },
    { name: 'Linux', category: 'Systems' },
    { name: 'Terraform', category: 'IaC' },
    { name: 'Monitoring', category: 'Operations' },
    { name: 'Scripting', category: 'Automation' }
  ],
  'AI / Machine Learning': [
    { name: 'Python', category: 'Programming' },
    { name: 'Deep Learning', category: 'AI' },
    { name: 'TensorFlow', category: 'Frameworks' },
    { name: 'PyTorch', category: 'Frameworks' },
    { name: 'NLP', category: 'AI' },
    { name: 'Computer Vision', category: 'AI' },
    { name: 'Statistics', category: 'Math' },
    { name: 'MLOps', category: 'Operations' }
  ],
  'Product Management': [
    { name: 'User Research', category: 'Discovery' },
    { name: 'Roadmapping', category: 'Strategy' },
    { name: 'Agile', category: 'Process' },
    { name: 'Analytics', category: 'Data' },
    { name: 'Wireframing', category: 'Design' },
    { name: 'Stakeholder Management', category: 'Leadership' },
    { name: 'SQL', category: 'Data' },
    { name: 'A/B Testing', category: 'Experimentation' }
  ],
  'UI/UX Design': [
    { name: 'Figma', category: 'Tools' },
    { name: 'User Research', category: 'Research' },
    { name: 'Wireframing', category: 'Design' },
    { name: 'Prototyping', category: 'Design' },
    { name: 'Design Systems', category: 'Systems' },
    { name: 'Accessibility', category: 'Standards' },
    { name: 'HTML/CSS', category: 'Frontend' },
    { name: 'Visual Design', category: 'Creative' }
  ],
  'Digital Marketing': [
    { name: 'SEO', category: 'Organic' },
    { name: 'Google Ads', category: 'Paid' },
    { name: 'Content Strategy', category: 'Content' },
    { name: 'Social Media', category: 'Channels' },
    { name: 'Analytics', category: 'Data' },
    { name: 'Copywriting', category: 'Content' },
    { name: 'Email Marketing', category: 'Channels' },
    { name: 'CRM Tools', category: 'Tools' }
  ],
  'Business Analytics': [
    { name: 'Excel', category: 'Tools' },
    { name: 'SQL', category: 'Database' },
    { name: 'Power BI', category: 'Visualization' },
    { name: 'Statistics', category: 'Math' },
    { name: 'Python', category: 'Programming' },
    { name: 'Business Modeling', category: 'Strategy' },
    { name: 'Tableau', category: 'Visualization' },
    { name: 'Forecasting', category: 'Analytics' }
  ],
  'Embedded Systems': [
    { name: 'C/C++', category: 'Programming' },
    { name: 'Microcontrollers', category: 'Hardware' },
    { name: 'RTOS', category: 'Systems' },
    { name: 'Embedded Linux', category: 'Systems' },
    { name: 'IoT Protocols', category: 'Connectivity' },
    { name: 'PCB Basics', category: 'Hardware' },
    { name: 'Debugging', category: 'Tools' },
    { name: 'Communication Protocols', category: 'Connectivity' }
  ]
};

export const INTEREST_TAGS = [
  'Problem Solving',
  'Creative Work',
  'Team Leadership',
  'Research',
  'Building Products',
  'Data & Numbers',
  'Security',
  'Teaching',
  'Entrepreneurship',
  'Open Source'
];

export function getRequiredSkills(career) {
  return SKILL_CATALOG[career] || SKILL_CATALOG['Software Engineering'];
}

export function analyzeProfile(profile) {
  const targetCareer = profile.preferredCareer || 'Software Engineering';
  const required = getRequiredSkills(targetCareer);
  const userSkills = profile.skills || [];

  const skillMap = Object.fromEntries(userSkills.map(s => [s.name, s.proficiency]));

  const gaps = required.map(req => {
    const current = skillMap[req.name] || 0;
    const target = 80;
    const gap = Math.max(0, target - current);
    return {
      ...req,
      current,
      target,
      gap,
      status: current >= 70 ? 'strong' : current >= 40 ? 'developing' : 'gap'
    };
  });

  const avgCurrent =
    gaps.length > 0 ? gaps.reduce((sum, g) => sum + g.current, 0) / gaps.length : 0;
  const readinessScore = Math.round(Math.min(100, avgCurrent * 0.7 + (profile.projects?.length || 0) * 3 + (profile.certifications?.length || 0) * 5));

  const radarData = gaps.slice(0, 6).map(g => ({
    skill: g.name.length > 12 ? g.name.slice(0, 10) + '…' : g.name,
    fullName: g.name,
    current: g.current,
    target: g.target
  }));

  const recommendations = rankCareers(profile);
  const roadmap = buildRoadmap(gaps, targetCareer);
  const progress = buildProgress(profile, gaps);

  return {
    readinessScore,
    radarData,
    gaps,
    recommendations,
    roadmap,
    progress,
    targetCareer
  };
}

function rankCareers(profile) {
  const userSkillNames = new Set((profile.skills || []).map(s => s.name));
  const userInterests = new Set(profile.interests || []);

  return CAREER_DOMAINS.map(career => {
    const required = getRequiredSkills(career);
    const matched = required.filter(r => userSkillNames.has(r.name)).length;
    const skillScore = (matched / required.length) * 60;

    const interestBonus = profile.preferredCareer === career ? 25 : 0;
    const branchBonus =
      profile.educationBranch === 'Computer Science' &&
      ['Software Engineering', 'AI / Machine Learning', 'Data Science & Analytics'].includes(career)
        ? 10
        : 0;

    const projectBonus = Math.min(15, (profile.projects?.length || 0) * 3);
    const matchScore = Math.round(Math.min(99, skillScore + interestBonus + branchBonus + projectBonus));

    const missing = required.filter(r => !userSkillNames.has(r.name)).slice(0, 3).map(r => r.name);

    return { career, matchScore, missing, matched, total: required.length };
  })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);
}

function buildRoadmap(gaps, career) {
  const priority = [...gaps].sort((a, b) => b.gap - a.gap).slice(0, 5);

  return priority.map((g, i) => ({
    phase: i + 1,
    title: g.name,
    duration: g.gap > 50 ? '6–8 weeks' : g.gap > 25 ? '4–6 weeks' : '2–4 weeks',
    actions: [
      `Complete a structured ${g.name} course`,
      `Build a mini-project applying ${g.name}`,
      g.gap > 40 ? `Pair with a mentor for ${g.name} review` : `Add ${g.name} to your portfolio project`
    ],
    priority: g.gap > 50 ? 'high' : g.gap > 25 ? 'medium' : 'low'
  }));
}

function buildProgress(profile, gaps) {
  const completed = gaps.filter(g => g.current >= 70).length;
  const total = gaps.length;
  const milestones = [
    { label: 'Profile completed', done: true },
    { label: 'Skills assessed', done: (profile.skills?.length || 0) >= 3 },
    { label: 'First project added', done: (profile.projects?.length || 0) >= 1 },
    { label: 'Certification earned', done: (profile.certifications?.length || 0) >= 1 },
    { label: '50% skills at target', done: completed >= Math.ceil(total / 2) },
    { label: 'Career-ready', done: completed >= total * 0.75 }
  ];

  return {
    completed,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    milestones
  };
}

export function createEmptyProfile() {
  return {
    qualifications: '',
    educationBranch: '',
    interests: [],
    skills: [],
    projects: [],
    certifications: [],
    preferredCareer: '',
    updatedAt: null
  };
}
