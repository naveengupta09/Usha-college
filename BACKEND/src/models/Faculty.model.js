import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  designation: { type: String, required: true, trim: true },
  department: { type: String, required: true, trim: true },
  qualification: { type: String, required: true },
  experience: { type: Number, required: true }, // in years
  specialization: [{ type: String }],
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  bio: { type: String },
  image: {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' }
  },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  publications: [{ title: String, year: Number, journal: String }],
}, { timestamps: true });

facultySchema.index({ department: 1, isActive: 1 });
facultySchema.index({ order: 1 });

export default mongoose.model('Faculty', facultySchema);