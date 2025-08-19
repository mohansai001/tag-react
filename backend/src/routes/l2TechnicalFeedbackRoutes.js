const express = require('express');
const router = express.Router();
const L2TechnicalFeedbackController = require('../controllers/l2TechnicalFeedbackController');

console.log('🔄 Loading L2 Technical Feedback routes...');
console.log('📁 L2 Technical Feedback routes file loaded successfully');

// Initialize controller
let l2TechnicalFeedbackController;
try {
  console.log('🔍 Creating L2TechnicalFeedbackController instance...');
  l2TechnicalFeedbackController = new L2TechnicalFeedbackController();
  console.log('✅ L2TechnicalFeedbackController initialized successfully');
} catch (error) {
  console.error('❌ Error initializing L2TechnicalFeedbackController:', error);
  throw error;
}

/**
 * @route   GET /getCandidateData
 * @desc    Get candidate data by email
 * @access  Public
 */
console.log('🔍 Registering GET /getCandidateData route...');
router.get('/getCandidateData', l2TechnicalFeedbackController.getCandidateData.bind(l2TechnicalFeedbackController));
console.log('✅ GET /getCandidateData route registered successfully');

/**
 * @route   GET /feedback-questions
 * @desc    Get feedback questions for a specific position
 * @access  Public
 */
console.log('🔍 Registering GET /feedback-questions route...');
router.get('/feedback-questions', l2TechnicalFeedbackController.getFeedbackQuestions.bind(l2TechnicalFeedbackController));
console.log('✅ GET /feedback-questions route registered successfully');

/**
 * @route   POST /submit-feedback
 * @desc    Submit feedback for a candidate
 * @access  Public
 */
console.log('🔍 Registering POST /submit-feedback route...');
router.post('/submit-feedback', l2TechnicalFeedbackController.submitFeedback.bind(l2TechnicalFeedbackController));
console.log('✅ POST /submit-feedback route registered successfully');

/**
 * @route   GET /get-feedback/:candidateId/:position
 * @desc    Get existing feedback for a candidate
 * @access  Public
 */
console.log('🔍 Registering GET /get-feedback/:candidateId/:position route...');
router.get('/get-feedback/:candidateId/:position', l2TechnicalFeedbackController.getExistingFeedback.bind(l2TechnicalFeedbackController));
console.log('✅ GET /get-feedback/:candidateId/:position route registered successfully');

/**
 * @route   GET /dotnet_feedback-questions
 * @desc    Get .NET feedback questions
 * @access  Public
 */
console.log('🔍 Registering GET /dotnet_feedback-questions route...');
router.get('/dotnet_feedback-questions', l2TechnicalFeedbackController.getDotnetFeedbackQuestions.bind(l2TechnicalFeedbackController));
console.log('✅ GET /dotnet_feedback-questions route registered successfully');

/**
 * @route   GET /java_feedback-questions
 * @desc    Get Java feedback questions
 * @access  Public
 */
console.log('🔍 Registering GET /java_feedback-questions route...');
router.get('/java_feedback-questions', l2TechnicalFeedbackController.getJavaFeedbackQuestions.bind(l2TechnicalFeedbackController));
console.log('✅ GET /java_feedback-questions route registered successfully');

/**
 * @route   GET /angular_feedback-questions
 * @desc    Get Angular feedback questions
 * @access  Public
 */
console.log('🔍 Registering GET /angular_feedback-questions route...');
router.get('/angular_feedback-questions', l2TechnicalFeedbackController.getAngularFeedbackQuestions.bind(l2TechnicalFeedbackController));
console.log('✅ GET /angular_feedback-questions route registered successfully');

/**
 * @route   GET /react_feedback-questions
 * @desc    Get React feedback questions
 * @access  Public
 */
console.log('🔍 Registering GET /react_feedback-questions route...');
router.get('/react_feedback-questions', l2TechnicalFeedbackController.getReactFeedbackQuestions.bind(l2TechnicalFeedbackController));
console.log('✅ GET /react_feedback-questions route registered successfully');

/**
 * @route   POST /dotnet_submit-feedback
 * @desc    Submit .NET feedback
 * @access  Public
 */
