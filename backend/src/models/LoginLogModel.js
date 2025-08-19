/**
 * Login Log Model
 * 
 * Model for handling login log data operations
 * Provides methods for creating and querying login logs
 */

const db = require('../config/database/db');
const logger = require('../config/logger');

class LoginLogModel {
  constructor() {
    this.tableName = 'login_logs';
  }

  /**
   * Create a new login log entry
   * 
   * @param {Object} loginData - Login data
   * @param {string} loginData.email - User email
   * @param {string} loginData.name - User name
   * @param {string} loginData.date - Login date (YYYY-MM-DD)
   * @param {string} loginData.time - Login time (HH:MM:SS)
   * @returns {Promise<Object>} Created login log with ID
   */
  async create(loginData) {
    try {
      const { email, name, date, time } = loginData;
      
      const query = `
        INSERT INTO ${this.tableName} (email, name, login_date, login_time)
        VALUES ($1, $2, $3, $4)
        RETURNING id, email, name, login_date, login_time, created_at
      `;
      
      const values = [email, name, date, time];
      const result = await db.query(query, values);
      
      logger.info('Login log created successfully', { 
        id: result.rows[0].id, 
        email: email 
      });
      
      return result.rows[0];
    } catch (error) {
      logger.error('Error creating login log:', error);
      throw error;
    }
  }

  /**
   * Get login logs by email
   * 
   * @param {string} email - User email
   * @param {number} limit - Number of records to return (default: 10)
   * @returns {Promise<Array>} Array of login logs
   */
  async getByEmail(email, limit = 10) {
    try {
      const query = `
        SELECT id, email, name, login_date, login_time, created_at
        FROM ${this.tableName}
        WHERE email = $1
        ORDER BY created_at DESC
        LIMIT $2
      `;
      
      const values = [email, limit];
      const result = await db.query(query, values);
      
      return result.rows;
    } catch (error) {
      logger.error('Error getting login logs by email:', error);
      throw error;
    }
  }

  /**
   * Get login log by ID
   * 
   * @param {number} id - Login log ID
   * @returns {Promise<Object|null>} Login log data or null if not found
   */
  async getById(id) {
    try {
      const query = `
        SELECT id, email, name, login_date, login_time, created_at
        FROM ${this.tableName}
        WHERE id = $1
      `;
      
      const values = [id];
      const result = await db.query(query, values);
      
      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error getting login log by ID:', error);
      throw error;
    }
  }

  /**
   * Get recent login logs
   * 
   * @param {number} limit - Number of records to return (default: 50)
   * @returns {Promise<Array>} Array of recent login logs
   */
  async getRecent(limit = 50) {
    try {
      const query = `
        SELECT id, email, name, login_date, login_time, created_at
        FROM ${this.tableName}
        ORDER BY created_at DESC
        LIMIT $1
      `;
      
      const values = [limit];
      const result = await db.query(query, values);
      
      return result.rows;
    } catch (error) {
      logger.error('Error getting recent login logs:', error);
      throw error;
    }
  }

  /**
   * Get login logs by date range
   * 
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise<Array>} Array of login logs in date range
   */
  async getByDateRange(startDate, endDate) {
    try {
      const query = `
        SELECT id, email, name, login_date, login_time, created_at
        FROM ${this.tableName}
        WHERE login_date BETWEEN $1 AND $2
        ORDER BY login_date DESC, login_time DESC
      `;
      
      const values = [startDate, endDate];
      const result = await db.query(query, values);
      
      return result.rows;
    } catch (error) {
      logger.error('Error getting login logs by date range:', error);
      throw error;
    }
  }

  /**
   * Get login statistics
   * 
   * @returns {Promise<Object>} Login statistics
   */
  async getStats() {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_logins,
          COUNT(DISTINCT email) as unique_users,
          DATE(created_at) as login_date,
          COUNT(*) as daily_logins
        FROM ${this.tableName}
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(created_at)
        ORDER BY login_date DESC
      `;
      
      const result = await db.query(query);
      
      const totalQuery = `
        SELECT 
          COUNT(*) as total_logins,
          COUNT(DISTINCT email) as unique_users
        FROM ${this.tableName}
      `;
      
      const totalResult = await db.query(totalQuery);
      
      return {
        overview: totalResult.rows[0],
        daily: result.rows
      };
    } catch (error) {
      logger.error('Error getting login statistics:', error);
      throw error;
    }
  }
}

module.exports = new LoginLogModel(); 