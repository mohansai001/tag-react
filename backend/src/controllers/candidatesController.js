const logger = require('../config/logger');
const CandidatesService = require('../services/candidatesService');

class CandidatesController {
  constructor() {
    console.log('Initializing CandidatesController...');
    this.candidatesService = new CandidatesService();
    console.log('CandidatesController initialized successfully');
  }

  /**
   * Get shortlisted candidates
   */
  async getShortlistedCandidates(req, res) {
    try {
      logger.info('Fetching shortlisted candidates');
      
      const candidates = await this.candidatesService.getShortlistedCandidates();
      
      if (candidates.length === 0) {
        return res.status(404).json({ 
          message: "No shortlisted candidates found." 
        });
      }

      logger.info('Shortlisted candidates retrieved successfully:', { count: candidates.length });
      
      return res.status(200).json({
        message: "Shortlisted candidates retrieved successfully.",
        candidates: candidates
      });
    } catch (error) {
      logger.error('Error retrieving shortlisted candidates:', error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Get email status for a candidate
   */
  async getEmailStatus(req, res) {
    try {
      const { candidate_email } = req.query;
      
      if (!candidate_email) {
        return res.status(400).json({ 
          message: "candidate_email query parameter is required." 
        });
      }

      logger.info('Getting email status for candidate:', candidate_email);
      
      const status = await this.candidatesService.getEmailStatus(candidate_email);
      
      if (status === null) {
        return res.status(404).json({ message: "Candidate not found." });
      }

      logger.info('Email status retrieved successfully:', { email: candidate_email, status });
      
      return res.json({ status });
    } catch (error) {
      logger.error('Error getting email status:', error);
      return res.status(500).json({ message: "Database error." });
    }
  }

  /**
   * Update email status for a candidate
   */
  async updateEmailStatus(req, res) {
    try {
      const { candidate_email, status } = req.body;
      
      if (!candidate_email || !status) {
        return res.status(400).json({ 
          message: "candidate_email and status are required." 
        });
      }

      logger.info('Updating email status for candidate:', { email: candidate_email, status });
      
      const result = await this.candidatesService.updateEmailStatus(candidate_email, status);
      
      if (!result) {
        return res.status(404).json({ message: "Candidate not found." });
      }

      logger.info('Email status updated successfully');
      
      return res.json({
        message: "Email status updated successfully.",
        candidate: result
      });
    } catch (error) {
      logger.error('Error updating email status:', error);
      return res.status(500).json({ message: "Database error." });
    }
  }

  /**
   * Get panel emails by domain
   */
  async getPanelEmails(req, res) {
    try {
      const { domain } = req.query;
      
      if (!domain) {
        return res.status(400).json({ message: "Domain is required" });
      }

      logger.info('Getting panel emails for domain:', domain);
      
      const emails = await this.candidatesService.getPanelEmails(domain);
      
      if (emails.length === 0) {
        return res.status(404).json({ 
          message: "No emails found for the selected domain" 
        });
      }

      logger.info('Panel emails retrieved successfully:', { domain, count: emails.length });
      
      return res.status(200).json(emails);
    } catch (error) {
      logger.error('Error getting panel emails:', error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Process test attempts for different EC types
   */
  async processTestAttempts(req, res) {
    try {
      const { ecType } = req.params;
      const { startDate, endDate } = req.body;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ 
          message: "startDate and endDate are required" 
        });
      }

      logger.info('Processing test attempts:', { ecType, startDate, endDate });
      
      const result = await this.candidatesService.processTestAttempts(ecType, startDate, endDate);
      
      logger.info('Test attempts processed successfully:', { ecType });
      
      return res.json(result);
    } catch (error) {
      logger.error('Error processing test attempts:', error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Get candidate data by email
   */
  async getCandidateData(req, res) {
    try {
      const { candidateEmail } = req.query;
      
      if (!candidateEmail) {
        return res.status(400).json({ error: "candidateEmail is required" });
      }

      logger.info('Getting candidate data for email:', candidateEmail);
      
      const candidateData = await this.candidatesService.getCandidateData(candidateEmail);
      
      if (!candidateData) {
        return res.status(404).json({ error: "No candidate found" });
      }

      logger.info('Candidate data retrieved successfully');
      
      return res.json(candidateData);
    } catch (error) {
      logger.error('Error getting candidate data:', error);
      return res.status(500).json({ error: "Database error" });
    }
  }

  /**
   * Update candidate feedback
   */
  async updateCandidateFeedback(req, res) {
    try {
      const { candidateEmail, feedback, result } = req.body;
      
      if (!candidateEmail || !feedback || !result) {
        return res.status(400).json({ 
          error: "candidateEmail, feedback, and result are required" 
        });
      }

      logger.info('Updating candidate feedback:', { email: candidateEmail, result });
      
      const updatedData = await this.candidatesService.updateCandidateFeedback(candidateEmail, feedback, result);
      
      if (!updatedData) {
        return res.status(404).json({ error: "Candidate not found" });
      }

      logger.info('Candidate feedback updated successfully');
      
      return res.json({
        success: true,
        message: "Candidate feedback and result updated successfully",
        updatedData: updatedData
      });
    } catch (error) {
      logger.error('Error updating candidate feedback:', error);
      return res.status(500).json({ error: "Database error" });
    }
  }

  /**
   * Update candidate status for interview scheduling
   */
  async updateCandidateStatus(req, res) {
    try {
      const { email, status, panel, dateTime, meetingLink } = req.body;
      
      if (!email || !status || !panel || !dateTime || !meetingLink) {
        return res.status(400).json({ 
          error: "email, status, panel, dateTime, and meetingLink are required" 
        });
      }

      logger.info('Updating candidate status for interview scheduling:', { 
        email, 
        status, 
        panel, 
        dateTime 
      });
      
      const updatedData = await this.candidatesService.updateCandidateStatus(email, status, panel, dateTime, meetingLink);
      
      if (!updatedData) {
        return res.status(404).json({ error: "Candidate not found" });
      }

      logger.info('Candidate status updated successfully for interview scheduling');
      
      return res.json({
        message: "Interview scheduled successfully.",
        meetingLink,
        updatedData
      });
    } catch (error) {
      logger.error('Error updating candidate status for interview scheduling:', error);
      return res.status(500).json({ 
        message: "Failed to update candidate status",
        error: error.message 
      });
    }
  }
}

module.exports = CandidatesController; 