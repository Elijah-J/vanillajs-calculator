module.exports = {
  // Test environment
  testEnvironment: 'node',
  
  // Setup files
  setupFilesAfterEnv: [
    '<rootDir>/src/__tests__/visual-regression/setup.js'
  ],
  
  // Test match patterns
  testMatch: [
    '**/src/__tests__/**/*.test.js'
  ],
  
  // Transform files
  transform: {},
  
  // Module paths
  moduleDirectories: ['node_modules', 'src'],
  
  // Coverage
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/__tests__/**',
  ],
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ],
  
  // Global timeout for visual tests
  testTimeout: 30000,
  
  // Verbose output
  verbose: true,
};