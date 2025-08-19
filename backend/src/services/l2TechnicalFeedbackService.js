const db = require('../config/database/db');
const logger = require('../config/logger');

class L2TechnicalFeedbackService {
  constructor() {
    logger.info('L2TechnicalFeedbackService initialized');
  }

  /**
   * Get candidate data by email
   */
  async getCandidateData(candidateEmail) {
    try {
      logger.info('Getting candidate data for email:', candidateEmail);
      
      const query = `
        SELECT id, candidate_name, candidate_email, role, rrf_id, hr_email, panel_name, l_2_interviewdate, l_1_score
        FROM candidate_info
        WHERE candidate_email = $1;
      `;

      const result = await db.query(query, [candidateEmail]);

      if (result.rows.length === 0) {
        logger.warn('Candidate not found for email:', candidateEmail);
        return null;
      }

      logger.info('Candidate data retrieved successfully:', { 
        email: candidateEmail,
        id: result.rows[0].id 
      });

      return result.rows[0];
    } catch (error) {
      logger.error('Database error in getCandidateData:', error);
      throw error;
    }
  }

  /**
   * Get feedback questions for different positions
   */
  async getFeedbackQuestions(position) {
    try {
      logger.info('Getting feedback questions for position:', position);
      
      let tableName;
      if (position.includes('dotnet') || position.includes('.net')) {
        tableName = 'app_dotnet_l2_feedback_questions';
      } else if (position.includes('java')) {
        tableName = 'app_java_l2_feedback_questions';
      } else if (position.includes('react')) {
        tableName = 'app_react_l2_feedback_questions';
      } else if (position.includes('angular')) {
        tableName = 'app_angular_l2_feedback_questions';
      } else if (position.includes('fullstack')) {
        // Handle fullstack positions
        if (position.includes('java_angular')) {
          tableName = 'app_java_angular_fullstack_feedback_questions';
        } else if (position.includes('java_react')) {
          tableName = 'app_java_react_fullstack_feedback_questions';
        } else if (position.includes('dotnet_angular')) {
          tableName = 'app_dotnet_angular_fullstack_feedback_questions';
        } else if (position.includes('dotnet_react')) {
          tableName = 'app_dotnet_react_fullstack_feedback_questions';
        } else {
          tableName = 'app_generic_feedback_questions';
        }
      } else {
        tableName = 'app_generic_feedback_questions';
      }

      const query = `
        SELECT id, skill_category, skill_description, is_core_skill AS is_top_skill, created_at, updated_at
        FROM ${tableName}
        ORDER BY created_at ASC;
      `;
      
      const result = await db.query(query);

      if (result.rows.length === 0) {
        logger.warn('No feedback questions found for position:', position);
        return [];
      }

      logger.info('Feedback questions retrieved successfully:', { 
        position, 
        count: result.rows.length 
      });

      return result.rows;
    } catch (error) {
      logger.error('Error fetching feedback questions:', error);
      throw error;
    }
  }

