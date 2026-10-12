const safeErrorDetails = (error) => ({
  name: error?.name || 'Error',
  code: error?.code,
});

export const logError = (message, error, context = {}) => {
  console.error(message, { ...context, error: safeErrorDetails(error) });
};
