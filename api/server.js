// api/server.js
const express = require('express');
const cors = require('cors');

const app = express();

// CORS configuration
app.use(cors({
  origin: ['https://demotag.vercel.app', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is working' });
});

// Mock endpoints to prevent 500 errors
app.get('/api/get-shortlisted-candidates', (req, res) => {
  res.json({ success: true, data: [] });
});

app.get('/api/getAllCandidateEmails', (req, res) => {
  res.json({ success: true, emails: [] });
});

// Catch all API routes
app.use('/api/*', (req, res) => {
  res.json({ success: true, message: 'API endpoint not implemented yet', data: [] });
});

module.exports = app;
