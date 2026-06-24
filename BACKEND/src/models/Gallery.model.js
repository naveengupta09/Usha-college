import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  category: {
    type: String,
    enum: ['campus', 'events', 'sports', 'academics', 'cultural', 'infrastructure', 'achievements'],
    required: true
  },
  image: {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    width: Number,
    height: Number,
  },
  tags: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  eventDate: { type: Date },
}, { timestamps: true });

gallerySchema.index({ category: 1, isActive: 1 });
gallerySchema.index({ isFeatured: 1 });

export default mongoose.model('Gallery', gallerySchema);