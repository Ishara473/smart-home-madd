/**
 * Centralized error handler utility for application-wide logging and formatting.
 */
export const handleError = (error, customMessage = '') => {
  const formattedError = {
    message: customMessage || error?.message || 'An unexpected error occurred.',
    originalError: error,
    timestamp: new Date().toISOString(),
  };

  if (__DEV__) {
    console.error('[App Error Handler]:', formattedError.message, error);
  }

  return formattedError;
};

export default {
  handleError,
};