console.log('🔍 Registering POST /dotnet_submit-feedback route...');
router.post('/dotnet_submit-feedback', l2TechnicalFeedbackController.submitDotnetFeedback.bind(l2TechnicalFeedbackController));
console.log('✅ POST /dotnet_submit-feedback route registered successfully');

/**
 * @route   POST /java_submit-feedback
 * @desc    Submit Java feedback
 * @access  Public
 */
console.log('🔍 Registering POST /java_submit-feedback route...');
router.post('/java_submit-feedback', l2TechnicalFeedbackController.submitJavaFeedback.bind(l2TechnicalFeedbackController));
console.log('✅ POST /java_submit-feedback route registered successfully');

/**
 * @route   POST /angular_submit-feedback
 * @desc    Submit Angular feedback
 * @access  Public
 */
console.log('🔍 Registering POST /angular_submit-feedback route...');
router.post('/angular_submit-feedback', l2TechnicalFeedbackController.submitAngularFeedback.bind(l2TechnicalFeedbackController));
console.log('✅ POST /angular_submit-feedback route registered successfully');

/**
 * @route   POST /react_submit-feedback
 * @desc    Submit React feedback
 * @access  Public
 */
console.log('🔍 Registering POST /react_submit-feedback route...');
router.post('/react_submit-feedback', l2TechnicalFeedbackController.submitReactFeedback.bind(l2TechnicalFeedbackController));
console.log('✅ POST /react_submit-feedback route registered successfully');

// Fullstack routes
/**
 * @route   GET /java_angular_fullstack_feedback-questions
 * @desc    Get Java Angular Fullstack feedback questions
 * @access  Public
 */
console.log('🔍 Registering GET /java_angular_fullstack_feedback-questions route...');
router.get('/java_angular_fullstack_feedback-questions', (req, res) => {
  req.query.position = 'java_angular_fullstack';
  l2TechnicalFeedbackController.getFeedbackQuestions(req, res);
});
console.log('✅ GET /java_angular_fullstack_feedback-questions route registered successfully');

/**
 * @route   GET /java_react_fullstack_feedback-questions
 * @desc    Get Java React Fullstack feedback questions
 * @access  Public
 */
console.log('🔍 Registering GET /java_react_fullstack_feedback-questions route...');
router.get('/java_react_fullstack_feedback-questions', (req, res) => {
  req.query.position = 'java_react_fullstack';
  l2TechnicalFeedbackController.getFeedbackQuestions(req, res);
});
console.log('✅ GET /java_react_fullstack_feedback-questions route registered successfully');

/**
 * @route   GET /dotnet_angular_fullstack_feedback-questions
 * @desc    Get .NET Angular Fullstack feedback questions
 * @access  Public
 */
console.log('🔍 Registering GET /dotnet_angular_fullstack_feedback-questions route...');
router.get('/dotnet_angular_fullstack_feedback-questions', (req, res) => {
  req.query.position = 'dotnet_angular_fullstack';
  l2TechnicalFeedbackController.getFeedbackQuestions(req, res);
});
console.log('✅ GET /dotnet_angular_fullstack_feedback-questions route registered successfully');

/**
 * @route   GET /dotnet_react_fullstack_feedback-questions
 * @desc    Get .NET React Fullstack feedback questions
 * @access  Public
 */
console.log('🔍 Registering GET /dotnet_react_fullstack_feedback-questions route...');
router.get('/dotnet_react_fullstack_feedback-questions', (req, res) => {
  req.query.position = 'dotnet_react_fullstack';
  l2TechnicalFeedbackController.getFeedbackQuestions(req, res);
});
console.log('✅ GET /dotnet_react_fullstack_feedback-questions route registered successfully');

/**
 * @route   POST /java_angular_fullstack_submit-feedback
 * @desc    Submit Java Angular Fullstack feedback
 * @access  Public
 */
console.log('🔍 Registering POST /java_angular_fullstack_submit-feedback route...');
router.post('/java_angular_fullstack_submit-feedback', (req, res) => {
  req.body.position = 'java_angular_fullstack';
  l2TechnicalFeedbackController.submitFeedback(req, res);
});
console.log('✅ POST /java_angular_fullstack_submit-feedback route registered successfully');

