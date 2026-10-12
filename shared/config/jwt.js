import jwt from 'jsonwebtoken';
const secret = () => { if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is required'); return process.env.JWT_SECRET; };
export const signToken = (user) => jwt.sign({ sub: user.id, role: user.role }, secret(), { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
export const verifyToken = (token) => jwt.verify(token, secret());
