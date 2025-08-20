module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  res.status(200).json({ success: true, message: 'API working', data: [] });
};


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

app.get('/api/getCandidateData', (req, res) => {
  res.json({ success: true, data: {} });
});

app.get('/api/final-prescreening', (req, res) => {
  res.json({ success: true, prescreening: {}, feedback: [], l2Technical: {} });
});

// Catch all API routes
app.use('/api/*', (req, res) => {
  res.json({ success: true, message: 'API endpoint not implemented yet', data: [] });
});

module.exports = app;
