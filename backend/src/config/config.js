const path = require('path');
const fs = require('fs');

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV ? `env.${process.env.NODE_ENV}` : 'env.development';
const envPath = path.join(__dirname, '..', '..', envFile);

if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
} else {
  require('dotenv').config();
}

const config = {
  // Server Configuration
  server: {
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
    apiVersion: process.env.API_VERSION || 'v1',
    baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3001}`,
  },

  // Database Configuration
  database: {
    url: process.env.DATABASE_URL || 'postgresql://retool:4zBLlh1TPsAu@ep-frosty-pine-a6aqfk20.us-west-2.retooldb.com/retool?sslmode=require',
  },

  // Session Configuration
  session: {
    secret: process.env.SESSION_SECRET || 'your-session-secret-key',
    cookie: {
      secure: process.env.SESSION_COOKIE_SECURE === 'true',
      httpOnly: process.env.SESSION_COOKIE_HTTPONLY === 'true',
      maxAge: parseInt(process.env.SESSION_COOKIE_MAX_AGE, 10) || 86400000,
    },
    resave: false,
    saveUninitialized: false,
  },

  // Email Configuration
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    user: process.env.SMTP_USER || 'your-email@gmail.com',
    pass: process.env.SMTP_PASS || 'your-app-password',
    from: process.env.EMAIL_FROM || 'noreply@tagreact.com',
  },

  // MSAL Configuration
  msal: {
    clientId: process.env.MSAL_CLIENT_ID || 'your-msal-client-id',
    clientSecret: process.env.MSAL_CLIENT_SECRET || 'your-msal-client-secret',
    tenantId: process.env.MSAL_TENANT_ID || 'your-msal-tenant-id',
    redirectUri: process.env.MSAL_REDIRECT_URI || 'http://localhost:3000/auth/callback',
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  },

  // File Upload
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 10485760,
    uploadPath: process.env.UPLOAD_PATH || 'uploads/',
  },

  // Swagger Configuration
  swagger: {
    title: process.env.SWAGGER_TITLE || 'TAG React API',
    version: process.env.SWAGGER_VERSION || '1.0.0',
    description: process.env.SWAGGER_DESCRIPTION || 'API documentation for TAG React application',
  },

  // Retry Configuration
  retry: {
    attempts: parseInt(process.env.RETRY_ATTEMPTS, 10) || 3,
    delay: parseInt(process.env.RETRY_DELAY, 10) || 1000,
    backoffMultiplier: parseInt(process.env.RETRY_BACKOFF_MULTIPLIER, 10) || 2,
  },

  // Security Configuration
  security: {
    // MSAL authentication only - no password requirements
  },
};

module.exports = config; 