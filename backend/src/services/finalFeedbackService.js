const db = require('../config/database/db');
const logger = require('../config/logger');

class FinalFeedbackService {
  constructor() {
    logger.info('FinalFeedbackService initialized');
  }

  /**
   * Get all shortlisted candidate emails
   */
  async getAllCandidateEmails() {
    try {
      logger.info('Getting all shortlisted candidate emails');
      
      const query = `
        SELECT candidate_email
        FROM candidate_info
        WHERE prescreening_status = 'Shortlisted';
      `;

      const result = await db.query(query);

      if (result.rows.length > 0) {
        const emails = result.rows.map((row) => row.candidate_email);
        logger.info('Shortlisted candidate emails retrieved successfully:', { count: emails.length });
        return emails;
      } else {
        logger.warn('No shortlisted candidates found');
        return [];
      }
    } catch (error) {
      logger.error('Database error in getAllCandidateEmails:', error);
      throw error;
    }
  }

  /**
   * Get comprehensive feedback data for final feedback form
   */
  async getFinalPrescreeningData(candidateEmail, candidateId, position) {
    try {
      logger.info('Getting final prescreening data for:', { candidateEmail, candidateId, position });

      const prescreeningData = {};

      // Get status and hr_email from candidate_info
      const candidateInfoResult = await db.query(`
        SELECT prescreening_status, hr_email
        FROM candidate_info
        WHERE candidate_email = $1
      `, [candidateEmail]);

      if (candidateInfoResult.rows.length > 0) {
        const { prescreening_status, hr_email } = candidateInfoResult.rows[0];
        prescreeningData.prescreening_status = prescreening_status;
        prescreeningData.hr_email = hr_email;
      }

      // Fetch feedback based on position
      let techFeedbackQuery = '';
      if (position.toLowerCase().includes('java')) {
        techFeedbackQuery = `
          SELECT detailed_feedback 
          FROM app_ec_java_feedback_response 
          WHERE candidate_id = $1
        `;
      } else if (position.toLowerCase().includes('.net')) {
        techFeedbackQuery = `
          SELECT detailed_feedback 
          FROM app_ec_dotnet_feedback_response 
          WHERE candidate_id = $1
        `;
      } else if (position.toLowerCase().includes('cloudops')) {
        techFeedbackQuery = `
          SELECT detailed_feedback 
          FROM cloud_ec_cloudops_feedback_response 
          WHERE candidate_id = $1
        `;
      } else if (position.toLowerCase().includes('devops')) {
        techFeedbackQuery = `
          SELECT detailed_feedback 
          FROM cloud_ec_devops_feedback_response 
          WHERE candidate_id = $1
        `;
      } else if (position.toLowerCase().includes('platform')) {
        techFeedbackQuery = `
          SELECT detailed_feedback 
          FROM cloud_ec_platform_feedback_response 
          WHERE candidate_id = $1
        `;
      } else if (position.toLowerCase().includes('site')) {
        techFeedbackQuery = `
          SELECT detailed_feedback 
          FROM cloud_ec_site_feedback_response 
          WHERE candidate_id = $1
        `;
      } else {
        logger.info("Position does not match any known prescreening categories:", position);
      }

      if (techFeedbackQuery) {
        try {
          const techFeedbackResult = await db.query(techFeedbackQuery, [candidateId]);
          if (techFeedbackResult.rows.length > 0) {
            prescreeningData.feedback = techFeedbackResult.rows[0].detailed_feedback;
          }
        } catch (error) {
          logger.error("Error executing tech feedback query:", error);
        }
      }

      // Fetch Fitment feedback
      const feedbackResult = await db.query(`
        SELECT result, detailed_feedback, round_details, interviewer_name
        FROM feedbackform
        WHERE candidate_email = $1
      `, [candidateEmail]);

      // Fetch L2 Technical round
      let l2TechnicalResult = { rows: [] };
      if (position.toLowerCase().includes("java")) {
        l2TechnicalResult = await db.query(`
          SELECT result, overall_feedback, interviewer_name
          FROM app_java_l2_feedback_response
          WHERE candidate_id = $1
        `, [candidateId]);
      } else if (position.toLowerCase().includes(".net")) {
        l2TechnicalResult = await db.query(`
          SELECT result, overall_feedback, interviewer_name
          FROM app_dotnet_l2_feedback_response
          WHERE candidate_id = $1
        `, [candidateId]);
      } else if (position.toLowerCase().includes("cloudops")) {
        l2TechnicalResult = await db.query(`
          SELECT result, overall_feedback, interviewer_name
          FROM cloud_cloudops_l2_feedback_response
          WHERE candidate_id = $1
        `, [candidateId]);
      } else if (position.toLowerCase().includes("devops")) {
        l2TechnicalResult = await db.query(`
          SELECT result, overall_feedback, interviewer_name
          FROM cloud_devops_l2_feedback_response
          WHERE candidate_id = $1
        `, [candidateId]);
      } else if (position.toLowerCase().includes("platform")) {
        l2TechnicalResult = await db.query(`
          SELECT result, overall_feedback, interviewer_name
          FROM cloud_platform_l2_feedback_response
          WHERE candidate_id = $1
        `, [candidateId]);
      } else if (position.toLowerCase().includes("site")) {
        l2TechnicalResult = await db.query(`
          SELECT result, overall_feedback, interviewer_name
          FROM cloud_site_l2_feedback_response
          WHERE candidate_id = $1
        `, [candidateId]);
      } else {
        // Default: use feedback_table for unknown roles
        l2TechnicalResult = await db.query(`
          SELECT result, detailed_feedback, interviewer_name
          FROM feedback_table
          WHERE candidate_email = $1
        `, [candidateEmail]);
      }

      if (
        Object.keys(prescreeningData).length === 0 &&
        !feedbackResult.rows.length &&
        !l2TechnicalResult.rows.length
      ) {
        logger.warn('No data found for candidate:', { candidateEmail, candidateId, position });
        return null;
      }

      const response = {
        prescreening: prescreeningData,
        feedback: feedbackResult.rows || [],
        l2Technical: l2TechnicalResult.rows[0] || {}
      };

      logger.info('Final prescreening data retrieved successfully:', { candidateEmail, candidateId, position });
      return response;
    } catch (error) {
      logger.error('Error fetching final prescreening data:', error);
      throw error;
    }
  }
}

module.exports = FinalFeedbackService; 