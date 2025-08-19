const express = require('express');
const router = express.Router();
const FinalFeedbackController = require('../controllers/finalFeedbackController');

console.log('🔄 Loading Final Feedback routes...');
console.log('📁 Final Feedback routes file loaded successfully');

// Initialize controller
let finalFeedbackController;
try {
  console.log('🔍 Creating FinalFeedbackController instance...');
  finalFeedbackController = new FinalFeedbackController();
  console.log('✅ FinalFeedbackController initialized successfully');
} catch (error) {
  console.error('❌ Error initializing FinalFeedbackController:', error);
  throw error;
}

/**
 * @route   GET /getAllCandidateEmails
 * @desc    Get all shortlisted candidate emails
 * @access  Public
 */
console.log('🔍 Registering GET /getAllCandidateEmails route...');
router.get('/getAllCandidateEmails', finalFeedbackController.getAllCandidateEmails.bind(finalFeedbackController));
console.log('✅ GET /getAllCandidateEmails route registered successfully');

/**
 * @route   GET /final-prescreening
 * @desc    Get comprehensive feedback data for final feedback form
 * @access  Public
 */
console.log('🔍 Registering GET /final-prescreening route...');
router.get('/final-prescreening', finalFeedbackController.getFinalPrescreeningData.bind(finalFeedbackController));
console.log('✅ GET /final-prescreening route registered successfully');

// Test route to verify final feedback routes are working
router.get('/test', (req, res) => {
  console.log('Final Feedback test route accessed');
  res.json({ 
    success: true, 
    message: 'Final Feedback routes are working',
    timestamp: new Date().toISOString()
  });
});

console.log('🎉 Final Feedback routes registration completed!');

module.exports = router; 