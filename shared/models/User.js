import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  mobile: { type: String, trim: true, default: '' },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['farmer', 'admin'], default: 'farmer' },
  status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
}, { timestamps: true });
schema.set('toJSON', { transform: (_, value) => { delete value.password; delete value.__v; return value; } });
export default mongoose.model('User', schema);
