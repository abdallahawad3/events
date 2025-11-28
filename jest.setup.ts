// Mock environment variables for tests
process.env.MONGODB_URI = 'mongodb://localhost:27017/test-db';

// Suppress console errors during tests (optional)
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};