const logger = require('../config/logger');
const PrescreeningService = require('../services/prescreeningService');

class PrescreeningController {
  constructor() {
    console.log('Initializing PrescreeningController...');
    this.prescreeningService = new PrescreeningService();
    console.log('PrescreeningController initialized successfully');
  }

  /**
   * Get all candidate emails (shortlisted candidates)
   */
  async getAllCandidateEmails(req, res) {
    try {
      logger.info('Fetching all candidate emails');
      
      const emails = await this.prescreeningService.getAllCandidateEmails();
      
      logger.info('Candidate emails fetched successfully:', { count: emails.length });
      
      return res.json({ emails });
    } catch (error) {
      logger.error('Error fetching candidate emails:', error);
      return res.status(500).json({ error: 'Database error' });
    }
  }

  /**
   * Get candidate data by email
   */
  async getCandidateData(req, res) {
    try {
      const { candidateEmail } = req.query;
      
      if (!candidateEmail) {
        return res.status(400).json({ error: 'Candidate email is required' });
      }

      logger.info('Fetching candidate data for email:', candidateEmail);
      
      const candidateData = await this.prescreeningService.getCandidateData(candidateEmail);
      
      if (!candidateData) {
        return res.status(404).json({ error: 'Candidate not found' });
      }

      logger.info('Candidate data fetched successfully');
      
      return res.json(candidateData);
    } catch (error) {
      logger.error('Error fetching candidate data:', error);
      return res.status(500).json({ error: 'Database error' });
    }
  }

