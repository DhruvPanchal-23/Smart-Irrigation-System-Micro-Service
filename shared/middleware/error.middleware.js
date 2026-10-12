export const notFound = (req, _res, next) => { const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`); error.statusCode = 404; error.code = 'NOT_FOUND'; next(error); };
export const errorHandler = (err, _req, res, _next) => {
  let status = err.statusCode || 500; let message = status === 500 ? 'An unexpected error occurred' : err.message;
  if (err.name === 'ValidationError') { status = 400; message = Object.values(err.errors).map((e) => e.message).join(', '); }
  if (err.code === 11000) { status = 409; message = 'A record with this value already exists'; }
  res.status(status).json({ success: false, message, code: err.code || 'INTERNAL_ERROR', ...(process.env.NODE_ENV !== 'production' && status === 500 ? { stack: err.stack } : {}) });
};
