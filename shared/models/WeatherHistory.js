import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  temperature: Number, humidity: Number, windSpeed: Number, pressure: Number, rainProbability: Number, condition: String, icon: String,
  recordedAt: { type: Date, default: Date.now },
}, { timestamps: true });
schema.index({ farm: 1, recordedAt: -1 });
export default mongoose.model('WeatherHistory', schema);
