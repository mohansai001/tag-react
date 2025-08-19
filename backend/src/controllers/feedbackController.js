const FeedbackService = require('../services/feedbackService');
const logger = require('../config/logger');

class FeedbackController {
  constructor() {
    this.feedbackService = new FeedbackService();
    logger.info('FeedbackController initialized');
  }

  /**
   * Get feedback form data by candidate email and round details
   */
  async getFeedbackForm(req, res) {
    try {
      const { candidateEmail, roundDetails } = req.query;

      if (!candidateEmail || !roundDetails) {
        return res.status(400).json({ 
          error: "candidateEmail and roundDetails are required" 
        });
      }

      logger.info('Getting feedback form for:', { candidateEmail, roundDetails });

      const feedbackData = await this.feedbackService.getFeedbackForm(candidateEmail, roundDetails);

      if (!feedbackData) {
        return res.status(404).json({ error: "No feedback found" });
      }

      logger.info('Feedback form retrieved successfully:', { candidateEmail, roundDetails });

      return res.json(feedbackData);
    } catch (error) {
      logger.error('Error getting feedback form:', error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Submit feedback form data
   */
  async submitFeedback(req, res) {
    try {
      let { formData, roundDetails } = req.body;

      if (!formData || !roundDetails) {
        return res.status(400).json({ 
          success: false, 
          message: "Please fill all the fields" 
        });
      }

      logger.info('Submitting feedback for:', { 
        candidateEmail: formData.candidateEmail, 
        roundDetails 
      });

      const result = await this.feedbackService.submitFeedback(formData, roundDetails);

      logger.info('Feedback submitted successfully:', { 
        candidateEmail: formData.candidateEmail, 
        roundDetails 
      });

      return res.status(200).json({
        success: true,
        message: "Feedback submitted successfully",
        data: result
      });
    } catch (error) {
      logger.error('Error submitting feedback:', error);
      return res.status(500).json({ 
        success: false, 
        message: "Error submitting feedback" 
      });
    }
  }
}

module.exports = FeedbackController; 