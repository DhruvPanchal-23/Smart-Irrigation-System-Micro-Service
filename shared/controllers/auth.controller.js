import * as auth from '../services/auth.service.js'; import { success } from '../utils/apiResponse.js';
export const registerUser = async (req, res, next) => { try { success(res, 201, 'Registration successful', await auth.register(req.body)); } catch (e) { next(e); } };
export const loginUser = async (req, res, next) => { try { success(res, 200, 'Login successful', await auth.login(req.body)); } catch (e) { next(e); } };
export const getCurrentUser = (req, res) => success(res, 200, 'Current user retrieved', auth.safeUser(req.user));
export const logoutUser = (_req, res) => success(res, 200, 'Logged out successfully');
