import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  skillName: String,
  category: { type: String, enum: ['Technical', 'Soft', 'Tool'] },
  proficiency: { type: Number, min: 1, max: 10 },
}, { _id: false });

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  techStack: [String],
  link: String,
});

const certificationSchema = new mongoose.Schema({
  title: String,
  issuer: String,
  dateIssued: Date,
  credentialLink: String,
});

const studentProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  education: {
    degree: String,
    branch: String,
    institution: String,
    yearOfStudy: Number,
    cgpa: Number,
  },
  skills: [skillSchema],
  interests: [String],
  projects: [projectSchema],
  certifications: [certificationSchema],
  preferredCareers: [String],
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('StudentProfile', studentProfileSchema);
