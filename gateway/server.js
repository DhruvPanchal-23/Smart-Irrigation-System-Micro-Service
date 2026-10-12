import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { createGateway } from './app.js';
if (existsSync('.env')) loadEnvFile('.env');
const targets = Object.fromEntries(['identity', 'farm', 'weather', 'recommendation'].map((service, index) => [service, process.env[`${service.toUpperCase()}_SERVICE_URL`] || `http://127.0.0.1:${8001 + index}`]));
const server = createGateway(targets, { origin: process.env.FRONTEND_URL }).listen(Number(process.env.GATEWAY_PORT) || 8100, '127.0.0.1', () => console.log('API gateway listening'));
process.on('SIGINT', () => server.close());
process.on('SIGTERM', () => server.close());
