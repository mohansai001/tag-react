const FinalFeedbackService = require('../services/finalFeedbackService');
const logger = require('../config/logger');

class FinalFeedbackController {
  constructor() {
    this.finalFeedbackService = new FinalFeedbackService();
    logger.info('FinalFeedbackController initialized');
  }

  /**
   * Get all shortlisted candidate emails
   */
  async getAllCandidateEmails(req, res) {
    try {
      logger.info('Getting all shortlisted candidate emails');

      const emails = await this.finalFeedbackService.getAllCandidateEmails();

      if (emails.length === 0) {
        return res.status(404).json({ error: "No shortlisted candidates found" });
      }

      logger.info('Shortlisted candidate emails retrieved successfully:', { count: emails.length });

      return res.json({ emails });
    } catch (error) {
      logger.error('Error getting all candidate emails:', error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Get comprehensive feedback data for final feedback form
   */
  async getFinalPrescreeningData(req, res) {
    try {
      const { candidateEmail, candidateId, position } = req.query;

      if (!candidateEmail || !candidateId || !position) {
        return res.status(400).json({ 
          message: 'Email, ID and position are required' 
        });
      }

      logger.info('Getting final prescreening data for:', { candidateEmail, candidateId, position });

      const data = await this.finalFeedbackService.getFinalPrescreeningData(candidateEmail, candidateId, position);

      if (!data) {
        return res.status(404).json({ message: 'No data found for this email' });
      }

      logger.info('Final prescreening data retrieved successfully:', { candidateEmail, candidateId, position });

      return res.status(200).json(data);
    } catch (error) {
      logger.error('Error getting final prescreening data:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = FinalFeedbackController; 