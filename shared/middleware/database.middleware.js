import { classifyDatabaseError, connectDatabase } from '../config/db.js';
import { AppError } from '../utils/apiResponse.js';
import { logError } from '../utils/logger.js';

export const requireDatabase = async (req, _res, next) => {
  if (req.method === 'OPTIONS') return next();

  try {
    await connectDatabase();
    return next();
  } catch (error) {
    logError('Database connection unavailable', error, {
      category: classifyDatabaseError(error),
      method: req.method,
      path: req.originalUrl,
    });
    return next(new AppError(503, 'Database service is temporarily unavailable', 'DATABASE_UNAVAILABLE'));
  }
};
