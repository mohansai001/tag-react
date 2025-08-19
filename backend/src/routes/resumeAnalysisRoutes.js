const express = require('express');
const router = express.Router();
const ResumeAnalysisController = require('../controllers/resumeAnalysisController');

// Debug middleware to log all requests to this router
router.use((req, res, next) => {
  console.log(`ResumeAnalysis Route: ${req.method} ${req.path}`);
  next();
});

// Debug route to test if this router is being reached
router.get('/test', (req, res) => {
  res.json({ message: 'ResumeAnalysis routes are working!' });
});

/**
 * @route   POST /add-candidate-info
 * @desc    Add candidate information to database
 * @access  Public
 */
router.post('/add-candidate-info', ResumeAnalysisController.addCandidateInfo.bind(ResumeAnalysisController));

/**
 * @route   GET /get/candidate-info
 * @desc    Get all candidate information
 * @access  Public
 */
router.get('/get/candidate-info', ResumeAnalysisController.getCandidateInfo.bind(ResumeAnalysisController));

/**
 * @route   GET /get/candidate-evaluation/:id
 * @desc    Get specific candidate evaluation by ID
 * @access  Public
 */
router.get('/get/candidate-evaluation/:id', ResumeAnalysisController.getCandidateEvaluation.bind(ResumeAnalysisController));

module.exports = router; 