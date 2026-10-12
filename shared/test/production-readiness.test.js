import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { classifyDatabaseError, connectDatabase, getDatabaseStatus, validateMongoUri } from '../config/db.js';
import { normalizeOrigin } from '../app.js';
import { requireDatabase } from '../middleware/database.middleware.js';

test('normalizes a production frontend origin by removing trailing slashes', () => {
  assert.equal(normalizeOrigin('https://smart-irrigation-wbjg.vercel.app/'), 'https://smart-irrigation-wbjg.vercel.app');
});

test('reports the current database readiness state', () => {
  const status = getDatabaseStatus();
  assert.equal(status.connected, mongoose.connection.readyState === 1);
  assert.equal(typeof status.state, 'string');
});

test('classifies database failures without exposing connection details', () => {
  assert.equal(classifyDatabaseError(new Error('MONGODB_URI is required')), 'configuration');
  assert.equal(classifyDatabaseError({ code: 'ENOTFOUND', message: 'querySrv failed' }), 'dns');
  assert.equal(classifyDatabaseError({ code: 18, message: 'Authentication failed' }), 'authentication');
  assert.equal(classifyDatabaseError(new Error('IP that is not whitelisted')), 'network_access');
  assert.equal(classifyDatabaseError(new Error('Server selection timed out')), 'timeout');
  assert.equal(classifyDatabaseError(new Error('Cluster unavailable')), 'database_unavailable');
  assert.equal(classifyDatabaseError({ reason: { servers: new Map([['host', { error: { code: 'ENOTFOUND' } }]]) } }), 'dns');
  assert.equal(classifyDatabaseError({ cause: { code: 18, message: 'Authentication failed' } }), 'authentication');
});

test('validates Atlas production configuration without returning credentials in errors', () => {
  const validUri = 'mongodb+srv://farmer:secret@cluster.example.mongodb.net/smart_irrigation?retryWrites=true&w=majority';
  assert.equal(validateMongoUri(validUri, 'production'), validUri);
  assert.throws(
    () => validateMongoUri('mongodb://127.0.0.1:27017/smart_irrigation', 'production'),
    (error) => error.code === 'DB_CONFIGURATION_ERROR' && !error.message.includes('127.0.0.1'),
  );
  assert.throws(
    () => validateMongoUri('mongodb+srv://user:secret@cluster.example.mongodb.net/wrong_database', 'production'),
    (error) => error.code === 'DB_CONFIGURATION_ERROR' && !error.message.includes('secret'),
  );
});

test('rejects missing database configuration immediately', async () => {
  const originalUri = process.env.MONGODB_URI;
  delete process.env.MONGODB_URI;

  try {
    await assert.rejects(connectDatabase(), /MONGODB_URI is required/);
  } finally {
    if (originalUri === undefined) delete process.env.MONGODB_URI;
    else process.env.MONGODB_URI = originalUri;
  }
});

test('database middleware returns a sanitized 503 when configuration is missing', async () => {
  const originalUri = process.env.MONGODB_URI;
  delete process.env.MONGODB_URI;
  let receivedError;

  try {
    await requireDatabase(
      { method: 'POST', originalUrl: '/api/v1/auth/register' },
      {},
      (error) => { receivedError = error; },
    );
    assert.equal(receivedError.statusCode, 503);
    assert.equal(receivedError.code, 'DATABASE_UNAVAILABLE');
    assert.equal(receivedError.message, 'Database service is temporarily unavailable');
  } finally {
    if (originalUri === undefined) delete process.env.MONGODB_URI;
    else process.env.MONGODB_URI = originalUri;
  }
});

test('CORS preflight does not require a database connection', async () => {
  let receivedError = Symbol('not called');
  await requireDatabase({ method: 'OPTIONS' }, {}, (error) => { receivedError = error; });
  assert.equal(receivedError, undefined);
});
