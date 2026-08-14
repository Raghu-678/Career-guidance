import { Router } from 'express';
import StudentProfile from '../models/StudentProfile.js';
import { authMiddleware } from '../middleware/auth.js';
import { computeProfileCompleteness } from '../services/recommendationEngine.js';

const router = Router();
router.use(authMiddleware);

async function getOrCreateProfile(userId) {
  let profile = await StudentProfile.findOne({ userId });
  if (!profile) {
    profile = await StudentProfile.create({ userId });
  }
  return profile;
}

function profileResponse(profile) {
  return {
    ...profile.toObject(),
    completeness: computeProfileCompleteness(profile),
  };
}

router.get('/me', async (req, res) => {
  try {
    const profile = await getOrCreateProfile(req.user.id);
    res.json(profileResponse(profile));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/me', async (req, res) => {
  try {
    const profile = await getOrCreateProfile(req.user.id);
    const { education, skills, interests, preferredCareers } = req.body;

    if (education) profile.education = { ...profile.education?.toObject?.() || profile.education || {}, ...education };
    if (skills) profile.skills = skills;
    if (interests) profile.interests = interests;
    if (preferredCareers) profile.preferredCareers = preferredCareers;
    profile.updatedAt = new Date();

    await profile.save();
    res.json(profileResponse(profile));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/me/projects', async (req, res) => {
  try {
    const profile = await getOrCreateProfile(req.user.id);
    const { title, description, techStack, link } = req.body;
    if (!title) return res.status(400).json({ error: 'Project title is required' });

    profile.projects.push({ title, description, techStack: techStack || [], link });
    profile.updatedAt = new Date();
    await profile.save();
    res.json(profileResponse(profile));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/me/projects/:id', async (req, res) => {
  try {
    const profile = await getOrCreateProfile(req.user.id);
    profile.projects.id(req.params.id)?.deleteOne();
    profile.updatedAt = new Date();
    await profile.save();
    res.json(profileResponse(profile));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/me/certifications', async (req, res) => {
  try {
    const profile = await getOrCreateProfile(req.user.id);
    const { title, issuer, dateIssued, credentialLink } = req.body;
    if (!title) return res.status(400).json({ error: 'Certification title is required' });

    profile.certifications.push({ title, issuer, dateIssued, credentialLink });
    profile.updatedAt = new Date();
    await profile.save();
    res.json(profileResponse(profile));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/me/certifications/:id', async (req, res) => {
  try {
    const profile = await getOrCreateProfile(req.user.id);
    profile.certifications.id(req.params.id)?.deleteOne();
    profile.updatedAt = new Date();
    await profile.save();
    res.json(profileResponse(profile));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
