/**
 * Dashboard Controller
 * Handles dashboard statistics and metrics
 */

const logger = require('../config/logger');
const db = require('../config/database/db');

class DashboardController {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats(req, res) {
    try {
      // Get candidate statistics
      const candidateStatsQuery = `
        SELECT 
          COUNT(*) as total_candidates,
          COUNT(CASE WHEN prescreening_status = 'Passed' THEN 1 END) as passed_prescreening,
          COUNT(CASE WHEN prescreening_status = 'Failed' THEN 1 END) as failed_prescreening,
          COUNT(CASE WHEN prescreening_status = 'Pending' THEN 1 END) as pending_prescreening,
          COUNT(CASE WHEN offer_status = 'Offered' THEN 1 END) as offered,
          COUNT(CASE WHEN offer_status = 'Rejected' THEN 1 END) as rejected,
          COUNT(CASE WHEN recruitment_phase = 'L1' THEN 1 END) as l1_candidates,
          COUNT(CASE WHEN recruitment_phase = 'L2' THEN 1 END) as l2_candidates,
          COUNT(CASE WHEN recruitment_phase = 'Final' THEN 1 END) as final_candidates
        FROM candidate_info 
        WHERE visible = true
      `;

      const candidateResult = await db.query(candidateStatsQuery);

      // Get HR statistics
      const hrStatsQuery = `
        SELECT COUNT(*) as total_hr
        FROM hr_info
      `;

      const hrResult = await db.query(hrStatsQuery);

      // Get admin statistics
      const adminStatsQuery = `
        SELECT COUNT(*) as total_admins
        FROM admin_table
        WHERE status = 'Enable'
      `;

      const adminResult = await db.query(adminStatsQuery);

      // Get panel statistics
      const panelStatsQuery = `
        SELECT COUNT(*) as total_panels
        FROM panel_details
        WHERE status = 'Active'
      `;

      const panelResult = await db.query(panelStatsQuery);

      // Get recent activities (last 7 days)
      const recentActivitiesQuery = `
        SELECT 
          candidate_name,
          prescreening_status,
          recruitment_phase,
          created_at
        FROM candidate_info 
        WHERE visible = true 
        AND created_at >= CURRENT_DATE - INTERVAL '7 days'
        ORDER BY created_at DESC
        LIMIT 10
      `;

      const activitiesResult = await db.query(recentActivitiesQuery);

      // Get skill distribution
      const skillDistributionQuery = `
        SELECT 
          primary_skill,
          COUNT(*) as count
        FROM candidate_info 
        WHERE visible = true AND primary_skill IS NOT NULL
        GROUP BY primary_skill
        ORDER BY count DESC
        LIMIT 10
      `;

      const skillResult = await db.query(skillDistributionQuery);

      // Get phase distribution
      const phaseDistributionQuery = `
        SELECT 
          recruitment_phase,
          COUNT(*) as count
        FROM candidate_info 
        WHERE visible = true AND recruitment_phase IS NOT NULL
        GROUP BY recruitment_phase
        ORDER BY count DESC
      `;

      const phaseResult = await db.query(phaseDistributionQuery);

      const dashboardStats = {
        candidates: candidateResult.rows[0],
        hr: hrResult.rows[0],
        admins: adminResult.rows[0],
        panels: panelResult.rows[0],
        recentActivities: activitiesResult.rows,
        skillDistribution: skillResult.rows,
        phaseDistribution: phaseResult.rows
      };

      logger.info('Retrieved dashboard statistics');

      res.json({
        success: true,
        stats: dashboardStats
      });

    } catch (error) {
      logger.error('Error getting dashboard stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get dashboard statistics'
      });
    }
  }

  /**
   * Get chart data for dashboard
   */
  async getChartData(req, res) {
    try {
      const { chartType, period = '30' } = req.query;

      let dateFilter = '';
      if (period === '7') {
        dateFilter = "AND created_at >= CURRENT_DATE - INTERVAL '7 days'";
      } else if (period === '30') {
        dateFilter = "AND created_at >= CURRENT_DATE - INTERVAL '30 days'";
      } else if (period === '90') {
        dateFilter = "AND created_at >= CURRENT_DATE - INTERVAL '90 days'";
      }

      let query = '';
      let result;

      switch (chartType) {
        case 'candidates_by_date':
          query = `
            SELECT 
              DATE(created_at) as date,
              COUNT(*) as count
            FROM candidate_info 
            WHERE visible = true ${dateFilter}
            GROUP BY DATE(created_at)
            ORDER BY date
          `;
          break;

        case 'status_distribution':
          query = `
            SELECT 
              prescreening_status as status,
              COUNT(*) as count
            FROM candidate_info 
            WHERE visible = true ${dateFilter}
            GROUP BY prescreening_status
          `;
          break;

        case 'phase_distribution':
          query = `
            SELECT 
              recruitment_phase as phase,
              COUNT(*) as count
            FROM candidate_info 
            WHERE visible = true ${dateFilter}
            GROUP BY recruitment_phase
          `;
          break;

        case 'skill_distribution':
          query = `
            SELECT 
              primary_skill as skill,
              COUNT(*) as count
            FROM candidate_info 
            WHERE visible = true AND primary_skill IS NOT NULL ${dateFilter}
            GROUP BY primary_skill
            ORDER BY count DESC
            LIMIT 10
          `;
          break;

        default:
          return res.status(400).json({
            success: false,
            error: 'Invalid chart type'
          });
      }

      result = await db.query(query);

      logger.info('Retrieved chart data:', { chartType, period });

      res.json({
        success: true,
        data: result.rows
      });

    } catch (error) {
      logger.error('Error getting chart data:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get chart data'
      });
    }
  }

  /**
   * Get recent activities
   */
  async getRecentActivities(req, res) {
    try {
      const { limit = 20 } = req.query;

      const query = `
        SELECT 
          id,
          candidate_name,
          candidate_email,
          prescreening_status,
          recruitment_phase,
          offer_status,
          created_at,
          updated_at
        FROM candidate_info 
        WHERE visible = true
        ORDER BY updated_at DESC
        LIMIT $1
      `;

      const result = await db.query(query, [limit]);

      logger.info('Retrieved recent activities:', { count: result.rows.length });

      res.json({
        success: true,
        activities: result.rows
      });

    } catch (error) {
      logger.error('Error getting recent activities:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get recent activities'
      });
    }
  }

  /**
   * Get quick stats
   */
  async getQuickStats(req, res) {
    try {
      // Today's new candidates
      const todayQuery = `
        SELECT COUNT(*) as today_candidates
        FROM candidate_info 
        WHERE visible = true 
        AND DATE(created_at) = CURRENT_DATE
      `;

      // This week's new candidates
      const weekQuery = `
        SELECT COUNT(*) as week_candidates
        FROM candidate_info 
        WHERE visible = true 
        AND created_at >= CURRENT_DATE - INTERVAL '7 days'
      `;

      // This month's new candidates
      const monthQuery = `
        SELECT COUNT(*) as month_candidates
        FROM candidate_info 
        WHERE visible = true 
        AND created_at >= CURRENT_DATE - INTERVAL '30 days'
      `;

      // Pending actions
      const pendingQuery = `
        SELECT COUNT(*) as pending_actions
        FROM candidate_info 
        WHERE visible = true 
        AND (prescreening_status = 'Pending' OR recruitment_phase = 'L1')
      `;

      const [todayResult, weekResult, monthResult, pendingResult] = await Promise.all([
        db.query(todayQuery),
        db.query(weekQuery),
        db.query(monthQuery),
        db.query(pendingQuery)
      ]);

      const quickStats = {
        today: todayResult.rows[0].today_candidates,
        week: weekResult.rows[0].week_candidates,
        month: monthResult.rows[0].month_candidates,
        pending: pendingResult.rows[0].pending_actions
      };

      logger.info('Retrieved quick stats');

      res.json({
        success: true,
        stats: quickStats
      });

    } catch (error) {
      logger.error('Error getting quick stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get quick stats'
      });
    }
  }
}

module.exports = new DashboardController(); 