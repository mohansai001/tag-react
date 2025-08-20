// api/server.js
const express = require('express');
const cors = require('cors');

// Import routes directly
const authRoutes = require('../backend/src/routes/authRoutes');
const dashboardRoutes = require('../backend/src/routes/dashboardRoutes');
const resumeAnalysisRoutes = require('../backend/src/routes/resumeAnalysisRoutes');
const prescreeningRoutes = require('../backend/src/routes/prescreeningRoutes');
const imochaRoutes = require('../backend/src/routes/imochaRoutes');
const candidatesRoutes = require('../backend/src/routes/candidatesRoutes');
const panelRoutes = require('../backend/src/routes/panelRoutes');
const l2TechnicalFeedbackRoutes = require('../backend/src/routes/l2TechnicalFeedbackRoutes');
const feedbackRoutes = require('../backend/src/routes/feedbackRoutes');
const finalFeedbackRoutes = require('../backend/src/routes/finalFeedbackRoutes');

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Register routes
app.use('/api', authRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', resumeAnalysisRoutes);
app.use('/api', prescreeningRoutes);
app.use('/api', imochaRoutes);
app.use('/api', candidatesRoutes);
app.use('/api', panelRoutes);
app.use('/api', l2TechnicalFeedbackRoutes);
app.use('/api', feedbackRoutes);
app.use('/api', finalFeedbackRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is working' });
});

module.exports = app;
