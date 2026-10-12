import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmName: { type: String, required: true, trim: true, maxlength: 100 },
  cropType: { type: String, required: true, trim: true, maxlength: 80 },
  area: { type: Number, required: true, min: 0.01 },
  areaUnit: { type: String, enum: ['acre', 'hectare'], default: 'acre' },
  location: { address: { type: String, trim: true, default: '' }, latitude: { type: Number, required: true, min: -90, max: 90 }, longitude: { type: Number, required: true, min: -180, max: 180 } },
}, { timestamps: true });
schema.index({ owner: 1, createdAt: -1 }); schema.index({ owner: 1, farmName: 1 });
export default mongoose.model('Farm', schema);
