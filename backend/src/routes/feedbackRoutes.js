const express = require('express');
const router = express.Router();
const FeedbackController = require('../controllers/feedbackController');

console.log('🔄 Loading Feedback routes...');
console.log('📁 Feedback routes file loaded successfully');

// Initialize controller
let feedbackController;
try {
  console.log('🔍 Creating FeedbackController instance...');
  feedbackController = new FeedbackController();
  console.log('✅ FeedbackController initialized successfully');
} catch (error) {
  console.error('❌ Error initializing FeedbackController:', error);
  throw error;
}

/**
 * @route   GET /get-feedbackform
 * @desc    Get feedback form data by candidate email and round details
 * @access  Public
 */
console.log('🔍 Registering GET /get-feedbackform route...');
router.get('/get-feedbackform', feedbackController.getFeedbackForm.bind(feedbackController));
console.log('✅ GET /get-feedbackform route registered successfully');

/**
 * @route   POST /submitFeedback
 * @desc    Submit feedback form data
 * @access  Public
 */
console.log('🔍 Registering POST /submitFeedback route...');
router.post('/submitFeedback', feedbackController.submitFeedback.bind(feedbackController));
console.log('✅ POST /submitFeedback route registered successfully');

// Test route to verify feedback routes are working
router.get('/test', (req, res) => {
  console.log('Feedback test route accessed');
  res.json({ 
    success: true, 
    message: 'Feedback routes are working',
    timestamp: new Date().toISOString()
  });
});

console.log('🎉 Feedback routes registration completed!');

module.exports = router; 