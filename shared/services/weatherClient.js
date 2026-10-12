import axios from 'axios';
import { AppError } from '../utils/apiResponse.js';

export const requestFarmWeather = async (farmId, authorization) => {
  try {
    const { data } = await axios.get(`${process.env.WEATHER_SERVICE_URL || 'http://127.0.0.1:8003'}/api/v1/weather/${farmId}`, {
      headers: { Authorization: authorization }, timeout: 10000,
    });
    if (!data.success || !data.data) throw new AppError(502, 'Invalid weather service response', 'WEATHER_SERVICE_ERROR');
    return data.data;
  } catch (error) {
    if (error instanceof AppError) throw error;
    if (error.response) throw new AppError(error.response.status, error.response.data?.message || 'Weather service failed', error.response.data?.code || 'WEATHER_SERVICE_ERROR');
    throw new AppError(error.code === 'ECONNABORTED' ? 504 : 503, 'Weather service is unavailable', 'WEATHER_SERVICE_UNAVAILABLE');
  }
};
