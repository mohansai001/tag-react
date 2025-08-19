const db = require('../config/database/db');
const logger = require('../config/logger');

class ResumeAnalysisService {
  /**
   * Add candidate information to database
   */
  async addCandidateInfo(candidateData) {
    try {
      const {
        candidate_name,
        candidate_email,
        prescreening_status,
        role,
        recruitment_phase,
        resume_score,
        resume,
        candidate_phone,
        hr_email,
        rrf_id,
        eng_center,
        content,
      } = candidateData;

      const query = `
        INSERT INTO candidate_info (
          candidate_name, 
          candidate_email, 
          prescreening_status, 
          role, 
          recruitment_phase,
          resume_score,
          resume,
          candidate_phone,
          hr_email,
          rrf_id,
          eng_center,
          content
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *;
      `;

      const values = [
        candidate_name,
        candidate_email,
        prescreening_status,
        role,
        recruitment_phase,
        resume_score,
        resume,
        candidate_phone,
        hr_email,
        rrf_id,
        eng_center,
        content,
      ];

      const result = await db.query(query, values);
      
      logger.info('Candidate info inserted successfully:', { 
        candidateId: result.rows[0].id,
        candidateEmail: candidate_email 
      });

      return result.rows[0];

    } catch (error) {
      logger.error('Database error in addCandidateInfo:', error);
      throw error;
    }
  }

  /**
   * Get all candidate information
   */
  async getCandidateInfo() {
    try {
      logger.info('Starting getCandidateInfo service method');
      
      const query = `
        SELECT 
          id,
          candidate_name,
          resume,
          content,
          prescreening_status,
          hr_email,
          rrf_id,
          eng_center,
          role
        FROM candidate_info
        ORDER BY id DESC
      `;

      logger.info('Executing query:', query);

      const result = await db.query(query);
      
      logger.info('Query executed successfully, rows returned:', result.rows.length);

      return result.rows;

    } catch (error) {
      logger.error('Database error in getCandidateInfo:', error);
      logger.error('Error details:', {
        message: error.message,
        code: error.code,
        detail: error.detail
      });
      throw error;
    }
  }

  /**
   * Get candidate by ID
   */
  async getCandidateById(id) {
    try {
      const query = `
        SELECT * FROM candidate_info 
        WHERE id = $1
      `;

      const result = await db.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }

      logger.info('Candidate retrieved by ID:', { candidateId: id });

      return result.rows[0];

    } catch (error) {
      logger.error('Database error in getCandidateById:', error);
      throw error;
    }
  }
}

module.exports = ResumeAnalysisService; 