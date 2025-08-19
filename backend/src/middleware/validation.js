const { validationResult, body, param } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      })),
    });
  }
  
  next();
};

// Sanitize request data
const sanitize = (req, res, next) => {
  // Remove extra spaces from string fields
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }
  
  next();
};

// Validation rules for login endpoints
const validateLoginDetails = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('name')
    .isLength({ min: 1, max: 255 })
    .withMessage('Name is required and must be less than 255 characters')
    .trim(),
  body('date')
    .isISO8601()
    .withMessage('Please provide a valid date in YYYY-MM-DD format'),
  body('time')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    .withMessage('Please provide a valid time in HH:MM:SS format'),
];

const validateAdminLogin = [
  body('username')
    .isLength({ min: 1, max: 50 })
    .withMessage('Username is required and must be less than 50 characters')
    .trim(),
  body('password')
    .isLength({ min: 1, max: 50 })
    .withMessage('Password is required and must be less than 50 characters'),
];

const validateCheckAdmin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
];

const validateUserProfile = [
  param('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
];

module.exports = {
  validate,
  sanitize,
  validateLoginDetails,
  validateAdminLogin,
  validateCheckAdmin,
  validateUserProfile,
}; 