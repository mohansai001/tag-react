const logger = require('../config/logger');
const ImochaService = require('../services/imochaService');

class ImochaController {
  constructor() {
    this.imochaService = new ImochaService();
  }

  /**
   * Invite candidate to iMocha test
   */
  async inviteCandidate(req, res) {
    try {
      const {
        inviteId,
        email,
        name,
        sendEmail,
        callbackURL,
        redirectURL,
        disableMandatoryFields,
        hideInstruction,
        ccEmail
      } = req.body;

      logger.info('Inviting candidate to iMocha test:', { email, name, inviteId });

      if (!inviteId) {
        return res.status(400).json({ error: "Missing inviteId in the request." });
      }

      const result = await this.imochaService.inviteCandidate({
        inviteId,
        email,
        name,
        sendEmail,
        callbackURL,
        redirectURL,
        disableMandatoryFields,
        hideInstruction,
        ccEmail
      });

      logger.info('iMocha invite sent successfully');
      
      return res.json(result);
    } catch (error) {
      logger.error('Error inviting candidate to iMocha:', error);
      
      if (error.response?.status) {
        return res.status(error.response.status).json({ 
          error: "Failed to send invite to iMocha" 
        });
      }
      
      return res.status(500).json({ 
        error: "An error occurred while sending the invite" 
      });
    }
  }

  /**
   * Update candidate recruitment phase
   */
  async updateCandidateRecruitmentPhase(req, res) {
    try {
      const { candidate_email, recruitment_phase } = req.body;

      if (!candidate_email || !recruitment_phase) {
        return res.status(400).json({ 
          success: false, 
          message: "Candidate email and recruitment phase are required" 
        });
      }

      logger.info('Updating candidate recruitment phase:', { candidate_email, recruitment_phase });

      const result = await this.imochaService.updateCandidateRecruitmentPhase(candidate_email, recruitment_phase);

      if (!result) {
        return res.status(404).json({ 
          success: false, 
          message: "Candidate not found" 
        });
      }

      logger.info('Candidate recruitment phase updated successfully');

      return res.status(200).json({
        success: true,
        message: "Recruitment phase updated",
        data: result
      });
    } catch (error) {
      logger.error('Error updating candidate recruitment phase:', error);
      return res.status(500).json({ 
        success: false, 
        message: "Error updating recruitment phase" 
      });
    }
  }

  /**
   * Save recruitment rounds to database
   */
  async saveRounds(req, res) {
    try {
      const { rounds } = req.body;

      if (!rounds || rounds.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: "No rounds provided" 
        });
      }

      logger.info('Saving recruitment rounds:', { count: rounds.length });

      const result = await this.imochaService.saveRounds(rounds);

      logger.info('Recruitment rounds saved successfully');

      return res.json({ 
        success: true, 
        message: "Rounds added successfully" 
      });
    } catch (error) {
      logger.error('Error saving recruitment rounds:', error);
      return res.status(500).json({ 
        success: false, 
        message: "Database error" 
      });
    }
  }

  /**
   * Get recruitment rounds by RRF ID
   */
  async getRounds(req, res) {
    try {
      const { rrf_id } = req.query;

      if (!rrf_id) {
        return res.status(400).json({ 
          success: false, 
          message: "Missing rrf_id" 
        });
      }

      logger.info('Fetching recruitment rounds for RRF:', rrf_id);

      const rounds = await this.imochaService.getRounds(rrf_id);

      logger.info('Recruitment rounds fetched successfully:', { count: rounds.length });

      return res.json({ 
        success: true, 
        rounds: rounds 
      });
    } catch (error) {
      logger.error('Error fetching recruitment rounds:', error);
      return res.status(500).json({ 
        success: false, 
        message: "Database error" 
      });
    }
  }

  /**
   * Get next round for candidate
   */
  async getNextRound(req, res) {
    try {
      const { rrf_id, recruitment_phase } = req.query;

      if (!rrf_id || !recruitment_phase) {
        return res.status(400).json({ 
          error: "Missing rrf_id or recruitment_phase" 
        });
      }

      logger.info('Getting next round for candidate:', { rrf_id, recruitment_phase });

      const nextRound = await this.imochaService.getNextRound(rrf_id, recruitment_phase);

      logger.info('Next round determined:', { nextRound });

      return res.json({ nextRound });
    } catch (error) {
      logger.error('Error getting next round:', error);
      return res.status(500).json({ 
        error: "Internal server error" 
      });
    }
  }

  /**
   * Get feedback form data
   */
  async getFeedbackForm(req, res) {
    try {
      const { candidateEmail, roundDetails } = req.query;

      if (!candidateEmail || !roundDetails) {
        return res.status(400).json({ 
          error: "candidateEmail and roundDetails are required" 
        });
      }

      logger.info('Fetching feedback form data:', { candidateEmail, roundDetails });

      const feedback = await this.imochaService.getFeedbackForm(candidateEmail, roundDetails);

      if (!feedback) {
        return res.status(404).json({ 
          error: "No feedback found" 
        });
      }

      logger.info('Feedback form data fetched successfully');

      return res.json(feedback);
    } catch (error) {
      logger.error('Error fetching feedback form data:', error);
      return res.status(500).json({ 
        error: "Internal server error" 
      });
    }
  }
}

module.exports = new ImochaController(); 