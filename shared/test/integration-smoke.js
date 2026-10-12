import assert from 'node:assert/strict';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { randomBytes } from 'node:crypto';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Farm from '../models/Farm.js';
import WeatherHistory from '../models/WeatherHistory.js';
import Recommendation from '../models/Recommendation.js';

// Explicitly separate from the real application database. Provider is mocked.
const uri = 'mongodb://127.0.0.1:27017/smart_irrigation_microservices_test';
const children = [];
const users = [];
let providerFailure = false;
const provider = http.createServer((_req, res) => {
  res.writeHead(providerFailure ? 502 : 200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ main: { temp: 36, humidity: 50, pressure: 1010 }, wind: { speed: 3 }, pop: 0.2, weather: [{ description: 'clear sky', icon: '01d' }] }));
});
const allocatePort = async () => {
  const server = http.createServer().listen(0, '127.0.0.1');
  await once(server, 'listening');
  const port = server.address().port;
  await new Promise((resolve) => server.close(resolve));
  return port;
};
const ready = async (url, child) => {
  for (let attempt = 0; attempt < 150; attempt++) {
    if (child.exitCode !== null) throw new Error('Service exited before becoming ready');
    try { if ((await fetch(`${url}/health`, { signal: AbortSignal.timeout(500) })).ok) return; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error('Service startup timed out');
};
try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  provider.listen(0, '127.0.0.1');
  await once(provider, 'listening');
  const names = ['identity', 'farm', 'weather', 'recommendation'];
  const targets = {};
  for (const name of names) targets[name] = `http://127.0.0.1:${await allocatePort()}`;
  const gatewayPort = await allocatePort();
  const env = {
    ...process.env, NODE_ENV: 'test', MONGODB_URI: uri, JWT_SECRET: randomBytes(32).toString('hex'),
    OPENWEATHER_API_KEY: 'mock-provider-test-key', OPENWEATHER_BASE_URL: `http://127.0.0.1:${provider.address().port}`,
    GATEWAY_PORT: String(gatewayPort),
    ...Object.fromEntries(names.map((name) => [`${name.toUpperCase()}_SERVICE_URL`, targets[name]])),
  };
  for (const name of [...names, 'gateway']) {
    const child = spawn(process.execPath, name === 'gateway' ? ['gateway/server.js'] : ['shared/serviceServer.js', name], {
      env: { ...env, PORT: name === 'gateway' ? undefined : new URL(targets[name]).port }, stdio: ['ignore', 'inherit', 'inherit'], windowsHide: true,
    });
    children.push(child);
    await ready(name === 'gateway' ? `http://127.0.0.1:${gatewayPort}` : targets[name], child);
  }
  const api = async (path, { method = 'GET', body, token, status = 200 } = {}) => {
    const response = await fetch(`http://127.0.0.1:${gatewayPort}/api/v1${path}`, {
      method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(15000),
    });
    const result = await response.json();
    assert.equal(response.status, status, `${path}: ${result.message}`);
    return result.data;
  };
  await api('/health');
  const suffix = randomBytes(6).toString('hex');
  let first;
  let second;
  for (const number of [1, 2]) {
    const email = `microservices-${suffix}-${number}@example.com`;
    const account = await api('/auth/register', { method: 'POST', status: 201, body: { name: 'Smoke Farmer', email, password: 'Test-password-123!', role: 'admin' } });
    users.push(account.user.id);
    assert.equal(account.user.role, 'farmer');
    assert.equal(account.user.password, undefined);
    if (number === 1) first = { ...account, email }; else second = account;
  }
  await api('/auth/register', { method: 'POST', status: 409, body: { name: 'Duplicate', email: first.email, password: 'Test-password-123!' } });
  await api('/auth/login', { method: 'POST', body: { email: first.email, password: 'Test-password-123!' } });
  await api('/auth/login', { method: 'POST', status: 401, body: { email: first.email, password: 'wrong' } });
  await api('/users/profile', { status: 401 });
  await api('/auth/me', { token: first.token });
  const farm = await api('/farms', { method: 'POST', status: 201, token: first.token, body: { farmName: 'Smoke Farm', cropType: 'Sugarcane', area: 2, location: { latitude: 18.5, longitude: 73.8 }, owner: second.user.id } });
  assert.equal(farm.owner, first.user.id);
  await api(`/farms/${farm._id}`, { token: second.token, status: 404 });
  await api('/farms/invalid', { token: first.token, status: 400 });
  await api('/farms', { token: first.token });
  await api(`/farms/${farm._id}`, { method: 'PUT', token: first.token, body: { farmName: 'Updated Farm' } });
  await api(`/weather/${farm._id}`, { token: second.token, status: 404 });
  await api(`/weather/${farm._id}`, { token: first.token });
  const recommendation = await api(`/recommendations/${farm._id}`, { method: 'POST', token: first.token, status: 201 });
  assert.equal(recommendation.title, 'Irrigate Today');
  assert.equal(recommendation.weatherSnapshot.temperature, 36);
  assert.equal((await api(`/weather/${farm._id}/history`, { token: first.token })).length, 2);
  assert.equal((await api(`/recommendations/${farm._id}/history`, { token: first.token })).length, 1);
  await api(`/recommendations/${farm._id}`, { token: first.token });
  providerFailure = true;
  await api(`/recommendations/${farm._id}`, { method: 'POST', token: first.token, status: 502 });
  assert.equal(await Recommendation.countDocuments({ user: first.user.id }), 1);
  await api('/users/profile', { method: 'PUT', token: first.token, body: { name: 'Updated Farmer' } });
  await api('/users/change-password', { method: 'PUT', token: first.token, body: { currentPassword: 'Test-password-123!', newPassword: 'Changed-password-123!' } });
  await api('/auth/login', { method: 'POST', body: { email: first.email, password: 'Changed-password-123!' } });
  await api(`/farms/${farm._id}`, { method: 'DELETE', token: first.token });
  assert.equal(await WeatherHistory.countDocuments({ user: first.user.id }), 0);
  assert.equal(await Recommendation.countDocuments({ user: first.user.id }), 0);
  await api('/auth/logout', { method: 'POST', token: first.token });
  console.log('PASS: five independent processes, database health, auth/profile/password, farm CRUD/ownership, mocked weather, recommendations/history, provider failure, deletion cleanup');
} finally {
  for (const child of children) {
    if (child.exitCode === null) { const exited = once(child, 'exit'); child.kill(); await exited; }
  }
  provider.closeAllConnections();
  await new Promise((resolve) => provider.close(resolve));
  if (mongoose.connection.readyState === 1 && users.length) {
    await Promise.all([User.deleteMany({ _id: { $in: users } }), Farm.deleteMany({ owner: { $in: users } }), WeatherHistory.deleteMany({ user: { $in: users } }), Recommendation.deleteMany({ user: { $in: users } })]);
  }
  await mongoose.disconnect();
}