/**
 * @route   POST /java_react_fullstack_submit-feedback
 * @desc    Submit Java React Fullstack feedback
 * @access  Public
 */
console.log('🔍 Registering POST /java_react_fullstack_submit-feedback route...');
router.post('/java_react_fullstack_submit-feedback', (req, res) => {
  req.body.position = 'java_react_fullstack';
  l2TechnicalFeedbackController.submitFeedback(req, res);
});
console.log('✅ POST /java_react_fullstack_submit-feedback route registered successfully');

/**
 * @route   POST /dotnet_angular_fullstack_submit-feedback
 * @desc    Submit .NET Angular Fullstack feedback
 * @access  Public
 */
console.log('🔍 Registering POST /dotnet_angular_fullstack_submit-feedback route...');
router.post('/dotnet_angular_fullstack_submit-feedback', (req, res) => {
  req.body.position = 'dotnet_angular_fullstack';
  l2TechnicalFeedbackController.submitFeedback(req, res);
});
console.log('✅ POST /dotnet_angular_fullstack_submit-feedback route registered successfully');

/**
 * @route   POST /dotnet_react_fullstack_submit-feedback
 * @desc    Submit .NET React Fullstack feedback
 * @access  Public
 */
console.log('🔍 Registering POST /dotnet_react_fullstack_submit-feedback route...');
router.post('/dotnet_react_fullstack_submit-feedback', (req, res) => {
  req.body.position = 'dotnet_react_fullstack';
  l2TechnicalFeedbackController.submitFeedback(req, res);
});
console.log('✅ POST /dotnet_react_fullstack_submit-feedback route registered successfully');

// Generic routes
/**
 * @route   GET /app_generic_feedback-questions
 * @desc    Get generic feedback questions
 * @access  Public
 */
console.log('🔍 Registering GET /app_generic_feedback-questions route...');
router.get('/app_generic_feedback-questions', (req, res) => {
  req.query.position = 'generic';
  l2TechnicalFeedbackController.getFeedbackQuestions(req, res);
});
console.log('✅ GET /app_generic_feedback-questions route registered successfully');

/**
 * @route   POST /app_generic_submit-feedback
 * @desc    Submit generic feedback
 * @access  Public
 */
console.log('🔍 Registering POST /app_generic_submit-feedback route...');
router.post('/app_generic_submit-feedback', (req, res) => {
  req.body.position = 'generic';
  l2TechnicalFeedbackController.submitFeedback(req, res);
});
console.log('✅ POST /app_generic_submit-feedback route registered successfully');

// Test route
console.log('🔍 Registering GET /test route...');
router.get('/test', (req, res) => {
  console.log('L2 Technical Feedback test route accessed');
  res.json({ 
    success: true, 
    message: 'L2 Technical Feedback routes are working',
    timestamp: new Date().toISOString()
  });
});
console.log('✅ GET /test route registered successfully');

console.log('🎉 All L2 Technical Feedback routes registered successfully!');
console.log('📋 L2 Technical Feedback routes summary:');
console.log('   - GET /feedback-questions');
console.log('   - POST /submit-feedback');
console.log('   - GET /get-feedback/:candidateId/:position');
console.log('   - GET /dotnet_feedback-questions');
console.log('   - GET /java_feedback-questions');
console.log('   - GET /angular_feedback-questions');
console.log('   - GET /react_feedback-questions');
console.log('   - POST /dotnet_submit-feedback');
console.log('   - POST /java_submit-feedback');
console.log('   - POST /angular_submit-feedback');
console.log('   - POST /react_submit-feedback');
console.log('   - GET /java_angular_fullstack_feedback-questions');
console.log('   - GET /java_react_fullstack_feedback-questions');
console.log('   - GET /dotnet_angular_fullstack_feedback-questions');
console.log('   - GET /dotnet_react_fullstack_feedback-questions');
console.log('   - POST /java_angular_fullstack_submit-feedback');
console.log('   - POST /java_react_fullstack_submit-feedback');
console.log('   - POST /dotnet_angular_fullstack_submit-feedback');
console.log('   - POST /dotnet_react_fullstack_submit-feedback');
console.log('   - GET /app_generic_feedback-questions');
console.log('   - POST /app_generic_submit-feedback');
console.log('   - GET /test');

module.exports = router; 