  /**
   * Get Java EC questions
   */
  async getJavaEcQuestions(req, res) {
    try {
      logger.info('Fetching Java EC questions');
      
      const questions = await this.prescreeningService.getQuestions('app_ec_java_questionnaire');
      
      logger.info('Java EC questions fetched successfully:', { count: questions.length });
      
      return res.json(questions);
    } catch (error) {
      logger.error('Error fetching Java EC questions:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get .NET EC questions
   */
  async getDotnetEcQuestions(req, res) {
    try {
      logger.info('Fetching .NET EC questions');
      
      const questions = await this.prescreeningService.getQuestions('app_ec_dotnet_questionnaire');
      
      logger.info('.NET EC questions fetched successfully:', { count: questions.length });
      
      return res.json(questions);
    } catch (error) {
      logger.error('Error fetching .NET EC questions:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get React EC questions
   */
  async getReactEcQuestions(req, res) {
    try {
      logger.info('Fetching React EC questions');
      
      const questions = await this.prescreeningService.getQuestions('app_ec_react_questionnaire');
      
      logger.info('React EC questions fetched successfully:', { count: questions.length });
      
      return res.json(questions);
    } catch (error) {
      logger.error('Error fetching React EC questions:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Angular EC questions
   */
  async getAngularEcQuestions(req, res) {
    try {
      logger.info('Fetching Angular EC questions');
      
      const questions = await this.prescreeningService.getQuestions('app_ec_angular_questionnaire');
      
      logger.info('Angular EC questions fetched successfully:', { count: questions.length });
      
      return res.json(questions);
    } catch (error) {
      logger.error('Error fetching Angular EC questions:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Mendix EC questions
   */
  async getMendixEcQuestions(req, res) {
    try {
      logger.info('Fetching Mendix EC questions');
      
      const questions = await this.prescreeningService.getQuestions('app_ec_mendix_questionnaire');
      
      logger.info('Mendix EC questions fetched successfully:', { count: questions.length });
      
      return res.json(questions);
    } catch (error) {
      logger.error('Error fetching Mendix EC questions:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get DevOps EC questions
   */
  async getDevopsEcQuestions(req, res) {
    try {
      logger.info('Fetching DevOps EC questions');
      
      const questions = await this.prescreeningService.getQuestions('cloud_ec_devops_questionnaire');
      
      logger.info('DevOps EC questions fetched successfully:', { count: questions.length });
      
      return res.json(questions);
    } catch (error) {
      logger.error('Error fetching DevOps EC questions:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get CloudOps EC questions
   */
  async getCloudopsEcQuestions(req, res) {
    try {
      logger.info('Fetching CloudOps EC questions');
      
      const questions = await this.prescreeningService.getQuestions('cloud_ec_cloudops_questionnaire');
      
      logger.info('CloudOps EC questions fetched successfully:', { count: questions.length });
      
      return res.json(questions);
    } catch (error) {
      logger.error('Error fetching CloudOps EC questions:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Platform EC questions
   */
  async getPlatformEcQuestions(req, res) {
    try {
      logger.info('Fetching Platform EC questions');
      
      const questions = await this.prescreeningService.getQuestions('cloud_ec_platform_questionnaire');
      
      logger.info('Platform EC questions fetched successfully:', { count: questions.length });
      
      return res.json(questions);
    } catch (error) {
      logger.error('Error fetching Platform EC questions:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get SRE EC questions
   */
  async getSreEcQuestions(req, res) {
    try {
      logger.info('Fetching SRE EC questions');
      
      const questions = await this.prescreeningService.getQuestions('cloud_ec_sre_questionnaire');
      
      logger.info('SRE EC questions fetched successfully:', { count: questions.length });
      
      return res.json(questions);
    } catch (error) {
      logger.error('Error fetching SRE EC questions:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Submit Java EC feedback
   */
  async submitJavaEcFeedback(req, res) {
    try {
      const feedbackData = req.body;
      
      logger.info('Submitting Java EC feedback for candidate:', feedbackData.candidateEmail);
      
      const result = await this.prescreeningService.submitFeedback(
        feedbackData,
        'app_ec_java_feedback_response'
      );
      
      logger.info('Java EC feedback submitted successfully');
      
      return res.json({ success: true, message: 'Feedback inserted successfully.' });
    } catch (error) {
      logger.error('Error submitting Java EC feedback:', error);
      
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Feedback already submitted for this candidate.' });
      }
      
      return res.status(500).json({ error: 'Failed to insert feedback.' });
    }
  }

  /**
   * Submit .NET EC feedback
   */
  async submitDotnetEcFeedback(req, res) {
    try {
      const feedbackData = req.body;
      
      logger.info('Submitting .NET EC feedback for candidate:', feedbackData.candidateEmail);
      
      const result = await this.prescreeningService.submitFeedback(
        feedbackData,
        'app_ec_dotnet_feedback_response'
      );
      
      logger.info('.NET EC feedback submitted successfully');
      
      return res.json({ success: true, message: 'Feedback inserted successfully.' });
    } catch (error) {
      logger.error('Error submitting .NET EC feedback:', error);
      
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Feedback already submitted for this candidate.' });
      }
      
      return res.status(500).json({ error: 'Failed to insert feedback.' });
    }
  }

  /**
   * Submit React EC feedback
   */
  async submitReactEcFeedback(req, res) {
    try {
      const feedbackData = req.body;
      
      logger.info('Submitting React EC feedback for candidate:', feedbackData.candidateEmail);
      
      const result = await this.prescreeningService.submitFeedback(
        feedbackData,
        'app_ec_react_feedback_response'
      );
      
      logger.info('React EC feedback submitted successfully');
      
      return res.json({ success: true, message: 'Feedback inserted successfully.' });
    } catch (error) {
      logger.error('Error submitting React EC feedback:', error);
      
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Feedback already submitted for this candidate.' });
      }
      
      return res.status(500).json({ error: 'Failed to insert feedback.' });
    }
  }

  /**
   * Submit Angular EC feedback
   */
  async submitAngularEcFeedback(req, res) {
    try {
      const feedbackData = req.body;
      
      logger.info('Submitting Angular EC feedback for candidate:', feedbackData.candidateEmail);
      
      const result = await this.prescreeningService.submitFeedback(
        feedbackData,
        'app_ec_angular_feedback_response'
      );
      
      logger.info('Angular EC feedback submitted successfully');
      
      return res.json({ success: true, message: 'Feedback inserted successfully.' });
    } catch (error) {
      logger.error('Error submitting Angular EC feedback:', error);
      
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Feedback already submitted for this candidate.' });
      }
      
      return res.status(500).json({ error: 'Failed to insert feedback.' });
    }
  }

  /**
   * Submit Mendix EC feedback
   */
  async submitMendixEcFeedback(req, res) {
    try {
      const feedbackData = req.body;
      
      logger.info('Submitting Mendix EC feedback for candidate:', feedbackData.candidateEmail);
      
      const result = await this.prescreeningService.submitFeedback(
        feedbackData,
        'app_ec_mendix_feedback_response'
      );
      
      logger.info('Mendix EC feedback submitted successfully');
      
      return res.json({ success: true, message: 'Feedback inserted successfully.' });
    } catch (error) {
      logger.error('Error submitting Mendix EC feedback:', error);
      
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Feedback already submitted for this candidate.' });
      }
      
      return res.status(500).json({ error: 'Failed to insert feedback.' });
    }
  }

  /**
   * Submit DevOps EC feedback
   */
  async submitDevopsEcFeedback(req, res) {
    try {
      const feedbackData = req.body;
      
      logger.info('Submitting DevOps EC feedback for candidate:', feedbackData.candidateEmail);
      
      const result = await this.prescreeningService.submitFeedback(
        feedbackData,
        'cloud_ec_devops_feedback_response'
      );
      
      logger.info('DevOps EC feedback submitted successfully');
      
      return res.json({ success: true, message: 'Feedback inserted successfully.' });
    } catch (error) {
      logger.error('Error submitting DevOps EC feedback:', error);
      
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Feedback already submitted for this candidate.' });
      }
      
      return res.status(500).json({ error: 'Failed to insert feedback.' });
    }
  }

  /**
   * Submit CloudOps EC feedback
   */
  async submitCloudopsEcFeedback(req, res) {
    try {
      const feedbackData = req.body;
      
      logger.info('Submitting CloudOps EC feedback for candidate:', feedbackData.candidateEmail);
      
      const result = await this.prescreeningService.submitFeedback(
        feedbackData,
        'cloud_ec_cloudops_feedback_response'
      );
      
      logger.info('CloudOps EC feedback submitted successfully');
      
      return res.json({ success: true, message: 'Feedback inserted successfully.' });
    } catch (error) {
      logger.error('Error submitting CloudOps EC feedback:', error);
      
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Feedback already submitted for this candidate.' });
      }
      
      return res.status(500).json({ error: 'Failed to insert feedback.' });
    }
  }

  /**
   * Submit Platform EC feedback
   */
  async submitPlatformEcFeedback(req, res) {
    try {
      const feedbackData = req.body;
      
      logger.info('Submitting Platform EC feedback for candidate:', feedbackData.candidateEmail);
      
      const result = await this.prescreeningService.submitFeedback(
        feedbackData,
        'cloud_ec_platform_feedback_response'
      );
      
      logger.info('Platform EC feedback submitted successfully');
      
      return res.json({ success: true, message: 'Feedback inserted successfully.' });
    } catch (error) {
      logger.error('Error submitting Platform EC feedback:', error);
      
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Feedback already submitted for this candidate.' });
      }
      
      return res.status(500).json({ error: 'Failed to insert feedback.' });
    }
  }

  /**
   * Submit SRE EC feedback
   */
  async submitSreEcFeedback(req, res) {
    try {
      const feedbackData = req.body;
      
      logger.info('Submitting SRE EC feedback for candidate:', feedbackData.candidateEmail);
      
      const result = await this.prescreeningService.submitFeedback(
        feedbackData,
        'cloud_ec_sre_feedback_response'
      );
      
      logger.info('SRE EC feedback submitted successfully');
      
      return res.json({ success: true, message: 'Feedback inserted successfully.' });
    } catch (error) {
      logger.error('Error submitting SRE EC feedback:', error);
      
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Feedback already submitted for this candidate.' });
      }
      
      return res.status(500).json({ error: 'Failed to insert feedback.' });
    }
  }

  // Fullstack Question endpoints
  /**
   * Get Java Angular Fullstack questions
   */
  async getJavaAngularFullstackQuestions(req, res) {
    try {
      logger.info('Fetching Java Angular Fullstack questions');
      
      const questions = await this.prescreeningService.getFullstackQuestions('app_java_angular_l2_feedback_questions');
      
      logger.info('Java Angular Fullstack questions fetched successfully:', { count: questions.length });
      
      return res.json(questions);
    } catch (error) {
      logger.error('Error fetching Java Angular Fullstack questions:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get Java React Fullstack questions
   */
  async getJavaReactFullstackQuestions(req, res) {
    try {
      logger.info('Fetching Java React Fullstack questions');
      
      const questions = await this.prescreeningService.getFullstackQuestions('app_java_react_l2_feedback_questions');
      
      logger.info('Java React Fullstack questions fetched successfully:', { count: questions.length });
      
      return res.json(questions);
    } catch (error) {
      logger.error('Error fetching Java React Fullstack questions:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get .NET Angular Fullstack questions
   */
  async getDotnetAngularFullstackQuestions(req, res) {
    try {
      logger.info('Fetching .NET Angular Fullstack questions');
      
      const questions = await this.prescreeningService.getFullstackQuestions('app_dotnet_angular_l2_feedback_questions');
      
      logger.info('.NET Angular Fullstack questions fetched successfully:', { count: questions.length });
      
      return res.json(questions);
    } catch (error) {
      logger.error('Error fetching .NET Angular Fullstack questions:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Get .NET React Fullstack questions
   */
  async getDotnetReactFullstackQuestions(req, res) {
    try {
      logger.info('Fetching .NET React Fullstack questions');
      
      const questions = await this.prescreeningService.getFullstackQuestions('app_dotnet_react_l2_feedback_questions');
      
      logger.info('.NET React Fullstack questions fetched successfully:', { count: questions.length });
      
      return res.json(questions);
    } catch (error) {
      logger.error('Error fetching .NET React Fullstack questions:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Fullstack Feedback submission endpoints
  /**
   * Submit Java Angular Fullstack feedback
   */
  async submitJavaAngularFullstackFeedback(req, res) {
    try {
      const feedbackData = req.body;
      
      logger.info('Submitting Java Angular Fullstack feedback for candidate:', feedbackData.candidateEmail);
      
      const result = await this.prescreeningService.submitFullstackFeedback(
        feedbackData,
        'app_java_angular_l2_feedback_response'
      );
      
      logger.info('Java Angular Fullstack feedback submitted successfully');
      
      return res.json({ success: true, message: 'Java Angular feedback saved.' });
    } catch (error) {
      logger.error('Error submitting Java Angular Fullstack feedback:', error);
      return res.status(500).json({ error: 'Failed to save Java Angular feedback.' });
    }
  }

  /**
   * Submit Java React Fullstack feedback
   */
  async submitJavaReactFullstackFeedback(req, res) {
    try {
      const feedbackData = req.body;
      
      logger.info('Submitting Java React Fullstack feedback for candidate:', feedbackData.candidateEmail);
      
      const result = await this.prescreeningService.submitFullstackFeedback(
        feedbackData,
        'app_java_react_l2_feedback_response'
      );
      
      logger.info('Java React Fullstack feedback submitted successfully');
      
      return res.json({ success: true, message: 'Java React feedback saved.' });
    } catch (error) {
      logger.error('Error submitting Java React Fullstack feedback:', error);
      return res.status(500).json({ error: 'Failed to save Java React feedback.' });
    }
  }

  /**
   * Submit .NET Angular Fullstack feedback
   */
  async submitDotnetAngularFullstackFeedback(req, res) {
    try {
      const feedbackData = req.body;
      
      logger.info('Submitting .NET Angular Fullstack feedback for candidate:', feedbackData.candidateEmail);
      
      const result = await this.prescreeningService.submitFullstackFeedback(
        feedbackData,
        'app_dotnet_angular_l2_feedback_response'
      );
      
      logger.info('.NET Angular Fullstack feedback submitted successfully');
      
      return res.json({ success: true, message: '.NET Angular feedback saved.' });
    } catch (error) {
      logger.error('Error submitting .NET Angular Fullstack feedback:', error);
      return res.status(500).json({ error: 'Failed to save .NET Angular feedback.' });
    }
  }

  /**
   * Submit .NET React Fullstack feedback
   */
  async submitDotnetReactFullstackFeedback(req, res) {
    try {
      const feedbackData = req.body;
      
      logger.info('Submitting .NET React Fullstack feedback for candidate:', feedbackData.candidateEmail);
      
      const result = await this.prescreeningService.submitFullstackFeedback(
        feedbackData,
        'app_dotnet_react_l2_feedback_response'
      );
      
      logger.info('.NET React Fullstack feedback submitted successfully');
      
      return res.json({ success: true, message: '.NET React feedback saved.' });
    } catch (error) {
      logger.error('Error submitting .NET React Fullstack feedback:', error);
      return res.status(500).json({ error: 'Failed to save .NET React feedback.' });
    }
  }
}

module.exports = new PrescreeningController(); 