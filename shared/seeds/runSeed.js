import 'dotenv/config';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/db.js';
import Farm from '../models/Farm.js';
import Recommendation from '../models/Recommendation.js';
import User from '../models/User.js';
import WeatherHistory from '../models/WeatherHistory.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedPath = path.join(__dirname, 'data', 'smart_irrigation_seed_5_years.json');
const validateOnly = process.argv.includes('--validate-only');

const objectIdFor = (sourceId) =>
  new mongoose.Types.ObjectId(createHash('sha256').update(`kisansetu:${sourceId}`).digest('hex').slice(0, 24));

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const validateDocument = (Model, document, sourceId) => {
  const error = new Model(document).validateSync();
  if (error) throw new Error(`Invalid ${Model.modelName} record ${sourceId}: ${error.message}`);
};

const loadAndTransformSeed = async (passwordHash) => {
  const seed = JSON.parse(await readFile(seedPath, 'utf8'));
  assert(Array.isArray(seed.users) && seed.users.length > 0, 'Seed must contain users');
  assert(Array.isArray(seed.farms), 'Seed must contain farms');
  assert(Array.isArray(seed.weatherHistories), 'Seed must contain weatherHistories');
  assert(Array.isArray(seed.recommendations), 'Seed must contain recommendations');

  const userIds = new Map(seed.users.map(({ _id }) => [_id, objectIdFor(_id)]));
  const farmIds = new Map(seed.farms.map(({ _id }) => [_id, objectIdFor(_id)]));
  const weatherIds = new Map(seed.weatherHistories.map(({ _id }) => [_id, objectIdFor(_id)]));

  const users = seed.users.map((user) => ({
    _id: userIds.get(user._id),
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    password: passwordHash,
    role: 'farmer',
    status: user.status,
  }));

  const farms = seed.farms.map((farm) => {
    assert(userIds.has(farm.owner), `Farm ${farm._id} references unknown user ${farm.owner}`);
    return {
      _id: farmIds.get(farm._id),
      owner: userIds.get(farm.owner),
      farmName: farm.farmName,
      cropType: farm.cropName,
      area: farm.area,
      areaUnit: farm.areaUnit,
      location: {
        address: [farm.village, farm.district, farm.state].filter(Boolean).join(', '),
        latitude: farm.latitude,
        longitude: farm.longitude,
      },
    };
  });

  const weatherHistories = seed.weatherHistories.map((weather) => {
    assert(userIds.has(weather.user), `Weather ${weather._id} references unknown user ${weather.user}`);
    assert(farmIds.has(weather.farm), `Weather ${weather._id} references unknown farm ${weather.farm}`);
    return {
      _id: weatherIds.get(weather._id),
      user: userIds.get(weather.user),
      farm: farmIds.get(weather.farm),
      temperature: weather.temperature,
      humidity: weather.humidity,
      windSpeed: weather.windSpeed,
      pressure: weather.pressure,
      rainProbability: weather.rainProbability,
      condition: weather.weatherCondition,
      recordedAt: new Date(weather.recordedAt),
    };
  });

  const recommendations = seed.recommendations.map((recommendation) => {
    assert(userIds.has(recommendation.user), `Recommendation ${recommendation._id} references unknown user ${recommendation.user}`);
    assert(farmIds.has(recommendation.farm), `Recommendation ${recommendation._id} references unknown farm ${recommendation.farm}`);
    const weatherHistoryId = recommendation.weatherSnapshot?.weatherHistoryId;
    assert(!weatherHistoryId || weatherIds.has(weatherHistoryId), `Recommendation ${recommendation._id} references unknown weather ${weatherHistoryId}`);
    return {
      _id: objectIdFor(recommendation._id),
      user: userIds.get(recommendation.user),
      farm: farmIds.get(recommendation.farm),
      status: recommendation.status,
      title: recommendation.title,
      reason: recommendation.reason,
      recommendedAction: recommendation.recommendedAction,
      weatherSnapshot: {
        ...recommendation.weatherSnapshot,
        ...(weatherHistoryId && { weatherHistoryId: weatherIds.get(weatherHistoryId) }),
      },
      disclaimer: recommendation.disclaimer,
      generatedAt: new Date(recommendation.generatedAt),
    };
  });

  users.forEach((document, index) => validateDocument(User, document, seed.users[index]._id));
  farms.forEach((document, index) => validateDocument(Farm, document, seed.farms[index]._id));
  weatherHistories.forEach((document, index) => validateDocument(WeatherHistory, document, seed.weatherHistories[index]._id));
  recommendations.forEach((document, index) => validateDocument(Recommendation, document, seed.recommendations[index]._id));

  return { metadata: seed.metadata, users, farms, weatherHistories, recommendations };
};

const insertInBatches = async (Model, documents, batchSize = 1000) => {
  for (let start = 0; start < documents.length; start += batchSize) {
    await Model.insertMany(documents.slice(start, start + batchSize), { ordered: true });
  }
};

try {
  const password = process.env.SEED_USER_PASSWORD;
  if (!validateOnly) assert(password && password.length >= 8, 'SEED_USER_PASSWORD must contain at least 8 characters');
  const validationPlaceholder = createHash('sha256').update(seedPath).digest('hex');
  const passwordHash = await bcrypt.hash(password || validationPlaceholder, 12);
  const data = await loadAndTransformSeed(passwordHash);

  if (validateOnly) {
    console.log(`Seed is valid: ${data.users.length} user, ${data.farms.length} farms, ${data.weatherHistories.length} weather records, ${data.recommendations.length} recommendations.`);
    process.exit(0);
  }

  await connectDatabase();
  const userIds = data.users.map(({ _id }) => _id);
  const farmIds = data.farms.map(({ _id }) => _id);

  await Recommendation.deleteMany({ $or: [{ user: { $in: userIds } }, { farm: { $in: farmIds } }] });
  await WeatherHistory.deleteMany({ $or: [{ user: { $in: userIds } }, { farm: { $in: farmIds } }] });
  await Farm.deleteMany({ _id: { $in: farmIds } });
  await User.deleteMany({ _id: { $in: userIds } });

  await User.insertMany(data.users);
  await Farm.insertMany(data.farms);
  await insertInBatches(WeatherHistory, data.weatherHistories);
  await insertInBatches(Recommendation, data.recommendations);

  console.log(`Seed imported into ${mongoose.connection.name}: ${data.users.length} user, ${data.farms.length} farms, ${data.weatherHistories.length} weather records, ${data.recommendations.length} recommendations.`);
} catch (error) {
  console.error(`Seed failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (mongoose.connection.readyState !== 0) await mongoose.connection.close();
}
