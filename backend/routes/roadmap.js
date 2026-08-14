import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Career from '../models/Career.js';
import StudentProfile from '../models/StudentProfile.js';
import RoadmapProgress from '../models/RoadmapProgress.js';
import { authMiddleware } from '../middleware/auth.js';
import {
  buildMasterSkillList,
  getCareerRecommendations,
  analyzeSkillGaps,
  generateRoadmapItems,
  computeReadinessScore,
  bumpSkillProficiency,
} from '../services/recommendationEngine.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const skillResourcesPath = path.join(__dirname, '../../seed/skill-resources.json');
const skillResources = JSON.parse(fs.readFileSync(skillResourcesPath, 'utf-8'));

const router = Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const { careerId } = req.query;
    if (!careerId) return res.status(400).json({ error: 'careerId query parameter is required' });

    const profile = await StudentProfile.findOne({ userId: req.user.id });
    const career = await Career.findById(careerId);
    if (!profile || !career) return res.status(404).json({ error: 'Profile or career not found' });

    let roadmap = await RoadmapProgress.findOne({ userId: req.user.id, targetCareerId: careerId });

    if (!roadmap) {
      const gaps = analyzeSkillGaps(profile, career);
      const items = generateRoadmapItems(gaps, skillResources);
      const careers = await Career.find();
      const masterSkills = buildMasterSkillList(careers);
      const { readiness } = computeReadinessScore(profile, career, masterSkills);

      roadmap = await RoadmapProgress.create({
        userId: req.user.id,
        targetCareerId: careerId,
        items,
        readinessScoreHistory: [{ date: new Date(), score: readiness }],
      });
    }

    res.json({
      careerId: career._id,
      careerTitle: career.title,
      items: roadmap.items,
      readinessScoreHistory: roadmap.readinessScoreHistory,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/item/:itemId', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['not-started', 'in-progress', 'done'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const roadmap = await RoadmapProgress.findOne({
      userId: req.user.id,
      'items._id': req.params.itemId,
    });
    if (!roadmap) return res.status(404).json({ error: 'Roadmap item not found' });

    const item = roadmap.items.id(req.params.itemId);
    const wasDone = item.status === 'done';
    item.status = status;

    let profile = await StudentProfile.findOne({ userId: req.user.id });
    const career = await Career.findById(roadmap.targetCareerId);
    const careers = await Career.find();
    const masterSkills = buildMasterSkillList(careers);

    if (status === 'done' && !wasDone) {
      const reqSkill = career.requiredSkills.find((s) => s.skillName === item.skillName);
      profile = bumpSkillProficiency(profile, item.skillName, reqSkill?.minProficiency || 7);
      profile.updatedAt = new Date();
      await profile.save();
    }

    const { readiness } = computeReadinessScore(profile, career, masterSkills);
    roadmap.readinessScoreHistory.push({ date: new Date(), score: readiness });
    await roadmap.save();

    const recommendations = getCareerRecommendations(profile, careers, masterSkills, 5);

    res.json({
      item,
      readiness,
      readinessScoreHistory: roadmap.readinessScoreHistory,
      recommendations,
      profileCompleteness: profile.skills,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
