import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import farmRoutes from './routes/farm.routes.js';
import weatherRoutes from './routes/weather.routes.js';
import recommendationRoutes from './routes/recommendation.routes.js';
import { getDatabaseStatus } from './config/db.js';
import { requireDatabase } from './middleware/database.middleware.js';
import { notFound, errorHandler } from './middleware/error.middleware.js';

export const normalizeOrigin = (origin) => origin.replace(/\/+$/, '');

export const createApp = (service = 'all') => {
const app = express();
app.disable('x-powered-by');
app.use(cors({ origin: normalizeOrigin(process.env.FRONTEND_URL || 'http://localhost:5173') }));
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: false }));
app.use('/api/v1', requireDatabase);
app.get('/api/v1/health', (_req, res) => res.json({
  success: true,
  message: 'Service is healthy',
  data: { status: 'ok', database: getDatabaseStatus() },
}));
app.get('/health', (_req, res) => res.json({ success: true, data: { service, status: 'ok' } }));
if (service === 'identity' || service === 'all') {
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
}
if (service === 'farm' || service === 'all') app.use('/api/v1/farms', farmRoutes);
if (service === 'weather' || service === 'all') app.use('/api/v1/weather', weatherRoutes);
if (service === 'recommendation' || service === 'all') app.use('/api/v1/recommendations', recommendationRoutes);
app.use(notFound); app.use(errorHandler);
return app;
};
const app = createApp();
export default app;