  /**
   * Submit feedback for a candidate
   */
  async submitFeedback(candidateEmail, responses, detailedFeedback, result, position) {
    const client = await db.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      logger.info('Submitting feedback for candidate:', { candidateEmail, position, result });

      // Fetch candidate info
      const candidateQuery = `
        SELECT id, hr_email, panel_name 
        FROM candidate_info 
        WHERE candidate_email = $1;
      `;
      const candidateResult = await client.query(candidateQuery, [candidateEmail]);

      if (candidateResult.rows.length === 0) {
        throw new Error('Candidate not found');
      }

      const candidateRow = candidateResult.rows[0];
      const candidateId = candidateRow.id;
      const hrEmail = candidateRow.hr_email;
      const panelName = candidateRow.panel_name;

      // Determine table name based on position
      let tableName;
      if (position.includes('dotnet') || position.includes('.net')) {
        tableName = 'app_dotnet_l2_feedback_response';
      } else if (position.includes('java')) {
        tableName = 'app_java_l2_feedback_response';
      } else if (position.includes('react')) {
        tableName = 'app_react_l2_feedback_response';
      } else if (position.includes('angular')) {
        tableName = 'app_angular_l2_feedback_response';
      } else if (position.includes('fullstack')) {
        if (position.includes('java_angular')) {
          tableName = 'app_java_angular_fullstack_feedback_response';
        } else if (position.includes('java_react')) {
          tableName = 'app_java_react_fullstack_feedback_response';
        } else if (position.includes('dotnet_angular')) {
          tableName = 'app_dotnet_angular_fullstack_feedback_response';
        } else if (position.includes('dotnet_react')) {
          tableName = 'app_dotnet_react_fullstack_feedback_response';
        } else {
          tableName = 'app_generic_feedback_response';
        }
      } else {
        tableName = 'app_generic_feedback_response';
      }

      // Save feedback
      const feedbackQuery = `
        INSERT INTO ${tableName} (
          candidate_id, hr_email, candidate_email, interviewer_name, responses, overall_feedback, result, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
        ON CONFLICT (candidate_id)
        DO UPDATE SET
          responses = EXCLUDED.responses,
          overall_feedback = EXCLUDED.overall_feedback,
          result = EXCLUDED.result,
          interviewer_name = EXCLUDED.interviewer_name,
          hr_email = EXCLUDED.hr_email,
          candidate_email = EXCLUDED.candidate_email,
          updated_at = CURRENT_TIMESTAMP;
      `;

      await client.query(feedbackQuery, [
        candidateId,
        hrEmail,
        candidateEmail,
        panelName,
        JSON.stringify(responses),
        detailedFeedback,
        result
      ]);

      // Update recruitment phase based on result
      let recruitmentPhaseL2 = null;
      if (result === "Recommended") {
        recruitmentPhaseL2 = "Shortlisted in L2";
      } else if (result === "Rejected") {
        recruitmentPhaseL2 = "Rejected in L2";
      }

      if (recruitmentPhaseL2) {
        const updatePhaseQuery = `
          UPDATE candidate_info 
          SET recruitment_phase = $1 
          WHERE id = $2;
        `;
        await client.query(updatePhaseQuery, [recruitmentPhaseL2, candidateId]);
      }

      await client.query('COMMIT');

      logger.info('Feedback submitted successfully:', { 
        candidateEmail, 
        position, 
        result,
        recruitmentPhase: recruitmentPhaseL2 
      });

      return { success: true, message: 'Feedback submitted successfully' };
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Error submitting feedback:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get existing feedback for a candidate
   */
  async getExistingFeedback(candidateId, position) {
    try {
      logger.info('Getting existing feedback for candidate:', { candidateId, position });

      let tableName;
      const pos = position.toLowerCase();

      if (pos.includes("dotnet") || pos.includes(".net")) {
        tableName = "app_dotnet_l2_feedback_response";
      } else if (pos.includes("java")) {
        tableName = "app_java_l2_feedback_response";
      } else if (pos.includes("react")) {
        tableName = "app_react_l2_feedback_response";
      } else if (pos.includes("angular")) {
        tableName = "app_angular_l2_feedback_response";
      } else if (pos.includes("fullstack")) {
        if (pos.includes("java_angular")) {
          tableName = "app_java_angular_fullstack_feedback_response";
        } else if (pos.includes("java_react")) {
          tableName = "app_java_react_fullstack_feedback_response";
        } else if (pos.includes("dotnet_angular")) {
          tableName = "app_dotnet_angular_fullstack_feedback_response";
        } else if (pos.includes("dotnet_react")) {
          tableName = "app_dotnet_react_fullstack_feedback_response";
        } else {
          tableName = "app_generic_feedback_response";
        }
      } else {
        tableName = "app_generic_feedback_response";
      }

      const query = `
        SELECT responses, overall_feedback, result
        FROM ${tableName}
        WHERE candidate_id = $1
        ORDER BY updated_at DESC
        LIMIT 1
      `;

      const result = await db.query(query, [candidateId]);

      if (result.rows.length === 0) {
        logger.info('No existing feedback found for candidate:', candidateId);
        return null;
      }

      logger.info('Existing feedback retrieved successfully:', { 
        candidateId, 
        position 
      });

      return result.rows[0];
    } catch (error) {
      logger.error('Error fetching existing feedback:', error);
      throw error;
    }
  }
}

module.exports = L2TechnicalFeedbackService; 