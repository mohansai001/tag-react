const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: ['https://demotag.vercel.app', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Try to import routes with error handling
try {
  const candidatesRoutes = require('../backend/src/routes/candidatesRoutes');
  app.use('/api', candidatesRoutes);
} catch (error) {
  console.log('candidatesRoutes not available:', error.message);
}

try {
  const dashboardRoutes = require('../backend/src/routes/dashboardRoutes');
  app.use('/api', dashboardRoutes);
} catch (error) {
  console.log('dashboardRoutes not available:', error.message);
}

// Fallback endpoints
app.get('/api/get-shortlisted-candidates', (req, res) => {
  res.json({ success: true, data: [] });
});

app.get('/api/getAllCandidateEmails', (req, res) => {
  res.json({ success: true, emails: [] });
});

app.use('/api/*', (req, res) => {
  res.json({ success: true, message: 'Endpoint not implemented', data: [] });
});

module.exports = app;
