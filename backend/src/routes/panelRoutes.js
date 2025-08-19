const express = require('express');
const router = express.Router();
const PanelController = require('../controllers/panelController');

console.log('🔄 Loading Panel routes...');
console.log('📁 Panel routes file loaded successfully');

// Initialize controller
let panelController;
try {
  console.log('🔍 Creating PanelController instance...');
  panelController = new PanelController();
  console.log('✅ PanelController initialized successfully');
} catch (error) {
  console.error('❌ Error initializing PanelController:', error);
  throw error;
}

/**
 * @route   GET /panel-candidates-info
 * @desc    Get candidates for panel member by date and email
 * @access  Public
 */
console.log('🔍 Registering GET /panel-candidates-info route...');
router.get('/panel-candidates-info', panelController.getPanelCandidatesInfo.bind(panelController));
console.log('✅ GET /panel-candidates-info route registered successfully');

/**
 * @route   GET /feedback-for-panel-member
 * @desc    Get feedback for panel member by date and email
 * @access  Public
 */
console.log('🔍 Registering GET /feedback-for-panel-member route...');
router.get('/feedback-for-panel-member', panelController.getFeedbackForPanelMember.bind(panelController));
console.log('✅ GET /feedback-for-panel-member route registered successfully');

/**
 * @route   GET /feedback-table
 * @desc    Get feedback from multiple tables for panel member
 * @access  Public
 */
console.log('🔍 Registering GET /feedback-table route...');
router.get('/feedback-table', panelController.getFeedbackTable.bind(panelController));
console.log('✅ GET /feedback-table route registered successfully');

/**
 * @route   POST /get-engcenter-select
 * @desc    Get engineering center and role for candidate
 * @access  Public
 */
console.log('🔍 Registering POST /get-engcenter-select route...');
router.post('/get-engcenter-select', panelController.getEngCenterSelect.bind(panelController));
console.log('✅ POST /get-engcenter-select route registered successfully');

/**
 * @route   GET /hr-candidates-info
 * @desc    Get HR candidates info by date and HR email
 * @access  Public
 */
console.log('🔍 Registering GET /hr-candidates-info route...');
router.get('/hr-candidates-info', panelController.getHrCandidatesInfo.bind(panelController));
console.log('✅ GET /hr-candidates-info route registered successfully');

// Test route to verify panel routes are working
router.get('/test', (req, res) => {
  console.log('Panel test route accessed');
  res.json({ 
    success: true, 
    message: 'Panel routes are working',
    timestamp: new Date().toISOString()
  });
});

console.log('🎉 Panel routes registration completed!');

module.exports = router; 