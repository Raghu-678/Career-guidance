import mongoose from 'mongoose';

const requiredSkillSchema = new mongoose.Schema({
  skillName: String,
  importance: { type: Number, min: 1, max: 10 },
  minProficiency: { type: Number, min: 1, max: 10 },
}, { _id: false });

const careerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  domain: String,
  description: String,
  requiredSkills: [requiredSkillSchema],
});

export default mongoose.model('Career', careerSchema);
