// Jest setup file for backend tests
process.env.NODE_ENV = 'test';

// Mock environment variables for testing
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
process.env.SESSION_SECRET = 'test-session-secret';
process.env.PORT = 3001;

// Global test timeout
jest.setTimeout(10000);

// Suppress console logs during tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}; 