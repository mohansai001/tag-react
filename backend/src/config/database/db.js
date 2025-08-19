const { Pool } = require('pg');
const config = require('../config');
const logger = require('../logger');

// Create a single pool instance
const pool = new Pool({
  connectionString: config.database.url,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Test connection on startup
pool.on('connect', () => {
  logger.info('Database client connected');
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
});

// Simple query function
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    logger.info('Executed query', { 
      text: text.substring(0, 50) + '...', 
      duration: `${duration}ms`,
      rowCount: result.rowCount 
    });
    
    return result;
  } catch (error) {
    logger.error('Database query error:', error);
    throw error;
  }
};

// Check if connected
const isConnected = async () => {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    return true;
  } catch (error) {
    return false;
  }
};

// Close pool
const close = async () => {
  await pool.end();
  logger.info('Database pool closed');
};

module.exports = {
  query,
  isConnected,
  close,
  pool
}; 