const express = require('express');
const router = express.Router();
console.log('Loading candidates routes...');
const CandidatesController = require('../controllers/candidatesController');
console.log('CandidatesController loaded successfully');

// Create an instance of the controller
const candidatesController = new CandidatesController();
console.log('CandidatesController instance created');

// Test route to verify candidates routes are working
router.get('/test', (req, res) => {
  console.log('Candidates test route accessed');
  res.json({ 
    success: true, 
    message: 'Candidates routes are working',
    timestamp: new Date().toISOString()
  });
});

// Test route to verify update-status route exists
router.get('/test-update-status', (req, res) => {
  console.log('Update status test route accessed');
  res.json({ 
    success: true, 
    message: 'Update status route exists',
    timestamp: new Date().toISOString()
  });
});

/**
 * @route   GET /get-shortlisted-candidates
 * @desc    Get shortlisted candidates with updated scores and statuses
 * @access  Public
 */
router.get('/get-shortlisted-candidates', candidatesController.getShortlistedCandidates.bind(candidatesController));

/**
 * @route   GET /get-email-status
 * @desc    Get email status for a candidate
 * @access  Public
 */
router.get('/get-email-status', candidatesController.getEmailStatus.bind(candidatesController));

/**
 * @route   POST /update-email-status
 * @desc    Update email status for a candidate
 * @access  Public
 */
router.post('/update-email-status', candidatesController.updateEmailStatus.bind(candidatesController));

/**
 * @route   GET /get-panel-emails
 * @desc    Get panel emails by domain
 * @access  Public
 */
router.get('/get-panel-emails', candidatesController.getPanelEmails.bind(candidatesController));

/**
 * @route   POST /callTestAttempts/:ecType
 * @desc    Process test attempts for different EC types (cloudEC, dataEC, appEC)
 * @access  Public
 */
router.post('/callTestAttempts/:ecType', candidatesController.processTestAttempts.bind(candidatesController));

/**
 * @route   POST /updateCandidateFeedback
 * @desc    Update candidate feedback
 * @access  Public
 */
router.post('/updateCandidateFeedback', candidatesController.updateCandidateFeedback.bind(candidatesController));

/**
 * @route   PUT /update-status
 * @desc    Update candidate status for interview scheduling
 * @access  Public
 */
router.put('/update-status', (req, res, next) => {
  console.log('Update status route accessed:', req.method, req.originalUrl);
  console.log('Request body:', req.body);
  candidatesController.updateCandidateStatus.bind(candidatesController)(req, res, next);
});

console.log('✓ PUT /update-status route registered');

module.exports = router; 