// api/server.js
// Set environment to prevent server startup
process.env.NODE_ENV = 'production';

// Import the main backend server
const app = require('../backend/src/server');

module.exports = app;
