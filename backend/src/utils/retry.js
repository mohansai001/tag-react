const config = require('../config/config');
const logger = require('../config/logger');

/**
 * Retry mechanism with exponential backoff
 * @param {Function} operation - The operation to retry
 * @param {Object} options - Retry options
 * @param {number} options.maxAttempts - Maximum number of attempts
 * @param {number} options.delay - Initial delay in milliseconds
 * @param {number} options.backoffMultiplier - Backoff multiplier
 * @param {Function} options.shouldRetry - Function to determine if error should be retried
 * @returns {Promise} - Promise that resolves with operation result
 */
const retry = async (operation, options = {}) => {
  const {
    maxAttempts = config.retry.attempts,
    delay = config.retry.delay,
    backoffMultiplier = config.retry.backoffMultiplier,
    shouldRetry = (error) => {
      // Retry on network errors, timeouts, and connection issues
      return error.code === 'ECONNRESET' ||
             error.code === 'ETIMEDOUT' ||
             error.code === 'ENOTFOUND' ||
             error.message.includes('timeout') ||
             error.message.includes('connection') ||
             error.message.includes('network');
    }
  } = options;

  let lastError;
  let currentDelay = delay;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Don't retry if it's the last attempt or if error shouldn't be retried
      if (attempt === maxAttempts || !shouldRetry(error)) {
        throw error;
      }

      logger.warn(`Operation failed (attempt ${attempt}/${maxAttempts}):`, {
        error: error.message,
        code: error.code,
        attempt,
        nextRetryIn: currentDelay,
      });

      // Wait before next attempt
      await new Promise(resolve => setTimeout(resolve, currentDelay));
      
      // Exponential backoff
      currentDelay *= backoffMultiplier;
    }
  }

  throw lastError;
};

/**
 * Retry wrapper for database operations
 * @param {Function} dbOperation - Database operation to retry
 * @returns {Promise} - Promise that resolves with operation result
 */
const retryDatabaseOperation = async (dbOperation) => {
  return retry(dbOperation, {
    maxAttempts: config.retry.attempts,
    delay: config.retry.delay,
    backoffMultiplier: config.retry.backoffMultiplier,
    shouldRetry: (error) => {
      // Retry on database connection issues
      return error.code === 'ECONNRESET' ||
             error.code === 'ETIMEDOUT' ||
             error.code === 'ENOTFOUND' ||
             error.message.includes('timeout') ||
             error.message.includes('connection') ||
             error.message.includes('network') ||
             error.name === 'SequelizeConnectionError' ||
             error.name === 'SequelizeHostNotFoundError' ||
             error.name === 'SequelizeHostNotReachableError' ||
             error.name === 'SequelizeInvalidConnectionError' ||
             error.name === 'SequelizeConnectionTimedOutError';
    }
  });
};

/**
 * Retry wrapper for API calls
 * @param {Function} apiCall - API call to retry
 * @returns {Promise} - Promise that resolves with API response
 */
const retryApiCall = async (apiCall) => {
  return retry(apiCall, {
    maxAttempts: config.retry.attempts,
    delay: config.retry.delay,
    backoffMultiplier: config.retry.backoffMultiplier,
    shouldRetry: (error) => {
      // Retry on network errors and 5xx server errors
      return error.code === 'ECONNRESET' ||
             error.code === 'ETIMEDOUT' ||
             error.code === 'ENOTFOUND' ||
             error.message.includes('timeout') ||
             error.message.includes('connection') ||
             error.message.includes('network') ||
             (error.response && error.response.status >= 500);
    }
  });
};

module.exports = {
  retry,
  retryDatabaseOperation,
  retryApiCall,
}; 