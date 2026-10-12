export const success = (res, status, message, data = null, meta) =>
  res.status(status).json({ success: true, message, data, ...(meta ? { meta } : {}) });

export class AppError extends Error {
  constructor(statusCode, message, code = 'REQUEST_FAILED', errors) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
  }
}
