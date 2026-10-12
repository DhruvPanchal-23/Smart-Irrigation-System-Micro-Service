import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { once } from 'node:events';
import { createGateway } from '../gateway/app.js';

const listen = async (server, t) => {
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => { server.closeAllConnections(); return new Promise((resolve) => server.close(resolve)); });
  return `http://127.0.0.1:${server.address().port}`;
};

test('gateway routes every domain and preserves method, token, body, query and status', async (t) => {
  const targets = {};
  for (const name of ['identity', 'farm', 'weather', 'recommendation']) {
    targets[name] = await listen(http.createServer(async (req, res) => {
      let body = '';
      for await (const chunk of req) body += chunk;
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ name, method: req.method, url: req.url, authorization: req.headers.authorization, body }));
    }), t);
  }
  const gateway = await listen(createGateway(targets), t);
  for (const [domain, service] of Object.entries({ auth: 'identity', users: 'identity', farms: 'farm', weather: 'weather', recommendations: 'recommendation' })) {
    const response = await fetch(`${gateway}/api/v1/${domain}?page=2`, { method: 'POST', headers: { Authorization: 'Bearer test-token', 'Content-Type': 'application/json' }, body: '{"farmName":"Test"}' });
    assert.equal(response.status, 201);
    assert.deepEqual(await response.json(), { name: service, method: 'POST', url: `/api/v1/${domain}?page=2`, authorization: 'Bearer test-token', body: '{"farmName":"Test"}' });
  }
  assert.equal((await (await fetch(`${gateway}/api/v1/health`)).json()).name, 'identity');
});

test('gateway liveness, preflight and unknown routes do not depend on services', async (t) => {
  const gateway = await listen(createGateway({}), t);
  assert.equal((await fetch(`${gateway}/health`)).status, 200);
  assert.equal((await fetch(`${gateway}/api/v1/farms`, { method: 'OPTIONS' })).status, 204);
  assert.equal((await fetch(`${gateway}/api/v1/farms-extra`)).status, 404);
});

test('gateway handles unavailable services and timeouts safely', async (t) => {
  const closed = http.createServer();
  const address = await listen(closed, t);
  await new Promise((resolve) => closed.close(resolve));
  const hanging = await listen(http.createServer(() => {}), t);
  const gateway = await listen(createGateway({ farm: address, weather: hanging }, { timeout: 30 }), t);
  const unavailable = await fetch(`${gateway}/api/v1/farms`);
  assert.equal(unavailable.status, 503);
  assert.equal((await unavailable.json()).code, 'SERVICE_UNAVAILABLE');
  assert.equal((await fetch(`${gateway}/api/v1/weather/id`)).status, 504);
});
