const db = require('../config/database/db');
const logger = require('../config/logger');

class CandidatesService {
  constructor() {
    console.log('Initializing CandidatesService...');
    console.log('CandidatesService initialized successfully');
  }

  /**
   * Get shortlisted candidates with updated scores and statuses
   */
  async getShortlistedCandidates() {
    try {
      // First, update shortlisted candidates with scores, statuses, and PDF report URL
      const updateQuery = `
        UPDATE candidate_info
        SET 
          l_1_score = ir.score,
          l_1_status = CASE 
            WHEN ir.score >= 18 THEN 'qualified in l1'
            WHEN ir.score < 18 THEN 'failed in l1'
            ELSE 'no score available'
          END,
          recruitment_phase = CASE 
            WHEN ir.score >= 18 THEN 'Moved to L2'
            WHEN ir.score < 18 THEN 'Rejected in L1'
            ELSE recruitment_phase
          END,
          imocha_report = ir.pdf_report_url
        FROM imocha_results ir
        WHERE 
          candidate_info.candidate_email = ir.candidate_email
          AND candidate_info.prescreening_status = 'Shortlisted'
          AND candidate_info.recruitment_phase NOT IN (
            'Shortlisted in Fitment Round','L2 Technical Round Scheduled',
            'EC Fitment Round Scheduled','Shortlisted in EC Fitment Round',
            'Shortlisted in Client','Fitment Round Scheduled',
            'Project Fitment Round Scheduled','Shortlisted in Project Fitment Round',
            'Client Fitment Round Scheduled','Shortlisted in Client Fitment Round',
            'Shortlisted in L2', 'Rejected in L2', 'On Hold in L2', 
            'No iMocha Exam','Schedule L2 Technical','Client Round Scheduled',
            'Rejected in Client','Rejected in Client Fitment Round',
            'Rejected in Project Fitment Round','Rejected in Fitment Round'
          );
      `;

      await db.query(updateQuery);

      // Retrieve shortlisted candidates after update
      const getQuery = `
        SELECT 
          ci.rrf_id,
          ci.hr_email,
          ci.candidate_name,
          ci.candidate_email,
          ci.prescreening_status,
          COALESCE(ir.score, null) AS score,
          ci.l_1_score,
          ci.role,
          ci.candidate_phone,
          ci.l_1_status,
          ci.date,
          ci.recruitment_phase,
          ir.pdf_report_url AS imocha_report
        FROM 
          candidate_info ci
        LEFT JOIN 
          imocha_results ir
        ON 
          ci.candidate_email = ir.candidate_email
        WHERE 
          ci.prescreening_status = 'Shortlisted';
      `;

      const result = await db.query(getQuery);

      if (result.rows.length === 0) {
        return [];
      }

      logger.info('Shortlisted candidates retrieved successfully:', { count: result.rows.length });
      return result.rows;
    } catch (error) {
      logger.error('Error retrieving shortlisted candidates:', error);
      throw error;
    }
  }

  /**
   * Get email status for a candidate
   */
  async getEmailStatus(candidateEmail) {
    try {
      const query = "SELECT email_status FROM candidate_info WHERE candidate_email = $1";
      const result = await db.query(query, [candidateEmail]);

      if (result.rows.length === 0) {
        return null;
      }

      logger.info('Email status retrieved for candidate:', { email: candidateEmail, status: result.rows[0].email_status });
      return result.rows[0].email_status;
    } catch (error) {
      logger.error('Error getting email status:', error);
      throw error;
    }
  }

  /**
   * Update email status for a candidate
   */
  async updateEmailStatus(candidateEmail, status) {
    try {
      const query = "UPDATE candidate_info SET email_status = $1 WHERE candidate_email = $2 RETURNING *";
      const result = await db.query(query, [status, candidateEmail]);

      if (result.rows.length === 0) {
        return null;
      }

      logger.info('Email status updated successfully:', { email: candidateEmail, status });
      return result.rows[0];
    } catch (error) {
      logger.error('Error updating email status:', error);
      throw error;
    }
  }

