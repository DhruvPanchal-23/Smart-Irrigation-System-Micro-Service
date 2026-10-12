import mongoose from 'mongoose';

const DEFAULT_SERVER_SELECTION_TIMEOUT_MS = 5000;
const REQUIRED_PRODUCTION_DATABASE = 'smart_irrigation';
let connectionPromise = null;

const configurationError = (message) => {
  const error = new Error(message);
  error.code = 'DB_CONFIGURATION_ERROR';
  return error;
};

export const validateMongoUri = (uri, nodeEnv = process.env.NODE_ENV) => {
  if (typeof uri !== 'string' || !uri.trim()) {
    throw configurationError('MONGODB_URI is required');
  }

  let parsed;
  try {
    parsed = new URL(uri.trim());
  } catch {
    throw configurationError('MONGODB_URI is invalid');
  }

  if (!['mongodb:', 'mongodb+srv:'].includes(parsed.protocol)) {
    throw configurationError('MONGODB_URI must use a MongoDB protocol');
  }

  let databaseName;
  try {
    databaseName = decodeURIComponent(parsed.pathname.replace(/^\//, ''));
  } catch {
    throw configurationError('MONGODB_URI contains invalid encoding');
  }
  if (!parsed.hostname || !databaseName) {
    throw configurationError('MONGODB_URI must include a host and database name');
  }

  if (nodeEnv === 'production') {
    if (parsed.protocol !== 'mongodb+srv:') {
      throw configurationError('Production MONGODB_URI must use MongoDB Atlas SRV format');
    }
    if (databaseName !== REQUIRED_PRODUCTION_DATABASE) {
      throw configurationError(`Production MongoDB database must be ${REQUIRED_PRODUCTION_DATABASE}`);
    }
  }

  return uri.trim();
};

const collectErrorSignals = (rootError) => {
  const signals = [];
  const pending = [rootError];
  const visited = new Set();

  while (pending.length && visited.size < 30) {
    const error = pending.shift();
    if (!error || typeof error !== 'object' || visited.has(error)) continue;
    visited.add(error);
    signals.push(`${String(error.code || '')} ${String(error.name || '')} ${String(error.message || '')}`.toLowerCase());

    pending.push(error.cause, error.reason);
    if (error.errors instanceof Map) pending.push(...error.errors.values());
    if (error.servers instanceof Map) {
      for (const server of error.servers.values()) pending.push(server?.error);
    }
  }

  return signals.join(' ');
};

export const classifyDatabaseError = (error) => {
  const signals = collectErrorSignals(error);

  if (signals.includes('db_configuration_error') || signals.includes('mongodb_uri')) return 'configuration';
  if (/\b(enotfound|eservfail|enodata)\b|querysrv|querytxt/.test(signals)) return 'dns';
  if (/\b18\b|authentication failed|bad auth|auth failed/.test(signals)) return 'authentication';
  if (/not whitelisted|ip access list|network access|connection refused/.test(signals)) return 'network_access';
  if (/etimedout|timed out|server selection/.test(signals)) return 'timeout';
  return 'database_unavailable';
};

export const getDatabaseStatus = () => ({
  connected: mongoose.connection.readyState === 1,
  state: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown',
});

export const connectDatabase = async () => {
  const uri = validateMongoUri(process.env.MONGODB_URI);

  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (mongoose.connection.readyState === 2 && connectionPromise) return connectionPromise;

  // A resolved promise must not mask a connection that dropped between warm invocations.
  if (mongoose.connection.readyState !== 2) connectionPromise = null;

  connectionPromise = mongoose
    .connect(uri, { serverSelectionTimeoutMS: DEFAULT_SERVER_SELECTION_TIMEOUT_MS })
    .then(() => mongoose.connection)
    .catch((error) => {
      connectionPromise = null;
      throw error;
    });

  return connectionPromise;
};
