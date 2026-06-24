import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true, uppercase: true },
  shortName: { type: String, trim: true },
  category: {
    type: String,
    enum: ['undergraduate', 'postgraduate', 'diploma', 'certificate', 'vocational'],
    required: true
  },
  department: { type: String, required: true },
  duration: { type: String, required: true }, // e.g., "3 Years", "2 Years"
  totalSeats: { type: Number, required: true },
  availableSeats: { type: Number },
  eligibility: { type: String, required: true },
  description: { type: String, required: true },
  highlights: [{ type: String }],
  syllabus: [{
    semester: Number,
    subjects: [{ name: String, credits: Number }]
  }],
  fees: {
    admission: { type: Number, default: 0 },
    annual: { type: Number, required: true },
    examination: { type: Number, default: 0 }
  },
  affiliatedBy: { type: String, default: 'BRABU Muzaffarpur' },
  image: {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' }
  },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true });

courseSchema.index({ category: 1, isActive: 1 });
courseSchema.index({ code: 1 });

export default mongoose.model('Course', courseSchema);