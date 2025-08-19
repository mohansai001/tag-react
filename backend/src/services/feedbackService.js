const db = require('../config/database/db');
const logger = require('../config/logger');

class FeedbackService {
  constructor() {
    logger.info('FeedbackService initialized');
  }

  /**
   * Get feedback form data by candidate email and round details
   */
  async getFeedbackForm(candidateEmail, roundDetails) {
    try {
      logger.info('Getting feedback form for:', { candidateEmail, roundDetails });
      
      const query = `
        SELECT * FROM feedbackform
        WHERE candidate_email = $1 AND round_details = $2;
      `;

      const result = await db.query(query, [candidateEmail, roundDetails]);

      if (result.rows.length > 0) {
        logger.info('Feedback form found:', { candidateEmail, roundDetails });
        return result.rows[0];
      } else {
        logger.warn('No feedback form found for:', { candidateEmail, roundDetails });
        return null;
      }
    } catch (error) {
      logger.error('Database error in getFeedbackForm:', error);
      throw error;
    }
  }

  /**
   * Submit feedback form data
   */
  async submitFeedback(formData, roundDetails) {
    const client = await db.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      logger.info('Submitting feedback for:', { 
        candidateEmail: formData.candidateEmail, 
        roundDetails 
      });

      // Clean up roundDetails
      const cleanRoundDetails = roundDetails.replace("Scheduled", "").trim();
      const candidateEmail = formData.candidateEmail;

      // Check if feedback already exists
      const checkQuery = `
        SELECT * FROM feedbackform
        WHERE candidate_email = $1 AND round_details = $2;
      `;
      const existingFeedback = await client.query(checkQuery, [candidateEmail, cleanRoundDetails]);

      let result;
      
      if (existingFeedback.rows.length > 0) {
        // Update existing feedback
        logger.info('Updating existing feedback for:', { candidateEmail, cleanRoundDetails });
        
        const updateQuery = `
          UPDATE feedbackform 
          SET 
              imocha_score = $1,
              rrf_id = $2,
              position = $3,
              candidate_name = $4,
              interview_date = $5,
              interviewer_name = $6,
              hr_email = $7,
              detailed_feedback = $8,
              result = $9,
              submitted_at = NOW(),
              organizational_fitment = $10,
              customer_communication = $11,
              continuous_learning = $12,
              attitude_personality = $13,
              communication_skills = $14,
              project_fitment = $15
          WHERE candidate_email = $16 AND round_details = $17
          RETURNING *;
        `;

        const updateValues = [
          formData.imochaScore,
          formData.rrfId,
          formData.position,
          formData.candidateName,
          formData.interviewDate,
          formData.interviewerName,
          formData.hrEmail,
          formData.detailedFeedback,
          formData.result,
          formData.organizationalFitment || null,
          formData.customerCommunication || null,
          formData.continuousLearning || null,
          formData.attitudePersonality || null,
          formData.communicationSkills || null,
          formData.projectFitment || null,
          candidateEmail,
          cleanRoundDetails
        ];

        result = await client.query(updateQuery, updateValues);
        logger.info('Feedback updated successfully');
      } else {
        // Insert new feedback
        logger.info('Inserting new feedback for:', { candidateEmail, cleanRoundDetails });
        
        const insertQuery = `
          INSERT INTO feedbackform 
            (round_details, candidate_email, imocha_score, rrf_id, position, candidate_name, interview_date, 
             interviewer_name, hr_email, detailed_feedback, result, submitted_at,
             organizational_fitment, customer_communication, continuous_learning,
             attitude_personality, communication_skills, project_fitment)
          VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(),
             $12, $13, $14, $15, $16, $17) 
          RETURNING *;
        `;

        const insertValues = [
          cleanRoundDetails,
          candidateEmail,
          formData.imochaScore,
          formData.rrfId,
          formData.position,
          formData.candidateName,
          formData.interviewDate,
          formData.interviewerName,
          formData.hrEmail,
          formData.detailedFeedback,
          formData.result,
          formData.organizationalFitment || null,
          formData.customerCommunication || null,
          formData.continuousLearning || null,
          formData.attitudePersonality || null,
          formData.communicationSkills || null,
          formData.projectFitment || null
        ];

        result = await client.query(insertQuery, insertValues);
        logger.info('Feedback inserted successfully');
      }

      // Update candidate recruitment phase
      const feedbackResult = formData.result;
      let recruitmentPhase = "";

      if (feedbackResult === "Recommended") {
        recruitmentPhase = `Shortlisted in ${cleanRoundDetails}`;
      } else if (feedbackResult === "Rejected") {
        recruitmentPhase = `Rejected in ${cleanRoundDetails}`;
      }

      if (recruitmentPhase) {
        const updateCandidateQuery = `
          UPDATE candidate_info 
          SET recruitment_phase = $1
          WHERE candidate_email = $2
        `;
        await client.query(updateCandidateQuery, [recruitmentPhase, candidateEmail]);
        logger.info('Candidate recruitment phase updated:', { candidateEmail, recruitmentPhase });
      }

      await client.query('COMMIT');
      
      logger.info('Feedback submission completed successfully');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Error submitting feedback:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = FeedbackService; 