# Test Suite Documentation

This comprehensive test suite covers all aspects of the volleyball training session management system.

## Test Categories

### 1. Unit Tests (`/unit/`)
- **session-validation.test.ts**: Tests for session creation and validation logic
- **date-time-utils.test.ts**: Tests for date/time formatting and validation utilities

### 2. Integration Tests (`/integration/`)
- **session-management.test.ts**: Tests for complete session management workflows

### 3. Frontend Tests (`/frontend/`)
- **components/session-card.test.tsx**: Tests for session display components
- **forms/registration-form.test.tsx**: Tests for registration form functionality

### 4. End-to-End Tests (`/e2e/`)
- **session-booking-flow.test.ts**: Complete user journey testing

### 5. Performance Tests (`/performance/`)
- **load-testing.test.ts**: Performance and load testing scenarios

### 6. Security Tests (`/security/`)
- **input-validation.test.ts**: Security validation and injection prevention

### 7. Accessibility Tests (`/accessibility/`)
- **a11y.test.ts**: WCAG compliance and accessibility testing

## Running Tests

\`\`\`bash
# Run all tests
npm test

# Run specific test category
npm test unit
npm test integration
npm test e2e

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch

# Run specific test file
npm test session-validation.test.ts
\`\`\`

## Test Coverage Goals

- **Unit Tests**: 90%+ coverage
- **Integration Tests**: 80%+ coverage
- **E2E Tests**: Critical user paths
- **Security Tests**: All input validation
- **Accessibility Tests**: WCAG AA compliance

## Key Test Scenarios

### Session Management
- ✅ Session creation with validation
- ✅ Participant registration
- ✅ Session capacity management
- ✅ Status updates (open/full/cancelled)

### User Interface
- ✅ Form validation and error handling
- ✅ Responsive design
- ✅ Accessibility compliance
- ✅ User interaction flows

### Security
- ✅ Input sanitization
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ Authorization checks

### Performance
- ✅ Page load times
- ✅ Form validation speed
- ✅ Memory usage
- ✅ Large dataset handling

## Mock Data

Test data is defined in `/types/test-types.ts` and includes:
- Sample sessions with various states
- Test participants with complete information
- User roles and permissions
- Form validation scenarios

## Continuous Integration

Tests are configured to run automatically on:
- Pull requests
- Main branch commits
- Scheduled daily runs

## Test Maintenance

- Update tests when adding new features
- Maintain test data consistency
- Review and update security tests regularly
- Keep accessibility tests current with WCAG updates
