import test from 'node:test'; import assert from 'node:assert/strict'; import { evaluateIrrigation } from '../utils/irrigationRules.js';
const title = (weather) => evaluateIrrigation(weather).title;
test('rain boundary and priority', () => { assert.equal(title({ rainProbability: 61, humidity: 90, temperature: 40 }), 'No Irrigation Required'); assert.equal(title({ rainProbability: 60, humidity: 20, temperature: 20 }), 'Monitor Weather'); });
test('humidity boundary', () => { assert.equal(title({ humidity: 81 }), 'Delay Irrigation'); assert.equal(title({ humidity: 80 }), 'Monitor Weather'); });
test('temperature boundary', () => { assert.equal(title({ temperature: 36 }), 'Irrigate Today'); assert.equal(title({ temperature: 35 }), 'Monitor Weather'); });
test('all result fields exist', () => { const item = evaluateIrrigation({}); for (const key of ['status', 'title', 'reason', 'recommendedAction']) assert.ok(item[key]); });