  /**
   * Get panel emails by domain
   */
  async getPanelEmails(domain) {
    try {
      const query = "SELECT email FROM panel_details WHERE account = $1";
      const result = await db.query(query, [domain]);

      if (result.rows.length === 0) {
        return [];
      }

      const emails = result.rows.map(row => row.email);
      logger.info('Panel emails retrieved for domain:', { domain, count: emails.length });
      return emails;
    } catch (error) {
      logger.error('Error getting panel emails:', error);
      throw error;
    }
  }

  /**
   * Process test attempts for different EC types
   */
  async processTestAttempts(ecType, startDate, endDate) {
    try {
      const startDateTime = new Date(`${startDate}T00:00:00Z`).toISOString();
      const endDateTime = new Date(`${endDate}T23:59:59Z`).toISOString();

      // Define test IDs for different EC types
      const testIds = {
        cloudEC: [1292180, 1292181, 1292182], // Example IDs - adjust as needed
        dataEC: [1292183, 1292184, 1292185],   // Example IDs - adjust as needed
        appEC: [1292186, 1292187, 1292188]     // Example IDs - adjust as needed
      };

      const testIdsArray = testIds[ecType];
      if (!testIdsArray) {
        throw new Error(`Invalid EC type: ${ecType}`);
      }

      // Process test attempts (this would integrate with iMocha API)
      logger.info('Processing test attempts:', { ecType, startDate, endDate, testIds: testIdsArray });
      
      // For now, return success message
      // In a real implementation, this would call the iMocha API to fetch and save test results
      return { message: `${ecType} test attempts processed` };
    } catch (error) {
      logger.error('Error processing test attempts:', error);
      throw error;
    }
  }

  /**
   * Get candidate data by email
   */
  async getCandidateData(candidateEmail) {
    try {
      const query = `
        SELECT id, candidate_name, role, panel_name, l_2_interviewdate, l_1_score, rrf_id, hr_email, eng_center
        FROM candidate_info WHERE candidate_email = $1;
      `;

      const result = await db.query(query, [candidateEmail]);

      if (result.rows.length === 0) {
        return null;
      }

      logger.info('Candidate data retrieved:', { email: candidateEmail });
      return result.rows[0];
    } catch (error) {
      logger.error('Error getting candidate data:', error);
      throw error;
    }
  }

  /**
   * Update candidate feedback
   */
  async updateCandidateFeedback(candidateEmail, feedback, result) {
    try {
      let recruitmentPhase;
      if (result === "Recommended") {
        recruitmentPhase = "Shortlisted in L2";
      } else if (result === "Rejected") {
        recruitmentPhase = "Rejected in L2";
      }

      const query = `
        UPDATE candidate_info
        SET l_2_feedback = $1,
            l_2_status = $2,
            recruitment_phase = $3
        WHERE candidate_email = $4
        RETURNING *;
      `;

      const resultFromDB = await db.query(query, [feedback, result, recruitmentPhase, candidateEmail]);

      if (resultFromDB.rows.length === 0) {
        return null;
      }

      logger.info('Candidate feedback updated successfully:', { email: candidateEmail, result });
      return resultFromDB.rows[0];
    } catch (error) {
      logger.error('Error updating candidate feedback:', error);
      throw error;
    }
  }

  /**
   * Update candidate status for interview scheduling
   */
  async updateCandidateStatus(email, status, panel, dateTime, meetingLink) {
    try {
      const updateQuery = `
        UPDATE candidate_info
        SET recruitment_phase = $1, 
            meeting_link = $2, 
            l_2_interviewdate = $3, 
            l_2_interviewtime = $4,
            panel_name = $5
        WHERE candidate_email = $6
        RETURNING *;
      `;

      const result = await db.query(updateQuery, [
        status,
        meetingLink,
        dateTime.split("T")[0],
        dateTime.split("T")[1].split(".")[0],
        panel,
        email,
      ]);

      if (result.rows.length === 0) {
        return null;
      }

      logger.info('Candidate status updated successfully:', { 
        email, 
        status, 
        panel, 
        dateTime,
        meetingLink 
      });
      
      return result.rows[0];
    } catch (error) {
      logger.error('Error updating candidate status:', error);
      throw error;
    }
  }
}

module.exports = CandidatesService; 