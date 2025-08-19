const db = require('../config/database/db');
const logger = require('../config/logger');

class PrescreeningService {
  /**
   * Get all candidate emails (shortlisted candidates)
   */
  async getAllCandidateEmails() {
    try {
      const query = `
        SELECT candidate_email
        FROM candidate_info
        WHERE prescreening_status = 'Shortlisted';
      `;

      const result = await db.query(query);

      if (result.rows.length === 0) {
        return [];
      }

      return result.rows.map(row => row.candidate_email);
    } catch (error) {
      logger.error('Database error in getAllCandidateEmails:', error);
      throw error;
    }
  }

  /**
   * Get candidate data by email
   */
  async getCandidateData(candidateEmail) {
    try {
      const query = `
        SELECT id, candidate_name, candidate_email, role, rrf_id, hr_email, panel_name, l_2_interviewdate, l_1_score
        FROM candidate_info
        WHERE candidate_email = $1;
      `;

      const result = await db.query(query, [candidateEmail]);

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      logger.error('Database error in getCandidateData:', error);
      throw error;
    }
  }

  /**
   * Get questions from a specific questionnaire table
   */
  async getQuestions(tableName) {
    try {
      const query = `
        SELECT id, question_text, mandatory_for_candidates, created_at, updated_at
        FROM ${tableName}
        ORDER BY created_at ASC;
      `;

      const result = await db.query(query);

      if (result.rows.length === 0) {
        return [];
      }

      return result.rows;
    } catch (error) {
      logger.error(`Database error in getQuestions for table ${tableName}:`, error);
      throw error;
    }
  }

