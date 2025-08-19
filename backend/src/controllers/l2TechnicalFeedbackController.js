const L2TechnicalFeedbackService = require('../services/l2TechnicalFeedbackService');
const logger = require('../config/logger');

class L2TechnicalFeedbackController {
  constructor() {
    this.l2TechnicalFeedbackService = new L2TechnicalFeedbackService();
    logger.info('L2TechnicalFeedbackController initialized');
  }

  /**
   * Get candidate data by email
   */
  async getCandidateData(req, res) {
    try {
      const { candidateEmail } = req.query;
      
      if (!candidateEmail) {
        return res.status(400).json({ error: "Candidate email is required" });
      }

      logger.info('Getting candidate data for email:', candidateEmail);
      
      const candidateData = await this.l2TechnicalFeedbackService.getCandidateData(candidateEmail);
      
      if (!candidateData) {
        return res.status(404).json({ error: "Candidate not found" });
      }

      logger.info('Candidate data retrieved successfully:', { 
        email: candidateEmail,
        id: candidateData.id 
      });

      return res.json(candidateData);
    } catch (error) {
      logger.error('Error getting candidate data:', error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Get feedback questions for a specific position
   */
  async getFeedbackQuestions(req, res) {
    try {
      const { position } = req.query;
      
      if (!position) {
        return res.status(400).json({ error: "Position is required" });
      }

      logger.info('Getting feedback questions for position:', position);
      
      const questions = await this.l2TechnicalFeedbackService.getFeedbackQuestions(position);
      
      if (questions.length === 0) {
        return res.status(404).json({ message: "No feedback questions found for this position" });
      }

      logger.info('Feedback questions retrieved successfully:', { 
        position, 
        count: questions.length 
      });

      return res.json(questions);
    } catch (error) {
      logger.error('Error getting feedback questions:', error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Submit feedback for a candidate
   */
  async submitFeedback(req, res) {
    try {
      const { candidateEmail, responses, detailedFeedback, result, position } = req.body;

      if (!candidateEmail || !responses || !Array.isArray(responses) || !detailedFeedback || !result || !position) {
        return res.status(400).json({ 
          error: "Missing required fields: candidateEmail, responses (array), detailedFeedback, result, position" 
        });
      }

      logger.info('Submitting feedback for candidate:', { candidateEmail, position, result });

      const serviceResult = await this.l2TechnicalFeedbackService.submitFeedback(
        candidateEmail, 
        responses, 
        detailedFeedback, 
        result, 
        position
      );

      logger.info('Feedback submitted successfully:', { candidateEmail, position });

      return res.json(serviceResult);
    } catch (error) {
      logger.error('Error submitting feedback:', error);
      
      if (error.message === 'Candidate not found') {
        return res.status(404).json({ error: "Candidate not found" });
      }
      
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Get existing feedback for a candidate
   */
  async getExistingFeedback(req, res) {
    try {
      const { candidateId, position } = req.params;

      if (!candidateId || !position) {
        return res.status(400).json({ error: "Candidate ID and position are required" });
      }

      logger.info('Getting existing feedback for candidate:', { candidateId, position });

      const feedback = await this.l2TechnicalFeedbackService.getExistingFeedback(candidateId, position);

      if (!feedback) {
        return res.status(404).json({ message: "No feedback found for this candidate" });
      }

      logger.info('Existing feedback retrieved successfully:', { candidateId, position });

      return res.json(feedback);
    } catch (error) {
      logger.error('Error getting existing feedback:', error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Get feedback questions for .NET positions
   */
  async getDotnetFeedbackQuestions(req, res) {
    try {
      logger.info('Getting .NET feedback questions');
      
      const questions = await this.l2TechnicalFeedbackService.getFeedbackQuestions('dotnet');
      
      if (questions.length === 0) {
        return res.status(404).json({ message: "No .NET feedback questions found" });
      }

      logger.info('.NET feedback questions retrieved successfully:', { count: questions.length });

      return res.json(questions);
    } catch (error) {
      logger.error('Error getting .NET feedback questions:', error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Get feedback questions for Java positions
   */
  async getJavaFeedbackQuestions(req, res) {
    try {
      logger.info('Getting Java feedback questions');
      
      const questions = await this.l2TechnicalFeedbackService.getFeedbackQuestions('java');
      
      if (questions.length === 0) {
        return res.status(404).json({ message: "No Java feedback questions found" });
      }

      logger.info('Java feedback questions retrieved successfully:', { count: questions.length });

      return res.json(questions);
    } catch (error) {
      logger.error('Error getting Java feedback questions:', error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Get feedback questions for Angular positions
   */
  async getAngularFeedbackQuestions(req, res) {
    try {
      logger.info('Getting Angular feedback questions');
      
      const questions = await this.l2TechnicalFeedbackService.getFeedbackQuestions('angular');
      
      if (questions.length === 0) {
        return res.status(404).json({ message: "No Angular feedback questions found" });
      }

      logger.info('Angular feedback questions retrieved successfully:', { count: questions.length });

      return res.json(questions);
    } catch (error) {
      logger.error('Error getting Angular feedback questions:', error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Get feedback questions for React positions
   */
  async getReactFeedbackQuestions(req, res) {
    try {
      logger.info('Getting React feedback questions');
      
      const questions = await this.l2TechnicalFeedbackService.getFeedbackQuestions('react');
      
      if (questions.length === 0) {
        return res.status(404).json({ message: "No React feedback questions found" });
      }

      logger.info('React feedback questions retrieved successfully:', { count: questions.length });

      return res.json(questions);
    } catch (error) {
      logger.error('Error getting React feedback questions:', error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Submit .NET feedback
   */
  async submitDotnetFeedback(req, res) {
    try {
      const { candidateEmail, responses, detailedFeedback, result } = req.body;

      if (!candidateEmail || !responses || !Array.isArray(responses) || !detailedFeedback || !result) {
        return res.status(400).json({ 
          error: "Missing required fields: candidateEmail, responses (array), detailedFeedback, result" 
        });
      }

      logger.info('Submitting .NET feedback for candidate:', { candidateEmail, result });

      const serviceResult = await this.l2TechnicalFeedbackService.submitFeedback(
        candidateEmail, 
        responses, 
        detailedFeedback, 
        result, 
        'dotnet'
      );

      logger.info('.NET feedback submitted successfully:', { candidateEmail });

      return res.json(serviceResult);
    } catch (error) {
      logger.error('Error submitting .NET feedback:', error);
      
      if (error.message === 'Candidate not found') {
        return res.status(404).json({ error: "Candidate not found" });
      }
      
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Submit Java feedback
   */
  async submitJavaFeedback(req, res) {
    try {
      const { candidateEmail, responses, detailedFeedback, result } = req.body;

      if (!candidateEmail || !responses || !Array.isArray(responses) || !detailedFeedback || !result) {
        return res.status(400).json({ 
          error: "Missing required fields: candidateEmail, responses (array), detailedFeedback, result" 
        });
      }

      logger.info('Submitting Java feedback for candidate:', { candidateEmail, result });

      const serviceResult = await this.l2TechnicalFeedbackService.submitFeedback(
        candidateEmail, 
        responses, 
        detailedFeedback, 
        result, 
        'java'
      );

      logger.info('Java feedback submitted successfully:', { candidateEmail });

      return res.json(serviceResult);
    } catch (error) {
      logger.error('Error submitting Java feedback:', error);
      
      if (error.message === 'Candidate not found') {
        return res.status(404).json({ error: "Candidate not found" });
      }
      
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Submit Angular feedback
   */
  async submitAngularFeedback(req, res) {
    try {
      const { candidateEmail, responses, detailedFeedback, result } = req.body;

      if (!candidateEmail || !responses || !Array.isArray(responses) || !detailedFeedback || !result) {
        return res.status(400).json({ 
          error: "Missing required fields: candidateEmail, responses (array), detailedFeedback, result" 
        });
      }

      logger.info('Submitting Angular feedback for candidate:', { candidateEmail, result });

      const serviceResult = await this.l2TechnicalFeedbackService.submitFeedback(
        candidateEmail, 
        responses, 
        detailedFeedback, 
        result, 
        'angular'
      );

      logger.info('Angular feedback submitted successfully:', { candidateEmail });

      return res.json(serviceResult);
    } catch (error) {
      logger.error('Error submitting Angular feedback:', error);
      
      if (error.message === 'Candidate not found') {
        return res.status(404).json({ error: "Candidate not found" });
      }
      
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Submit React feedback
   */
  async submitReactFeedback(req, res) {
    try {
      const { candidateEmail, responses, detailedFeedback, result } = req.body;

      if (!candidateEmail || !responses || !Array.isArray(responses) || !detailedFeedback || !result) {
        return res.status(400).json({ 
          error: "Missing required fields: candidateEmail, responses (array), detailedFeedback, result" 
        });
      }

      logger.info('Submitting React feedback for candidate:', { candidateEmail, result });

      const serviceResult = await this.l2TechnicalFeedbackService.submitFeedback(
        candidateEmail, 
        responses, 
        detailedFeedback, 
        result, 
        'react'
      );

      logger.info('React feedback submitted successfully:', { candidateEmail });

      return res.json(serviceResult);
    } catch (error) {
      logger.error('Error submitting React feedback:', error);
      
      if (error.message === 'Candidate not found') {
        return res.status(404).json({ error: "Candidate not found" });
      }
      
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = L2TechnicalFeedbackController; 