import test from 'node:test';
import assert from 'node:assert/strict';
import axios from 'axios';
import { createApp } from '../app.js';
import { requestFarmWeather } from '../services/weatherClient.js';

test('domain services expose only their assigned route modules', () => {
  for (const [service, count] of Object.entries({ identity: 2, farm: 1, weather: 1, recommendation: 1 })) {
    const app = createApp(service);
    const mountedRouters = app.router.stack.filter((layer) => layer.name === 'router');
    assert.equal(mountedRouters.length, count);
  }
});

test('weather client forwards authentication and never hides provider failures', async () => {
  const original = axios.get;
  try {
    axios.get = async (url, options) => {
      assert.ok(url.endsWith('/api/v1/weather/farm-id'));
      assert.equal(options.headers.Authorization, 'Bearer session');
      assert.equal(options.timeout, 10000);
      return { data: { success: true, data: { temperature: 36 } } };
    };
    assert.deepEqual(await requestFarmWeather('farm-id', 'Bearer session'), { temperature: 36 });
    axios.get = async () => { throw { response: { status: 502, data: { message: 'Weather provider is unavailable', code: 'WEATHER_PROVIDER_ERROR' } } }; };
    await assert.rejects(requestFarmWeather('farm-id', 'Bearer session'), (error) => error.statusCode === 502 && error.code === 'WEATHER_PROVIDER_ERROR');
    axios.get = async () => { throw { code: 'ECONNABORTED' }; };
    await assert.rejects(requestFarmWeather('farm-id', 'Bearer session'), (error) => error.statusCode === 504);
    axios.get = async () => ({ data: { success: false } });
    await assert.rejects(requestFarmWeather('farm-id', 'Bearer session'), (error) => error.statusCode === 502);
  } finally { axios.get = original; }
});