  /**
   * Submit feedback to a specific feedback response table
   */
  async submitFeedback(feedbackData, tableName) {
    const {
      candidateEmail,
      number_of_years_or_months,
      detailed_feedback,
      introduction_to_valuemomentum = {},
      introduction_of_cloud_app_engineering = {},
      introduction_to_roles_responsibilities = {},
      did_candidate_qualify_using_pre_screening_qs = {},
      current_ctc = '',
      expected_ctc = '',
      notice_period = '',
      offer_in_hand = {},
      status = ''
    } = feedbackData;

    if (!candidateEmail || !Array.isArray(number_of_years_or_months)) {
      throw new Error('Invalid request payload. candidateEmail and number_of_years_or_months (array) are required.');
    }

    const client = await db.pool.connect();
    try {
      // Get candidate ID
      const candidateQuery = `SELECT id FROM candidate_info WHERE candidate_email = $1;`;
      const candidateResult = await client.query(candidateQuery, [candidateEmail]);

      if (candidateResult.rows.length === 0) {
        throw new Error('Candidate not found.');
      }

      const candidateId = candidateResult.rows[0].id;
      logger.info('Fetched candidateId:', candidateId);
      
      // Verify candidate exists and log details
      logger.info('Candidate details:', {
        id: candidateId,
        email: candidateEmail,
        exists: candidateResult.rows.length > 0
      });

      // Check if the feedback table exists
      const tableExistsQuery = `
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = $1
        );
      `;
      const tableExistsResult = await client.query(tableExistsQuery, [tableName]);
      
      if (!tableExistsResult.rows[0].exists) {
        throw new Error(`Feedback table '${tableName}' does not exist`);
      }
      
      logger.info(`Table ${tableName} exists, proceeding with insert`);

      await client.query('BEGIN');

      // Check table structure and insert accordingly
      const tableStructureQuery = `
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = $1 
        ORDER BY ordinal_position;
      `;
      const structureResult = await client.query(tableStructureQuery, [tableName]);
      const columns = structureResult.rows.map(row => row.column_name);
      
      logger.info(`Table ${tableName} columns:`, columns);

      // Build dynamic INSERT query based on available columns
      let insertQuery;
      let insertValues;

      if (columns.includes('status')) {
        // Full structure with all columns
        insertQuery = `
          INSERT INTO ${tableName} (
            candidate_id,
            number_of_years_or_months,
            detailed_feedback,
            introduction_to_valuemomentum,
            introduction_of_cloud_app_engineering,
            introduction_to_roles_responsibilities,
            did_candidate_qualify_using_pre_screening_qs,
            current_ctc,
            expected_ctc,
            notice_period,
            offer_in_hand,
            status,
            updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP);
        `;
        insertValues = [
          candidateId,
          JSON.stringify(number_of_years_or_months),
          detailed_feedback,
          JSON.stringify(introduction_to_valuemomentum),
          JSON.stringify(introduction_of_cloud_app_engineering),
          JSON.stringify(introduction_to_roles_responsibilities),
          JSON.stringify(did_candidate_qualify_using_pre_screening_qs),
          current_ctc || '',
          expected_ctc || '',
          notice_period || '',
          JSON.stringify(offer_in_hand),
          status || ''
        ];
      } else {
        // Basic structure without status column
        insertQuery = `
          INSERT INTO ${tableName} (
            candidate_id,
            number_of_years_or_months,
            detailed_feedback,
            updated_at
          )
          VALUES ($1, $2, $3, CURRENT_TIMESTAMP);
        `;
        insertValues = [
          candidateId,
          JSON.stringify(number_of_years_or_months),
          detailed_feedback
        ];
      }

      logger.info('Attempting to insert feedback with data:', {
        candidateId,
        tableName,
        dataLength: number_of_years_or_months?.length || 0,
        queryType: columns.includes('status') ? 'full' : 'basic'
      });

      await client.query(insertQuery, insertValues);

      await client.query('COMMIT');
      logger.info('Feedback inserted successfully for candidateId:', candidateId);
      
      return { success: true };
    } catch (error) {
      try {
        await client.query('ROLLBACK');
        logger.info('Transaction rolled back successfully');
      } catch (rollbackError) {
        logger.error('Error during transaction rollback:', rollbackError.message);
      }
      logger.error('Error submitting feedback:', {
        message: error.message,
        code: error.code,
        detail: error.detail,
        hint: error.hint,
        stack: error.stack
      });
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get feedback by candidate ID
   */
  async getFeedbackByCandidateId(candidateId, tableName) {
    try {
      const query = `
        SELECT *
        FROM ${tableName}
        WHERE candidate_id = $1
        ORDER BY created_at DESC
        LIMIT 1;
      `;

      const result = await db.query(query, [candidateId]);

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      logger.error(`Database error in getFeedbackByCandidateId for table ${tableName}:`, error);
      throw error;
    }
  }

  /**
   * Update candidate status after feedback submission
   */
  async updateCandidateStatus(candidateEmail, status) {
    try {
      const query = `
        UPDATE candidate_info
        SET recruitment_phase = $1, updated_at = CURRENT_TIMESTAMP
        WHERE candidate_email = $2;
      `;

      const result = await db.query(query, [status, candidateEmail]);

      logger.info('Candidate status updated successfully');
      return result.rowCount > 0;
    } catch (error) {
      logger.error('Database error in updateCandidateStatus:', error);
      throw error;
    }
  }

  /**
   * Get fullstack questions from a specific questionnaire table
   */
  async getFullstackQuestions(tableName) {
    try {
      const query = `
        SELECT id, skill_category, skill_description, is_core_skill AS is_top_skill, created_at, updated_at
        FROM ${tableName}
        ORDER BY created_at ASC;
      `;

      const result = await db.query(query);

      if (result.rows.length === 0) {
        return [];
      }

      return result.rows;
    } catch (error) {
      logger.error(`Database error in getFullstackQuestions for table ${tableName}:`, error);
      throw error;
    }
  }

  /**
   * Submit fullstack feedback to a specific feedback response table
   */
  async submitFullstackFeedback(feedbackData, tableName) {
    const { candidateEmail, responses, detailedFeedback, result } = feedbackData;

    if (!candidateEmail || !responses || !Array.isArray(responses)) {
      throw new Error('Invalid request payload. candidateEmail and responses (array) are required.');
    }

    const client = await db.pool.connect();
    try {
      // Get candidate data
      const candidateQuery = `SELECT id, panel_name, hr_email FROM candidate_info WHERE candidate_email = $1;`;
      const candidateResult = await client.query(candidateQuery, [candidateEmail]);

      if (candidateResult.rows.length === 0) {
        throw new Error('Candidate not found.');
      }

      const { id: candidateId, panel_name: panelName, hr_email: hrEmail } = candidateResult.rows[0];

      // Check if the feedback table exists
      const tableExistsQuery = `
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = $1
        );
      `;
      const tableExistsResult = await client.query(tableExistsQuery, [tableName]);
      
      if (!tableExistsResult.rows[0].exists) {
        throw new Error(`Fullstack feedback table '${tableName}' does not exist`);
      }
      
      logger.info(`Table ${tableName} exists, proceeding with fullstack insert`);

      await client.query('BEGIN');

      // Insert feedback with upsert logic
      const insertQuery = `
        INSERT INTO ${tableName} (
          candidate_id, candidate_email, hr_email, interviewer_name, responses, overall_feedback, result, updated_at
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

      await client.query(insertQuery, [
        candidateId,
        candidateEmail,
        hrEmail,
        panelName,
        JSON.stringify(responses),
        detailedFeedback,
        result,
      ]);

      // Update candidate status based on result
      let recruitmentPhaseL2 = result === "Recommended" ? "Shortlisted in L2"
                            : result === "Rejected" ? "Rejected in L2" : null;

      if (recruitmentPhaseL2) {
        const updateQuery = `UPDATE candidate_info SET recruitment_phase = $1 WHERE id = $2;`;
        await client.query(updateQuery, [recruitmentPhaseL2, candidateId]);
      }

      await client.query('COMMIT');
      logger.info('Fullstack feedback inserted successfully for candidateId:', candidateId);
      
      return { success: true };
    } catch (error) {
      try {
        await client.query('ROLLBACK');
        logger.info('Fullstack feedback transaction rolled back successfully');
      } catch (rollbackError) {
        logger.error('Error during fullstack feedback transaction rollback:', rollbackError.message);
      }
      logger.error('Error submitting fullstack feedback:', {
        message: error.message,
        code: error.code,
        detail: error.detail,
        hint: error.hint,
        stack: error.stack
      });
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = PrescreeningService; 