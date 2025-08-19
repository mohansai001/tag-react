const logger = require('../config/logger');
const PanelService = require('../services/panelService');

class PanelController {
  constructor() {
    this.panelService = new PanelService();
  }

  /**
   * Get candidates for panel member by date and email
   */
  async getPanelCandidatesInfo(req, res) {
    try {
      const { l_2_interviewdate, userEmail } = req.query;
      
      if (!l_2_interviewdate || !userEmail) {
        return res.status(400).json({ 
          error: "l_2_interviewdate and userEmail are required" 
        });
      }

      logger.info('Getting panel candidates info:', { l_2_interviewdate, userEmail });
      
      const candidates = await this.panelService.getPanelCandidatesInfo(l_2_interviewdate, userEmail);
      
      logger.info('Panel candidates info retrieved successfully:', { count: candidates.length });
      
      return res.json(candidates);
    } catch (error) {
      logger.error('Error getting panel candidates info:', error);
      return res.status(500).send("Server error");
    }
  }

  /**
   * Get feedback for panel member by date and email
   */
  async getFeedbackForPanelMember(req, res) {
    try {
      const { interview_date, userEmail } = req.query;
      
      if (!interview_date || !userEmail) {
        return res.status(400).json({ 
          error: "interview_date and userEmail are required" 
        });
      }

      logger.info('Getting feedback for panel member:', { interview_date, userEmail });
      
      const feedbacks = await this.panelService.getFeedbackForPanelMember(interview_date, userEmail);
      
      logger.info('Feedback for panel member retrieved successfully:', { count: feedbacks.length });
      
      return res.json(feedbacks);
    } catch (error) {
      logger.error('Error getting feedback for panel member:', error);
      return res.status(500).send("Server error");
    }
  }

  /**
   * Get feedback from multiple tables for panel member
   */
  async getFeedbackTable(req, res) {
    try {
      const { interview_date, userEmail } = req.query;
      
      if (!interview_date || !userEmail) {
        return res.status(400).json({ 
          error: "interview_date and userEmail are required" 
        });
      }

      logger.info('Getting feedback table data:', { interview_date, userEmail });
      
      const feedbacks = await this.panelService.getFeedbackTable(interview_date, userEmail);
      
      if (feedbacks.length === 0) {
        logger.info('No feedback records found for given date and userEmail');
        return res.status(404).json({ message: "No feedback records found" });
      }

      logger.info('Feedback table data retrieved successfully:', { count: feedbacks.length });
      
      return res.json(feedbacks);
    } catch (error) {
      logger.error('Error getting feedback table:', error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Get engineering center and role for candidate
   */
  async getEngCenterSelect(req, res) {
    try {
      const { candidateEmail } = req.body;
      
      if (!candidateEmail) {
        return res.status(400).json({ 
          error: "candidateEmail is required" 
        });
      }

      logger.info('Getting engineering center and role for candidate:', { candidateEmail });
      
      const data = await this.panelService.getEngCenterSelect(candidateEmail);
      
      if (!data) {
        return res.status(404).json({ 
          error: "Candidate not found" 
        });
      }

      logger.info('Engineering center and role retrieved successfully:', { candidateEmail, data });
      
      return res.json(data);
    } catch (error) {
      logger.error('Error getting engineering center and role:', error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Get HR candidates info by date and HR email
   */
  async getHrCandidatesInfo(req, res) {
    try {
      const { l_2_interviewdate, hrEmail } = req.query;
      
      if (!l_2_interviewdate || !hrEmail) {
        return res.status(400).json({ 
          error: "l_2_interviewdate and hrEmail are required" 
        });
      }

      logger.info('Getting HR candidates info:', { l_2_interviewdate, hrEmail });
      
      const candidates = await this.panelService.getHrCandidatesInfo(l_2_interviewdate, hrEmail);
      
      logger.info('HR candidates info retrieved successfully:', { count: candidates.length });
      
      return res.json(candidates);
    } catch (error) {
      logger.error('Error getting HR candidates info:', error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = PanelController; 