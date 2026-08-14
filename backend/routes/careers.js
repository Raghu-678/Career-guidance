import { Router } from 'express';
import Career from '../models/Career.js';
import StudentProfile from '../models/StudentProfile.js';
import { authMiddleware } from '../middleware/auth.js';
import {
  buildMasterSkillList,
  getCareerRecommendations,
  computeReadinessScore,
  analyzeSkillGaps,
  computeRadarData,
} from '../services/recommendationEngine.js';

const router = Router();

router.get('/careers', async (_req, res) => {
  try {
    const careers = await Career.find().select('-__v');
    res.json(careers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/recommendations', authMiddleware, async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user.id });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    const careers = await Career.find();
    const masterSkills = buildMasterSkillList(careers);
    const topN = parseInt(req.query.topN, 10) || 5;
    const recommendations = getCareerRecommendations(profile, careers, masterSkills, topN);

    res.json({ recommendations, masterSkillCount: masterSkills.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/readiness-score', authMiddleware, async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user.id });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    const careerId = req.query.careerId;
    const careers = await Career.find();
    const masterSkills = buildMasterSkillList(careers);

    let targetCareer;
    if (careerId) {
      targetCareer = careers.find((c) => c._id.toString() === careerId);
    }
    if (!targetCareer) {
      const recs = getCareerRecommendations(profile, careers, masterSkills, 1);
      targetCareer = careers.find((c) => c._id.toString() === recs[0]?.careerId?.toString());
    }
    if (!targetCareer) return res.status(404).json({ error: 'No careers available' });

    const { readiness, breakdown } = computeReadinessScore(profile, targetCareer, masterSkills);
    const radarData = computeRadarData(profile, targetCareer);

    res.json({
      careerId: targetCareer._id,
      careerTitle: targetCareer.title,
      readiness,
      breakdown,
      radarData,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/skill-gap', authMiddleware, async (req, res) => {
  try {
    const { careerId } = req.query;
    if (!careerId) return res.status(400).json({ error: 'careerId query parameter is required' });

    const profile = await StudentProfile.findOne({ userId: req.user.id });
    const career = await Career.findById(careerId);
    if (!profile || !career) return res.status(404).json({ error: 'Profile or career not found' });

    const gaps = analyzeSkillGaps(profile, career);
    res.json({ careerId: career._id, careerTitle: career.title, gaps });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
