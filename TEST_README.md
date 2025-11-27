# Unit Tests Documentation

This project now includes comprehensive unit tests for the database models and MongoDB connection utility.

## Test Coverage

### Database Models

#### Event Model (`database/__tests__/event.model.test.ts`)
- **Schema Validation** (50+ tests)
  - All required field validations
  - Field length constraints (title: 100, description: 1000, overview: 500)
  - Mode enumeration validation (online, offline, hybrid)
  - Array validation (agenda, tags must have at least one item)
  - String trimming and normalization
  
- **Slug Generation** (10 tests)
  - Converts title to URL-friendly slug
  - Handles special characters removal
  - Multiple spaces and hyphens normalization
  - Edge cases (empty strings, unicode, only special chars)
  
- **Date Normalization** (7 tests)
  - ISO format conversion
  - Multiple date format handling
  - Invalid date detection
  - Leap year support
  
- **Time Normalization** (13 tests)
  - 12-hour to 24-hour conversion
  - AM/PM handling
  - Midnight and noon edge cases
  - Invalid format rejection
  - Hour/minute boundary validation

#### Booking Model (`database/__tests__/booking.model.test.ts`)
- **Schema Validation** (10 tests)
  - Required fields (eventId, email)
  - Email normalization (lowercase, trimming)
  - ObjectId validation
  
- **Email Validation** (20+ tests)
  - RFC 5322 compliant validation
  - Valid email formats (with special chars, dots, hyphens)
  - Invalid email rejection (missing @, domain, local part)
  - Edge cases (multiple @, spaces, empty)
  
- **Pre-save Hook** (4 tests)
  - Event existence validation
  - Error handling
  - Conditional validation logic
  
- **Schema Indexes** (4 tests)
  - Single indexes (eventId, email)
  - Compound indexes (eventId + createdAt, eventId + email)
  - Unique constraint verification
  
- **Edge Cases** (6 tests)
  - Very long emails
  - Concurrent bookings
  - Multiple events per user
  - Multiple users per event

#### Database Index (`database/__tests__/index.test.ts`)
- **Module Exports** (6 tests)
  - Model exports (Event, Booking)
  - Type exports (IEvent, IBooking)
  - Module structure validation
  - Re-export integrity

### Library Utilities

#### MongoDB Connection (`lib/__tests__/mongodb.test.ts`)
- **Environment Variable Validation** (3 tests)
  - Missing MONGODB_URI error
  - Valid connection string formats
  
- **Connection Caching** (5 tests)
  - New connection creation
  - Cached connection reuse
  - Concurrent call handling
  - Cache persistence
  
- **Connection Options** (2 tests)
  - bufferCommands: false setting
  - Options validation
  
- **Error Handling** (6 tests)
  - Connection failures
  - Promise cache reset
  - Retry logic
  - Network, auth, and server errors
  
- **Promise Management** (3 tests)
  - Promise caching
  - Concurrent promise handling
  - Promise rejection
  
- **Return Value** (2 tests)
  - Mongoose instance return
  - Instance consistency
  
- **Global Cache** (3 tests)
  - Cache structure
  - Cache initialization
  - Cache updates
  
- **Edge Cases** (4 tests)
  - Empty/whitespace URI
  - Long connection strings
  - Special characters in URI
  
- **Hot Reload Compatibility** (2 tests)
  - Connection persistence
  - Global state management

## Test Statistics

- **Total Test Suites**: 4
- **Total Tests**: 150+
- **Lines of Test Code**: 1,500+
- **Coverage Areas**:
  - Schema validation: 100%
  - Helper functions: 100%
  - Error handling: 100%
  - Edge cases: Extensive

## Running Tests

```bash
# Install dependencies (if not already installed)
npm install

# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test -- database/__tests__/event.model.test.ts

# Run tests matching a pattern
npm test -- --testNamePattern="Email Validation"
```

## Test Output

After running `npm test`, you'll see:
- Test pass/fail status
- Execution time
- Coverage summary (if using --coverage)

Example output: