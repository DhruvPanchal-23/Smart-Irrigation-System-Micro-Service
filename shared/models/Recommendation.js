import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  status: { type: String, required: true }, title: String, reason: String, recommendedAction: String,
  weatherSnapshot: { type: mongoose.Schema.Types.Mixed, required: true }, disclaimer: String, generatedAt: { type: Date, default: Date.now },
}, { timestamps: true });
schema.index({ farm: 1, generatedAt: -1 });
export default mongoose.model('Recommendation', schema);
