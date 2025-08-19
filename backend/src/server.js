require('express-async-errors');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');

// Import configurations
const config = require('./config/config');
const logger = require('./config/logger');
const swaggerSpecs = require('./config/swagger');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import database initialization
const db = require('./config/database/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const resumeAnalysisRoutes = require('./routes/resumeAnalysisRoutes');
const prescreeningRoutes = require('./routes/prescreeningRoutes');
const imochaRoutes = require('./routes/imochaRoutes');
const candidatesRoutes = require('./routes/candidatesRoutes');
const panelRoutes = require('./routes/panelRoutes');
const l2TechnicalFeedbackRoutes = require('./routes/l2TechnicalFeedbackRoutes'); // Added
const feedbackRoutes = require('./routes/feedbackRoutes'); // Added
const finalFeedbackRoutes = require('./routes/finalFeedbackRoutes'); // Added

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Compression middleware
app.use(compression());

// CORS configuration
app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration (in-memory for demo)
app.use(session({
  secret: config.session.secret,
  resave: config.session.resave,
  saveUninitialized: config.session.saveUninitialized,
  cookie: config.session.cookie,
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id,
  });
  next();
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbHealth = {
      connected: await db.isConnected(),
      status: await db.isConnected() ? 'connected' : 'disconnected'
    };
    
    res.json({
      success: true,
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      environment: config.server.nodeEnv,
      version: config.swagger.version,
      database: dbHealth
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error.message
    });
  }
});

// Database health endpoint
app.get('/health/database', async (req, res) => {
  try {
    const dbHealth = {
      connected: await db.isConnected(),
      status: await db.isConnected() ? 'connected' : 'disconnected'
    };
    res.json({
      success: true,
      database: dbHealth
    });
  } catch (error) {
    logger.error('Database health check failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: config.swagger.title,
}));

// Direct API routes for compatibility with original HTML
console.log('🔄 Starting API route registration...');
console.log('📋 Routes to register:');
console.log('   - Resume Analysis routes');
console.log('   - Prescreening routes');
console.log('   - iMocha routes');
console.log('   - Candidates routes');
console.log('   - Panel routes');
console.log('   - L2 Technical Feedback routes');
console.log('   - Feedback routes');
console.log('   - Final Feedback routes');
console.log('   - Auth routes');

try {
  console.log('🔍 Loading resumeAnalysisRoutes...');
  app.use('/api', resumeAnalysisRoutes);
  console.log('✅ Resume Analysis routes registered successfully');
} catch (error) {
  console.error('❌ Error registering Resume Analysis routes:', error);
}

try {
  console.log('🔍 Loading prescreeningRoutes...');
  app.use('/api', prescreeningRoutes);
  console.log('✅ Prescreening routes registered successfully');
} catch (error) {
  console.error('❌ Error registering Prescreening routes:', error);
}

try {
  console.log('🔍 Loading imochaRoutes...');
  app.use('/api', imochaRoutes);
  console.log('✅ iMocha routes registered successfully');
} catch (error) {
  console.error('❌ Error registering iMocha routes:', error);
}

try {
  console.log('🔍 Loading candidatesRoutes...');
  app.use('/api', candidatesRoutes);
  console.log('✅ Candidates routes registered successfully');
} catch (error) {
  console.error('❌ Error registering Candidates routes:', error);
}

try {
  console.log('🔍 Loading panelRoutes...');
  app.use('/api', panelRoutes);
  console.log('✅ Panel routes registered successfully');
} catch (error) {
  console.error('❌ Error registering Panel routes:', error);
}

try {
  console.log('🔍 Loading l2TechnicalFeedbackRoutes...');
  app.use('/api', l2TechnicalFeedbackRoutes);
  console.log('✅ L2 Technical Feedback routes registered successfully');
} catch (error) {
  console.error('❌ Error registering L2 Technical Feedback routes:', error);
}

try {
  console.log('🔍 Loading feedbackRoutes...');
  app.use('/api', feedbackRoutes);
  console.log('✅ Feedback routes registered successfully');
} catch (error) {
  console.error('❌ Error registering Feedback routes:', error);
}

try {
  console.log('🔍 Loading finalFeedbackRoutes...');
  app.use('/api', finalFeedbackRoutes);
  console.log('✅ Final Feedback routes registered successfully');
} catch (error) {
  console.error('❌ Error registering Final Feedback routes:', error);
}

try {
  console.log('🔍 Loading authRoutes...');
app.use('/api', authRoutes);
  console.log('✅ Auth routes registered successfully');
} catch (error) {
  console.error('❌ Error registering Auth routes:', error);
}

console.log('🎉 All API routes registration completed!');

// Test route to verify API routing is working
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API routing is working',
    timestamp: new Date().toISOString()
  });
});

// Versioned API routes
app.use(`/api/${config.server.apiVersion}/auth`, authRoutes);
//app.use(`/api/${config.server.apiVersion}/candidates`, candidateRoutes);
app.use(`/api/${config.server.apiVersion}/dashboard`, dashboardRoutes);
app.use(`/api/${config.server.apiVersion}/resume-analysis`, resumeAnalysisRoutes);

// Debug route to catch any unmatched API routes (moved to very end)
app.use('/api/*', (req, res) => {
  console.log(`🚨 UNMATCHED API ROUTE: ${req.method} ${req.originalUrl}`);
  console.log(`🔍 Request details:`);
  console.log(`   - Method: ${req.method}`);
  console.log(`   - URL: ${req.originalUrl}`);
  console.log(`   - Path: ${req.path}`);
  console.log(`   - Query:`, req.query);
  console.log(`   - Headers:`, req.headers);
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// 404 handler
app.use('*', notFound);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const isConnected = await db.isConnected();
    if (isConnected) {
    logger.info('Database connection established successfully');
    } else {
      logger.error('Database connection failed');
      throw new Error('Database connection failed');
    }

    const server = app.listen(config.server.port, () => {
      logger.info(`🚀 Server running on port ${config.server.port}`);
      logger.info(`📚 API Documentation: http://localhost:${config.server.port}/api-docs`);
      logger.info(`🏥 Health Check: http://localhost:${config.server.port}/health`);
      logger.info(`🌍 Environment: ${config.server.nodeEnv}`);
      logger.info(`💾 Database: Connected to PostgreSQL`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      logger.info(`Received ${signal}. Starting graceful shutdown...`);
      
      server.close(async () => {
        logger.info('HTTP server closed');
        
        // Close database connection
        try {
          await db.close();
          logger.info('Database connection closed');
        } catch (error) {
          logger.error('Error closing database connection:', error);
        }
        
        process.exit(0);
      });

      // Force close after 10 seconds
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Export app for testing
module.exports = app;

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  startServer();
} 