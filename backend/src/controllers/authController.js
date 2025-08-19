/**
 * Authentication Controller
 * Handles login logging and admin access verification
 */

const logger = require('../config/logger');
const db = require('../config/database/db');

class AuthController {
  /**
   * Log login details to database
   */
  async logLogin(req, res) {
    try {
      const { email, name, date, time } = req.body;

      // Validate required fields
      if (!email || !name) {
        return res.status(400).json({
          success: false,
          error: 'Email and name are required'
        });
      }

      logger.info('User login attempt:', { 
        email, 
        name, 
        date, 
        time,
        timestamp: new Date().toISOString(),
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      // Insert login details into database using direct query
      const insertQuery = `
        INSERT INTO login_logs (email, name, date, time, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING id
      `;
      const loginLog = await db.query(insertQuery, [email, name, date, time]);
      
      logger.info('Login logged to database:', { loginId: loginLog.rows[0].id, email });
      
      return res.json({
        success: true,
        id: loginLog.id,
        message: 'Login details logged successfully'
      });

    } catch (error) {
      logger.error('Error logging login details:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to log login details'
      });
    }
  }

  /**
   * Check admin access for user
   */
  async checkAdmin(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          error: 'Email is required'
        });
      }

      logger.info('Checking admin access for:', email);

      // Check if user exists in admin_table
      const adminQuery = `
        SELECT vamid, name, ec_mapping, status
        FROM admin_table 
        WHERE email = $1 AND status = 'Enable'
      `;

      const adminResult = await db.query(adminQuery, [email]);

      if (adminResult.rows.length > 0) {
        const admin = adminResult.rows[0];
        
        logger.info('Admin access granted:', { email, vamid: admin.vamid });
        
        return res.json({
          success: true,
          isAdmin: true,
          ec_mapping: admin.ec_mapping,
          name: admin.name,
          vamid: admin.vamid
        });
      }

      // Check if user exists in hr_info
      const hrQuery = `
        SELECT hr_id, hr_name, assigned_ec
        FROM hr_info 
        WHERE hr_email = $1
      `;

      const hrResult = await db.query(hrQuery, [email]);

      if (hrResult.rows.length > 0) {
        const hr = hrResult.rows[0];
        
        logger.info('HR access granted:', { email, hr_id: hr.hr_id });
        
        return res.json({
          success: true,
          isHR: true,
          ec_mapping: hr.assigned_ec,
          name: hr.hr_name,
          hr_id: hr.hr_id
        });
      }

      // Check if user exists in panel_details
      const panelQuery = `
        SELECT id, name, status, ec_account
        FROM panel_details 
        WHERE email = $1 AND status = 'Active'
      `;

      const panelResult = await db.query(panelQuery, [email]);

      if (panelResult.rows.length > 0) {
        const panel = panelResult.rows[0];
        
        logger.info('Panel access granted:', { email, panel_id: panel.id });
        
        return res.json({
          success: true,
          isPanel: true,
          ec_mapping: panel.ec_account,
          name: panel.name,
          panel_id: panel.id
        });
      }

      // User not found in any authorized tables
      logger.warn('Access denied for:', email);
      
      return res.status(403).json({
        success: false,
        error: 'Access denied. User not authorized.'
      });

    } catch (error) {
      logger.error('Error checking admin access:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to check admin access'
      });
    }
  }

  /**
   * Get user profile information
   */
  async getUserProfile(req, res) {
    try {
      const { email } = req.params;

      if (!email) {
        return res.status(400).json({
          success: false,
          error: 'Email is required'
        });
      }

      logger.info('Getting user profile for:', email);

      // Check admin table
      const adminQuery = `
        SELECT vamid as id, name, email, ec_mapping, status, 'admin' as role
        FROM admin_table 
        WHERE email = $1
      `;

      const adminResult = await db.query(adminQuery, [email]);

      if (adminResult.rows.length > 0) {
        return res.json({
          success: true,
          user: adminResult.rows[0]
        });
      }

      // Check HR table
      const hrQuery = `
        SELECT hr_id as id, hr_name as name, hr_email as email, assigned_ec as ec_mapping, 'hr' as role
        FROM hr_info 
        WHERE hr_email = $1
      `;

      const hrResult = await db.query(hrQuery, [email]);

      if (hrResult.rows.length > 0) {
        return res.json({
          success: true,
          user: hrResult.rows[0]
        });
      }

      // Check panel table
      const panelQuery = `
        SELECT id, name, email, ec_account as ec_mapping, status, 'panel' as role
        FROM panel_details 
        WHERE email = $1
      `;

      const panelResult = await db.query(panelQuery, [email]);

      if (panelResult.rows.length > 0) {
        return res.json({
          success: true,
          user: panelResult.rows[0]
        });
      }

      return res.status(404).json({
        success: false,
        error: 'User not found'
      });

    } catch (error) {
      logger.error('Error getting user profile:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to get user profile'
      });
    }
  }

  /**
   * Handle admin login
   */
  async adminLogin(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          error: 'Username and password are required'
        });
      }

      // Simple admin credentials check
      if (username === 'admin' && password === 'admin') {
        logger.info('Admin login successful:', { username, ip: req.ip });
        
        return res.json({
          success: true,
          message: 'Admin login successful',
          redirectUrl: '/admin'
        });
      } else {
        logger.warn('Admin login failed:', { username, ip: req.ip });
        
        return res.status(401).json({
          success: false,
          error: 'Invalid username or password'
        });
      }

    } catch (error) {
      logger.error('Error in admin login:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to process admin login'
      });
    }
  }
}

module.exports = new AuthController(); 