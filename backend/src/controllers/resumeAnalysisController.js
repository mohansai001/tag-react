const logger = require('../config/logger');
const ResumeAnalysisService = require('../services/resumeAnalysisService');

// Create an instance of the service
const resumeAnalysisService = new ResumeAnalysisService();

class ResumeAnalysisController {
  /**
   * Add candidate information to database
   */
  async addCandidateInfo(req, res) {
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
      } = req.body;

      // Validate required fields
      if (!candidate_name || !candidate_email) {
        return res.status(400).json({
          success: false,
          error: 'Candidate name and email are required'
        });
      }

      logger.info('Adding candidate info:', { 
        candidate_name, 
        candidate_email, 
        role,
        prescreening_status 
      });

      const result = await resumeAnalysisService.addCandidateInfo({
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
      });

      logger.info('Candidate info saved successfully:', { candidateId: result.id });

      return res.status(200).json({
        success: true,
        message: "Candidate info saved",
        data: result,
      });

    } catch (error) {
      logger.error('Error saving candidate information:', error);
      
      const isDuplicate = error.code === '23505';
      
      return res.status(500).json({
        success: false,
        message: isDuplicate ? "Duplicate candidate email" : "Error saving candidate info",
        code: error.code,
        detail: error.detail
      });
    }
  }

  /**
   * Get all candidate information
   */
  async getCandidateInfo(req, res) {
    try {
      logger.info('Fetching candidate info');
      
      // Debug: Check if the service instance exists
      logger.info('Service instance:', typeof resumeAnalysisService);
      logger.info('Service methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(resumeAnalysisService)));

      const candidates = await resumeAnalysisService.getCandidateInfo();

      logger.info('Candidate info fetched successfully:', { count: candidates.length });

      return res.json({
        success: true,
        data: candidates || []
      });

    } catch (error) {
      logger.error('Error fetching candidate info:', error);
      logger.error('Error stack:', error.stack);
      
      return res.status(500).json({
        success: false,
        message: 'Server error while fetching candidate data',
        error: error.message,
        data: []
      });
    }
  }

  /**
   * Get specific candidate evaluation by ID
   */
  async getCandidateEvaluation(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Candidate ID is required'
        });
      }

      logger.info('Fetching candidate evaluation:', { candidateId: id });

      const candidate = await resumeAnalysisService.getCandidateById(id);

      if (!candidate) {
        return res.status(404).json({
          success: false,
          message: 'Candidate not found',
          data: null
        });
      }

      logger.info('Candidate evaluation fetched successfully:', { candidateId: id });

      return res.json({
        success: true,
        data: candidate
      });

    } catch (error) {
      logger.error('Error fetching candidate evaluation:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Server error while fetching candidate evaluation',
        error: error.message,
        data: null
      });
    }
  }
}

module.exports = new ResumeAnalysisController(); 