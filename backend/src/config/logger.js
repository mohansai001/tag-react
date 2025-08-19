const pino = require('pino');
const config = require('./config');

// Create Pino logger with JSON formatting
const logger = pino({
  level: config.logging.level || 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
});

// Add custom methods for different log levels
logger.info = logger.info.bind(logger);
logger.error = logger.error.bind(logger);
logger.warn = logger.warn.bind(logger);
logger.debug = logger.debug.bind(logger);

// Add a method for logging HTTP requests
logger.http = (req, res, responseTime) => {
  logger.info({
    type: 'http',
    method: req.method,
    url: req.url,
    status: res.statusCode,
    responseTime: `${responseTime}ms`,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
  });
};

// Add a method for logging database operations
logger.db = (operation, table, duration, rowCount) => {
  logger.info({
    type: 'database',
    operation,
    table,
    duration: `${duration}ms`,
    rowCount,
  });
};

// Add a method for logging authentication events
logger.auth = (event, userId, success, details = {}) => {
  logger.info({
    type: 'authentication',
    event,
    userId,
    success,
    ...details,
  });
};

// Add a method for logging security events
logger.security = (event, details = {}) => {
  logger.warn({
    type: 'security',
    event,
    ...details,
  });
};

// Add a method for logging performance metrics
logger.performance = (metric, value, unit = 'ms') => {
  logger.info({
    type: 'performance',
    metric,
    value,
    unit,
  });
};

module.exports = logger; 