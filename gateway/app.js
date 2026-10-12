import http from 'node:http';
import https from 'node:https';

const reply = (res, status, message, code) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: false, message, code }));
};

export const createGateway = (targets, { origin = 'http://localhost:5174', timeout = 15000 } = {}) => http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', origin.replace(/\/+$/, ''));
  res.setHeader('Vary', 'Origin');
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Authorization,Content-Type' });
    return res.end();
  }
  if (!req.url.startsWith('/') || req.url.startsWith('//')) return reply(res, 400, 'Invalid request path', 'INVALID_PATH');
  const path = new URL(req.url, 'http://gateway').pathname;
  if (path === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: true, data: { service: 'gateway', status: 'ok' } }));
  }
  const domain = /^\/api\/v1\/(auth|users|farms|weather|recommendations)(?:\/|$)/.exec(path)?.[1];
  const service = { auth: 'identity', users: 'identity', farms: 'farm', weather: 'weather', recommendations: 'recommendation' }[domain];
  // The public health endpoint retains the original database readiness contract.
  const target = targets[path === '/api/v1/health' ? 'identity' : service];
  if (!target) return reply(res, 404, 'Route not found', 'NOT_FOUND');
  const url = new URL(target);
  const incoming = new URL(req.url, 'http://gateway');
  url.pathname = incoming.pathname;
  url.search = incoming.search;
  const headers = { ...req.headers, host: url.host };
  delete headers.connection;
  const upstream = (url.protocol === 'https:' ? https : http).request(url, { method: req.method, headers }, (response) => {
    res.writeHead(response.statusCode, { 'Content-Type': response.headers['content-type'] || 'application/json' });
    response.on('error', () => res.destroy());
    response.pipe(res);
  });
  upstream.setTimeout(timeout, () => upstream.destroy(Object.assign(new Error('timeout'), { code: 'UPSTREAM_TIMEOUT' })));
  upstream.on('error', (error) => {
    if (res.headersSent) return res.destroy();
    reply(res, error.code === 'UPSTREAM_TIMEOUT' ? 504 : 503, 'Requested service is unavailable', 'SERVICE_UNAVAILABLE');
  });
  req.on('aborted', () => upstream.destroy());
  req.pipe(upstream);
});
