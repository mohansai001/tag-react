const express = require('express');
const router = express.Router();
console.log('Loading prescreening routes...');
const PrescreeningController = require('../controllers/prescreeningController');
console.log('PrescreeningController loaded successfully');

/**
 * @route   GET /getAllCandidateEmails
 * @desc    Get all candidate emails
 * @access  Public
 */
router.get('/getAllCandidateEmails', PrescreeningController.getAllCandidateEmails.bind(PrescreeningController));

/**
 * @route   GET /getCandidateData
 * @desc    Get candidate data by email
 * @access  Public
 */
router.get('/getCandidateData', PrescreeningController.getCandidateData.bind(PrescreeningController));

// Question endpoints for different EC types
/**
 * @route   GET /java_ec_questions
 * @desc    Get Java EC questions
 * @access  Public
 */
router.get('/java_ec_questions', PrescreeningController.getJavaEcQuestions.bind(PrescreeningController));

/**
 * @route   GET /dotnet_ec_questions
 * @desc    Get .NET EC questions
 * @access  Public
 */
router.get('/dotnet_ec_questions', PrescreeningController.getDotnetEcQuestions.bind(PrescreeningController));

/**
 * @route   GET /react_ec_questions
 * @desc    Get React EC questions
 * @access  Public
 */
router.get('/react_ec_questions', PrescreeningController.getReactEcQuestions.bind(PrescreeningController));

/**
 * @route   GET /angular_ec_questions
 * @desc    Get Angular EC questions
 * @access  Public
 */
router.get('/angular_ec_questions', PrescreeningController.getAngularEcQuestions.bind(PrescreeningController));

/**
 * @route   GET /mendix_ec_questions
 * @desc    Get Mendix EC questions
 * @access  Public
 */
router.get('/mendix_ec_questions', PrescreeningController.getMendixEcQuestions.bind(PrescreeningController));

/**
 * @route   GET /devops_ec_questions
 * @desc    Get DevOps EC questions
 * @access  Public
 */
router.get('/devops_ec_questions', PrescreeningController.getDevopsEcQuestions.bind(PrescreeningController));

/**
 * @route   GET /cloudops_ec_questions
 * @desc    Get CloudOps EC questions
 * @access  Public
 */
router.get('/cloudops_ec_questions', PrescreeningController.getCloudopsEcQuestions.bind(PrescreeningController));

/**
 * @route   GET /platform_ec_questions
 * @desc    Get Platform EC questions
 * @access  Public
 */
router.get('/platform_ec_questions', PrescreeningController.getPlatformEcQuestions.bind(PrescreeningController));

/**
 * @route   GET /sre_ec_questions
 * @desc    Get SRE EC questions
 * @access  Public
 */
router.get('/sre_ec_questions', PrescreeningController.getSreEcQuestions.bind(PrescreeningController));

// Feedback submission endpoints for different EC types
/**
 * @route   POST /java_ec_submit-feedback
 * @desc    Submit Java EC feedback
 * @access  Public
 */
router.post('/java_ec_submit-feedback', PrescreeningController.submitJavaEcFeedback.bind(PrescreeningController));

/**
 * @route   POST /dotnet_ec_submit-feedback
 * @desc    Submit .NET EC feedback
 * @access  Public
 */
router.post('/dotnet_ec_submit-feedback', PrescreeningController.submitDotnetEcFeedback.bind(PrescreeningController));

/**
 * @route   POST /react_ec_submit-feedback
 * @desc    Submit React EC feedback
 * @access  Public
 */
router.post('/react_ec_submit-feedback', PrescreeningController.submitReactEcFeedback.bind(PrescreeningController));

/**
 * @route   POST /angular_ec_submit-feedback
 * @desc    Submit Angular EC feedback
 * @access  Public
 */
router.post('/angular_ec_submit-feedback', PrescreeningController.submitAngularEcFeedback.bind(PrescreeningController));

/**
 * @route   POST /mendix_ec_submit-feedback
 * @desc    Submit Mendix EC feedback
 * @access  Public
 */
router.post('/mendix_ec_submit-feedback', PrescreeningController.submitMendixEcFeedback.bind(PrescreeningController));

/**
 * @route   POST /devops_ec_submit-feedback
 * @desc    Submit DevOps EC feedback
 * @access  Public
 */
router.post('/devops_ec_submit-feedback', PrescreeningController.submitDevopsEcFeedback.bind(PrescreeningController));

/**
 * @route   POST /cloudops_ec_submit-feedback
 * @desc    Submit CloudOps EC feedback
 * @access  Public
 */
router.post('/cloudops_ec_submit-feedback', PrescreeningController.submitCloudopsEcFeedback.bind(PrescreeningController));

/**
 * @route   POST /platform_ec_submit-feedback
 * @desc    Submit Platform EC feedback
 * @access  Public
 */
router.post('/platform_ec_submit-feedback', PrescreeningController.submitPlatformEcFeedback.bind(PrescreeningController));

/**
 * @route   POST /sre_ec_submit-feedback
 * @desc    Submit SRE EC feedback
 * @access  Public
 */
router.post('/sre_ec_submit-feedback', PrescreeningController.submitSreEcFeedback.bind(PrescreeningController));

// Fullstack Question endpoints
/**
 * @route   GET /java_angular_fullstack_questions
 * @desc    Get Java Angular Fullstack questions
 * @access  Public
 */
router.get('/java_angular_fullstack_questions', PrescreeningController.getJavaAngularFullstackQuestions.bind(PrescreeningController));

/**
 * @route   GET /java_react_fullstack_questions
 * @desc    Get Java React Fullstack questions
 * @access  Public
 */
router.get('/java_react_fullstack_questions', PrescreeningController.getJavaReactFullstackQuestions.bind(PrescreeningController));

/**
 * @route   GET /dotnet_angular_fullstack_questions
 * @desc    Get .NET Angular Fullstack questions
 * @access  Public
 */
router.get('/dotnet_angular_fullstack_questions', PrescreeningController.getDotnetAngularFullstackQuestions.bind(PrescreeningController));

/**
 * @route   GET /dotnet_react_fullstack_questions
 * @desc    Get .NET React Fullstack questions
 * @access  Public
 */
router.get('/dotnet_react_fullstack_questions', PrescreeningController.getDotnetReactFullstackQuestions.bind(PrescreeningController));

// Fullstack Feedback submission endpoints
/**
 * @route   POST /java_angular_fullstack_submit-feedback
 * @desc    Submit Java Angular Fullstack feedback
 * @access  Public
 */
router.post('/java_angular_fullstack_submit-feedback', PrescreeningController.submitJavaAngularFullstackFeedback.bind(PrescreeningController));

/**
 * @route   POST /java_react_fullstack_submit-feedback
 * @desc    Submit Java React Fullstack feedback
 * @access  Public
 */
router.post('/java_react_fullstack_submit-feedback', PrescreeningController.submitJavaReactFullstackFeedback.bind(PrescreeningController));

/**
 * @route   POST /dotnet_angular_fullstack_submit-feedback
 * @desc    Submit .NET Angular Fullstack feedback
 * @access  Public
 */
router.post('/dotnet_angular_fullstack_submit-feedback', PrescreeningController.submitDotnetAngularFullstackFeedback.bind(PrescreeningController));

/**
 * @route   POST /dotnet_react_fullstack_submit-feedback
 * @desc    Submit .NET React Fullstack feedback
 * @access  Public
 */
router.post('/dotnet_react_fullstack_submit-feedback', PrescreeningController.submitDotnetReactFullstackFeedback.bind(PrescreeningController));

module.exports = router; 