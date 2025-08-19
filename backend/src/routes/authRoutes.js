/**
 * Authentication Routes
 * API endpoints for authentication and user management
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const logger = require('../config/logger');
const { 
  validate, 
  sanitize, 
  validateLoginDetails, 
  validateAdminLogin, 
  validateCheckAdmin, 
  validateUserProfile 
} = require('../middleware/validation');

// Middleware to log all auth requests
router.use((req, res, next) => {
  logger.info(`Auth API Request: ${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});

/**
 * POST /api/log-login
 * Log user login details to database
 */
router.post('/log-login', sanitize, validateLoginDetails, validate, async (req, res) => {
  try {
    await authController.logLogin(req, res);
  } catch (error) {
    logger.error('Error in log-login route:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * POST /api/check-admin
 * Check if user has admin access
 */
router.post('/check-admin', sanitize, validateCheckAdmin, validate, async (req, res) => {
  try {
    await authController.checkAdmin(req, res);
  } catch (error) {
    logger.error('Error in check-admin route:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /api/user-profile/:email
 * Get user profile information
 */
router.get('/user-profile/:email', validateUserProfile, validate, async (req, res) => {
  try {
    await authController.getUserProfile(req, res);
  } catch (error) {
    logger.error('Error in user-profile route:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * POST /api/admin-login
 * Handle admin login
 */
router.post('/admin-login', sanitize, validateAdminLogin, validate, async (req, res) => {
  try {
    await authController.adminLogin(req, res);
  } catch (error) {
    logger.error('Error in admin-login route:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /api/auth/status
 * Check authentication status
 */
router.get('/status', (req, res) => {
  res.json({
    success: true,
    message: 'Authentication service is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 