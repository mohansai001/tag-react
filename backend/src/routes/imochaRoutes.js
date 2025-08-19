const express = require('express');
const router = express.Router();
const ImochaController = require('../controllers/imochaController');

/**
 * @route   POST /invite-candidate
 * @desc    Invite candidate to iMocha test
 * @access  Public
 */
router.post('/invite-candidate', ImochaController.inviteCandidate.bind(ImochaController));

/**
 * @route   POST /update-candidate-recruitment-phase
 * @desc    Update candidate recruitment phase
 * @access  Public
 */
router.post('/update-candidate-recruitment-phase', ImochaController.updateCandidateRecruitmentPhase.bind(ImochaController));

/**
 * @route   POST /saveRounds
 * @desc    Save recruitment rounds to database
 * @access  Public
 */
router.post('/saveRounds', ImochaController.saveRounds.bind(ImochaController));

/**
 * @route   GET /getRounds
 * @desc    Get recruitment rounds by RRF ID
 * @access  Public
 */
router.get('/getRounds', ImochaController.getRounds.bind(ImochaController));

/**
 * @route   GET /get-next-round
 * @desc    Get next round for candidate
 * @access  Public
 */
router.get('/get-next-round', ImochaController.getNextRound.bind(ImochaController));

/**
 * @route   GET /get-feedbackform
 * @desc    Get feedback form data
 * @access  Public
 */
router.get('/get-feedbackform', ImochaController.getFeedbackForm.bind(ImochaController));

module.exports = router; 