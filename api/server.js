// api/server.js
process.env.NODE_ENV = 'production';
const app = require('../backend/src/server');
module.exports = app;

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  res.status(200).json({ success: true, message: 'API working', data: [] });
};
