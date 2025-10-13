# MAFID Automation Framework - AI Agent Instructions

## Project Overview
Cypress-based E2E test automation for MAFID (Majid Al Futtaim Identity) system. Tests signup/login flows with email/phone verification across multiple client configurations.

## Core Architecture

### Multi-Environment Setup
- **Production**: `cypress.config.ts` - Base URL: `https://mafid-sit.progressive.majidalfuttaim.com`
- **Staging**: `cypress.config.dev.ts` - Simpler config for dev environment
- Environment switched via `--config-file` flag in npm scripts

### Page Object Pattern (Critical)
**All page interactions and logging MUST be in page objects** (`cypress/pages/`):
- `SignupPage` - Signup forms, email/phone verification, OTP handling
- `LoginPage` - Login flows, passwordless toggle detection
- `ForgetPasswordPage` - Password reset flows
- `SocialLogin` - Social authentication

**Pattern:** Tests should only call page object methods, never inline `cy.log()` or selectors. See `LOGGING_REFACTORING_SUMMARY.md` for refactoring approach.

### Client-Driven Testing
Tests iterate over client configurations from fixtures:
- `clientEmailRequired.json` - Clients requiring email verification
- `clientPhoneRequired.json` - Clients requiring phone verification  
- `clientDetailsStaging.json` - Staging environment clients
- `clientNoverification.json` - Clients without verification

Each test loops through clients using `forEach((client, index) => {...})` pattern with progress logging.

## Gmail API Integration

### Authentication Flow
1. **Setup Required**: `credentials.json` from Google Cloud Console (OAuth Desktop app)
2. **Token Generation**: Run `./setup-gmail-interactive.sh` or `node cypress/plugins/generateToken.js`
3. **Files Generated**: `token.json` (auto-refresh on expiry)
4. **Security**: Both files in `.gitignore` - NEVER commit

### Email Verification Pattern
```typescript
// In signup test
signupPage.verifyEmailFromInbox(email, client.clientId);
```

**How it works** (`cypress/plugins/gmailPlugin.ts`):
- Polls Gmail API (10 retries, 3s delay) for verification emails
- Regex extracts verification links from HTML/plain text
- Auto-clicks link via Cypress, marks email as read
- Returns to login page to continue test flow

**Task Registration**: Gmail tasks registered in `cypress.config.ts` setupNodeEvents:
```typescript
on('task', { ...gmailTasks, log(message) {...} });
```

## Test Execution Patterns

### Run Commands
```bash
# Production (uses cypress.config.ts, ENV="Prod")
npm run cypress-prod-test

# Staging (uses cypress.config.dev.ts, ENV="Staging")  
npm run cypress-dev-test

# Specific test with reporting
npx cypress run --spec "cypress/e2e/signup_emailV.cy.ts" \
  --reporter mochawesome \
  --reporter-options "reportDir=cypress/reports/html,reportFilename=signup-report"
```

### Reporting Pipeline
1. **pretest**: Clears `cypress/reports/*` and `cypress/output.html`
2. **Test runs**: Generates individual JSON reports (`mochawesome_*.json`)
3. **posttest**: 
   - Merges JSONs → `cypress/output.json`
   - Generates HTML → `cypress/output.html`

Reports use timestamp naming: `[status]_YYYY_MM_DD_HH_MM_SS-[name]-report.html`

## User Data Management

### Auto-Generated Test Users
Successful signups save to `cypress/fixtures/usersStaging.json` (git-ignored):
```json
{
  "user0": { "firstName": "Auto", "lastName": "Test", "email": "...", "phoneNumber": "...", "nationality": "...", "password": "..." },
  "user1": { ... }
}
```

**Pattern in SignupPage.completeVerificationAndSave()**:
- Reads existing users
- Increments counter (user0, user1, user2...)
- Writes back to fixture with detailed logging

### Email Generation
```typescript
createEmail() { return `baramaf9+auto${Date.now()}@gmail.com`; }
```
Uses Gmail `+` aliasing for unique addresses to same inbox.

## Critical Patterns

### Dynamic Element Detection
Many elements are optional/conditional based on client config:
```typescript
cy.document().then(doc => {
  const element = doc.querySelector('.selector');
  if (element) {
    cy.get('.selector').click();
  } else {
    cy.log('⚠️ Element not found - skipping (optional)');
  }
});
```
Examples: Title toggle, passwordless toggle, nationality field.

### OTP Handling (Phone Verification)
1. Click "Send OTP" button
2. Wait for OTP fields (`cy.wait(1000)`)
3. Enter hardcoded OTP: `123456` (appears to be test OTP)
4. Click Continue

**Note**: Real OTP retrieval not implemented - uses test code.

### Session Management
Tests call `signupPage.clickLogoutButton()` after each client iteration to ensure clean state for next test.

### Error Handling
Global exception handler in `cypress/support/e2e.ts`:
```typescript
Cypress.on('uncaught:exception', (err, runnable) => {
  console.log('Caught exception:', err.message);
  return false; // Prevent test failure on app errors
});
```

## File Organization

### Must-Know Locations
- **Test specs**: `cypress/e2e/*.cy.ts` - Keep test logic minimal, delegate to pages
- **Fixtures**: `cypress/fixtures/*.json` - Client configs and test data
- **Plugins**: `cypress/plugins/` - Gmail API (`gmailPlugin.ts`), token generation (`generateToken.js`)
- **Support**: `cypress/support/` - Custom commands (`commands.ts`), global config (`e2e.ts`)
- **Reports**: `cypress/reports/html/` - Mochawesome HTML/JSON outputs

### Configuration Priority
1. `cypress.config.ts` - Production config (default)
2. `cypress.config.dev.ts` - Staging/dev config
3. `cypress.env.json` - Local overrides (template: `cypress.env.json.template`)

## Development Workflows

### Adding New Client Test
1. Add client to appropriate fixture (`clientEmailRequired.json` or `clientPhoneRequired.json`)
2. Test will auto-pick up on next run (forEach loop pattern)
3. Verify client-specific elements (e.g., nationality field) exist in conditional checks

### Debugging Email Verification
- Check `[Gmail]` logs in terminal output for API polling status
- Verify Infobip email sent (check network for `POST /mafid/infobip/send-email` returning 200)
- Token expiry? Run `rm token.json && ./setup-gmail-interactive.sh`

### Adding Logging
**Never add `cy.log()` directly in test files**. Instead:
1. Create method in appropriate page object (e.g., `logSubmittingForm()`)
2. Call method from test: `signupPage.logSubmittingForm()`
3. Include both `cy.log()` (Cypress UI) and `cy.task('log')` (terminal) for visibility

## Common Gotchas

1. **Wait Times**: Tests use explicit waits (`cy.wait(1000)`) after dropdown selections due to page re-renders. Don't remove without testing.
2. **Force Clicks**: Many clicks use `{force: true}` due to element overlay issues - this is intentional.
3. **Scroll Behavior**: Most inputs use `{scrollBehavior: false}` to prevent unwanted scrolling during form fill.
4. **Selector Fragility**: Uses nth-child selectors (e.g., `.text-center > :nth-child(1)`) - update if DOM structure changes.
5. **TypeScript Config**: `resolveJsonModule: true` required for fixture imports in test files.

## Key Documentation
- `SETUP.md` - Initial project setup
- `GMAIL_API_SETUP.md` - Gmail API configuration details
- `QUICK_REFERENCE.md` - Common commands cheat sheet
- `IMPLEMENTATION_SUMMARY.md` - Gmail integration implementation details
- `LOGGING_REFACTORING_SUMMARY.md` - Logging pattern migration guide
