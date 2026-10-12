import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
if (existsSync('.env')) loadEnvFile('.env');
if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) throw new Error('Configure MONGODB_URI and JWT_SECRET in microservices/.env');
const children = [];
let stopping = false;
const stop = (code = 0) => {
  if (stopping) return;
  stopping = true;
  process.exitCode = code;
  for (const child of children) child.kill();
};
for (const [index, service] of ['identity', 'farm', 'weather', 'recommendation', 'gateway'].entries()) {
  const env = { ...process.env, PORT: String(8001 + index) };
  if (service !== 'weather') delete env.OPENWEATHER_API_KEY;
  const child = spawn(process.execPath, service === 'gateway' ? ['gateway/server.js'] : ['shared/serviceServer.js', service], { env, stdio: 'inherit', windowsHide: true });
  children.push(child);
  child.on('error', () => stop(1));
  child.on('exit', (code) => { if (!stopping) stop(code || 1); });
}
process.on('SIGINT', () => stop());
process.on('SIGTERM', () => stop());
