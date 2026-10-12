import mongoose from 'mongoose';
import { createApp } from './app.js';
import { connectDatabase } from './config/db.js';
import { loadEnvFile } from 'node:process';
import { existsSync } from 'node:fs';

if (existsSync('.env')) loadEnvFile('.env');
const ports = { identity: 8001, farm: 8002, weather: 8003, recommendation: 8004 };
const service = process.argv[2] || process.env.SERVICE_NAME;
if (!ports[service]) throw new Error('Unknown SERVICE_NAME');
if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is required');
if (service !== 'weather') delete process.env.OPENWEATHER_API_KEY;
try {
  await connectDatabase();
  const server = createApp(service).listen(Number(process.env.PORT) || ports[service], '127.0.0.1', () => console.log(`${service} service listening`));
  const shutdown = () => server.close(async () => { await mongoose.disconnect(); process.exit(0); });
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
} catch {
  console.error(`${service} startup failed: check MongoDB configuration and connectivity`);
  process.exit(1);
}
