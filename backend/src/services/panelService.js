const db = require('../config/database/db');
const logger = require('../config/logger');

class PanelService {
  /**
   * Get candidates for panel member by date and email
   */
  async getPanelCandidatesInfo(l2InterviewDate, userEmail) {
    try {
      // Define the recruitment phases to include
      const recruitmentPhases = [
        "L2 Technical Round Scheduled",
        "Shortlisted in L2",
        "Client Fitment Round Scheduled",
        "Shortlisted in Client Fitment Round",
        "Project Fitment Round Scheduled",
        "Shortlisted in Project Fitment Round",
        "Fitment Round Scheduled",
        "Shortlisted in Fitment Round",
        "EC Fitment Round Scheduled",
        "Shortlisted in EC Fitment Round",
      ];

      const query = `
        SELECT candidate_name, candidate_email, role, recruitment_phase, resume, l_2_interviewdate, 
               imocha_report, meeting_link, l_2_interviewtime
        FROM candidate_info
        WHERE prescreening_status = 'Shortlisted'
          AND recruitment_phase = ANY($1)
          AND l_2_interviewdate = $2
          AND panel_name ILIKE $3;
      `;

      const result = await db.query(query, [recruitmentPhases, l2InterviewDate, userEmail]);

      logger.info('Panel candidates info retrieved successfully:', { 
        date: l2InterviewDate, 
        userEmail, 
        count: result.rows.length 
      });

      return result.rows;
    } catch (error) {
      logger.error('Error fetching panel candidates info:', error);
      throw error;
    }
  }

  /**
   * Get feedback for panel member by date and email
   */
  async getFeedbackForPanelMember(interviewDate, userEmail) {
    try {
      const query = `
        SELECT candidate_email, candidate_name, interview_date, interviewer_name, 
               detailed_feedback, result, submitted_at, round_details, position
        FROM feedbackform
        WHERE interview_date = $1
          AND interviewer_name ILIKE $2;
      `;

      const result = await db.query(query, [interviewDate, userEmail]);

      logger.info('Feedback for panel member retrieved successfully:', { 
        date: interviewDate, 
        userEmail, 
        count: result.rows.length 
      });

      return result.rows;
    } catch (error) {
      logger.error('Error fetching feedback for panel member:', error);
      throw error;
    }
  }

  /**
   * Get feedback from multiple tables for panel member
   */
  async getFeedbackTable(interviewDate, userEmail) {
    try {
      logger.info('Fetching feedback from multiple tables:', { interviewDate, userEmail });

      // Query from feedback_table
      const feedbackTableQuery = `
        SELECT candidate_name, candidate_email, position, hr_email, result, interview_date
        FROM feedback_table
        WHERE interview_date = $1
          AND interviewer_name = $2;
      `;
      const feedbackTableResult = await db.query(feedbackTableQuery, [interviewDate, userEmail]);

      // Query from app_dotnet_l2_feedback_response
      const dotnetQuery = `
        SELECT 
          f.candidate_email,
          c.candidate_name,
          c.role AS position,
          f.result,
          f.updated_at AS interview_date
        FROM app_dotnet_l2_feedback_response f
        LEFT JOIN candidate_info c ON f.candidate_email = c.candidate_email
        WHERE DATE(f.updated_at) = $1
          AND f.interviewer_name ILIKE $2;
      `;
      const dotnetResult = await db.query(dotnetQuery, [interviewDate, userEmail]);

      // Query from app_java_l2_feedback_response
      const javaQuery = `
        SELECT 
          f.candidate_email,
          c.candidate_name,
          c.role AS position,
          f.result,
          f.updated_at AS interview_date
        FROM app_java_l2_feedback_response f
        LEFT JOIN candidate_info c ON f.candidate_email = c.candidate_email
        WHERE DATE(f.updated_at) = $1
          AND f.interviewer_name ILIKE $2;
      `;
      const javaResult = await db.query(javaQuery, [interviewDate, userEmail]);

      // Combine all results
      const allFeedbacks = [
        ...feedbackTableResult.rows,
        ...dotnetResult.rows,
        ...javaResult.rows,
      ];

      logger.info('Feedback table data retrieved successfully:', { 
        date: interviewDate, 
        userEmail, 
        totalCount: allFeedbacks.length,
        feedbackTableCount: feedbackTableResult.rows.length,
        dotnetCount: dotnetResult.rows.length,
        javaCount: javaResult.rows.length
      });

      return allFeedbacks;
    } catch (error) {
      logger.error('Error fetching feedback table:', error);
      throw error;
    }
  }

  /**
   * Get engineering center and role for candidate
   */
  async getEngCenterSelect(candidateEmail) {
    try {
      const query = `
        SELECT eng_center, role
        FROM candidate_info
        WHERE candidate_email = $1;
      `;
      const result = await db.query(query, [candidateEmail]);

      if (result.rows.length === 0) {
        return null;
      }

      const data = {
        eng_center: result.rows[0].eng_center,
        role: result.rows[0].role
      };

      logger.info('Engineering center and role retrieved successfully:', { 
        candidateEmail, 
        data 
      });

      return data;
    } catch (error) {
      logger.error('Error fetching engineering center and role:', error);
      throw error;
    }
  }

  /**
   * Get HR candidates info by date and HR email
   */
  async getHrCandidatesInfo(l2InterviewDate, hrEmail) {
    try {
      const query = `
        SELECT candidate_name, candidate_email, role, recruitment_phase, resume, l_2_interviewdate, 
               imocha_report, meeting_link, l_2_interviewtime
        FROM candidate_info 
        WHERE prescreening_status = 'Shortlisted' 
          AND recruitment_phase = 'L2 Scheduled' 
          AND l_2_interviewdate = $1
          AND hr_email = $2;
      `;

      const result = await db.query(query, [l2InterviewDate, hrEmail]);

      logger.info('HR candidates info retrieved successfully:', { 
        date: l2InterviewDate, 
        hrEmail, 
        count: result.rows.length 
      });

      return result.rows;
    } catch (error) {
      logger.error('Error fetching HR candidates info:', error);
      throw error;
    }
  }
}

module.exports = PanelService; 