import mongoose from 'mongoose'; import { AppError } from '../utils/apiResponse.js';
export const validateObjectId = (param = 'farmId') => (req, _res, next) => mongoose.isValidObjectId(req.params[param]) ? next() : next(new AppError(400, 'Invalid identifier', 'INVALID_ID'));
export const requireFields = (...fields) => (req, _res, next) => { const missing = fields.filter((key) => req.body[key] === undefined || req.body[key] === ''); return missing.length ? next(new AppError(400, `Required fields: ${missing.join(', ')}`, 'VALIDATION_ERROR')) : next(); };
