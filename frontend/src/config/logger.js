// Simple logger utility for frontend
// Usage: import logger from '../utils/logger'; logger.log('message');

/**
 * Logger object for consistent logging across the frontend.
 * @type {{log: Function, error: Function, debug: Function}}
 */
const logger = {
  /**
   * Log a standard message.
   * @param {string} message - The message to log.
   * @param {...any} args - Additional arguments.
   */
  log: (message, ...args) => {
    console.log(`[LOG] ${new Date().toISOString()}:`, message, ...args);
  },
  /**
   * Log an error message.
   * @param {string} message - The error message.
   * @param {...any} args - Additional arguments.
   */
  error: (message, ...args) => {
    console.error(`[ERROR] ${new Date().toISOString()}:`, message, ...args);
  },
  /**
   * Log a debug message (only in dev environment).
   * @param {string} message - The debug message.
   * @param {...any} args - Additional arguments.
   */
  debug: (message, ...args) => {
    if (process.env.REACT_APP_ENV === 'dev') {
      console.debug(`[DEBUG] ${new Date().toISOString()}:`, message, ...args);
    }
  },
};

export default logger;
