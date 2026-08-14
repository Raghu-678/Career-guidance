import mongoose from 'mongoose';

const roadmapItemSchema = new mongoose.Schema({
  skillName: String,
  resource: {
    name: String,
    url: String,
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'done'],
    default: 'not-started',
  },
  priority: { type: String, enum: ['High', 'Medium', 'Low'] },
});

const readinessScoreSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  score: Number,
}, { _id: false });

const roadmapProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetCareerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Career', required: true },
  items: [roadmapItemSchema],
  readinessScoreHistory: [readinessScoreSchema],
});

roadmapProgressSchema.index({ userId: 1, targetCareerId: 1 }, { unique: true });

export default mongoose.model('RoadmapProgress', roadmapProgressSchema);
