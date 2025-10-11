# MAFID Automation Framework

End-to-end test automation framework for MAFID (Majid Al Futtaim Identity) using Cypress and TypeScript.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Gmail API Setup](#gmail-api-setup)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Page Object Model](#page-object-model)
- [Contributing](#contributing)

## ✨ Features

- **Automated Email Verification**: Gmail API integration for automatic email verification
- **Phone Verification Testing**: Support for OTP/SMS verification flows
- **Multi-Client Testing**: Test across multiple client configurations
- **Page Object Model**: Clean, maintainable test architecture
- **Session Management**: Automatic logout between tests for clean state
- **Comprehensive Reporting**: Mochawesome reports with screenshots and videos
- **TypeScript Support**: Full type safety and IntelliSense

## 🔧 Prerequisites

- **Node.js**: v18 or higher
- **npm**: v8 or higher
- **Gmail Account**: For email verification testing (with API access enabled)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Mpass automation FE"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Cypress (if not already installed)**
   ```bash
   npx cypress install
   ```

## 📧 Gmail API Setup

For email verification tests to work, you need to set up Gmail API credentials:

1. **Follow the Gmail API Setup Guide**: See [GMAIL_API_SETUP.md](GMAIL_API_SETUP.md)

2. **Generate Credentials**: 
   - Run the interactive setup script:
     ```bash
     ./setup-gmail-interactive.sh
     ```
   - Or follow manual steps in [EMAIL_AUTOMATION_GUIDE.md](EMAIL_AUTOMATION_GUIDE.md)

3. **Verify Setup**:
   - Ensure `credentials.json` and `token.json` are generated
   - ⚠️ **NEVER commit these files to git** (they're in .gitignore)

## ⚙️ Configuration

### Client Configuration

Edit client configurations in the fixtures folder:

- **Email Required Clients**: `cypress/fixtures/clientEmailRequired.json`
- **Phone Required Clients**: `cypress/fixtures/clientPhoneRequired.json`
- **Staging Clients**: `cypress/fixtures/clientDetailsStaging.json`

### Environment Variables

Create a `cypress.env.json` file (not committed to git):

```json
{
  "baseUrl": "https://mafid-sit.progressive.majidalfuttaim.com",
  "gmailEmail": "your-email@gmail.com"
}
```

## 🚀 Running Tests

### Run All Tests (Headless)
```bash
npm test
```

### Run Specific Test Suites

**Email Verification Signup**
```bash
npx cypress run --spec "cypress/e2e/signup_emailV.cy.ts"
```

**Phone Verification Signup**
```bash
npx cypress run --spec "cypress/e2e/signup_phoneV.cy.ts"
```

**Login Tests**
```bash
npx cypress run --spec "cypress/e2e/login.cy.ts"
```

### Run Tests with UI (Interactive Mode)
```bash
npx cypress open --e2e
```

### Run with Mochawesome Reports
```bash
npx cypress run --spec "cypress/e2e/signup_emailV.cy.ts" --reporter mochawesome --reporter-options "reportDir=cypress/reports/html,reportFilename=signup_emailV-report,overwrite=false,html=true,json=true"
```

## 📁 Test Structure

```
cypress/
├── e2e/                          # Test files
│   ├── login.cy.ts              # Login tests
│   ├── signup_emailV.cy.ts      # Email verification signup
│   ├── signup_phoneV.cy.ts      # Phone verification signup
│   └── social_login.cy.ts       # Social login tests
├── fixtures/                     # Test data
│   ├── clientEmailRequired.json # Email-required clients
│   ├── clientPhoneRequired.json # Phone-required clients
│   ├── clientDetailsStaging.json # Staging environment clients
│   └── usersStaging.json        # Generated user data (not committed)
├── pages/                        # Page Object Model
│   ├── login_page.cy.ts         # Login page actions
│   ├── signup_page.cy.ts        # Signup page actions
│   └── social_login_page.ts     # Social login page actions
├── plugins/                      # Cypress plugins
│   ├── gmailPlugin.ts           # Gmail API integration
│   └── generateToken.js         # Token generation utilities
└── support/                      # Support files
    ├── commands.ts              # Custom Cypress commands
    ├── e2e.ts                   # E2E support file
    ├── emailHelpers.ts          # Email verification helpers
    └── gmailHelpers.ts          # Gmail API helpers
```

## 🏗️ Page Object Model

### Example: Signup Page

```typescript
import { SignupPage } from "../pages/signup_page.cy"

const signupPage = new SignupPage()

// Generate test data
const email = signupPage.createEmail()
const phoneNumber = signupPage.getPhoneNumber()

// Navigate and fill form
signupPage.navigateToSignupPage(clientId)
signupPage.addFirstName('Auto')
signupPage.addLastName('Test')
signupPage.addEmailInsideEmailField(email)

// Verify email automatically
signupPage.verifyEmailFromInbox(email, clientId)
```

## 🧪 Test Features

### Automated Email Verification

Tests automatically:
1. Wait for verification email to arrive in Gmail
2. Extract verification link from email
3. Click the verification link
4. Return to the application

### Session Management

Each test automatically:
1. Completes the signup/login flow
2. Verifies welcome message
3. **Clicks logout button** to clear session
4. Ensures clean state for next test

### Multi-Client Testing

Tests iterate through multiple clients:
```typescript
clients.forEach((client) => {
  // Test runs for each client
  // Logout happens automatically after each
})
```

## 📊 Reports

### Mochawesome Reports

Reports are generated in `cypress/reports/html/` with:
- Test execution details
- Screenshots on failure
- Video recordings
- Pass/fail statistics

### Viewing Reports

After running tests with mochawesome reporter, open the generated HTML file:
```bash
open cypress/reports/html/pass_2025_XX_XX_XX_XX_XX-signup_emailV-report.html
```

## 🔒 Security Notes

**NEVER commit these files:**
- `credentials.json` - Gmail API credentials
- `token.json` - Gmail API access token
- `cypress.env.json` - Environment variables
- `cypress/fixtures/usersStaging.json` - Generated test users

These are automatically excluded via `.gitignore`.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Ensure all tests pass
4. Submit a pull request

## 📝 Documentation

Additional documentation:
- [Gmail API Setup Guide](GMAIL_API_SETUP.md)
- [Email Automation Guide](EMAIL_AUTOMATION_GUIDE.md)
- [OAuth Access Guide](OAUTH_ACCESS_GUIDE.md)
- [OAuth Troubleshooting](OAUTH_TROUBLESHOOTING.md)
- [Cypress Run Commands](CYPRESS_RUN_COMMANDS.md)
- [Login Test Commands](LOGIN_TEST_COMMANDS.md)
- [Quick Reference](QUICK_REFERENCE.md)

## 🐛 Troubleshooting

### Gmail API Issues
- Check `OAUTH_TROUBLESHOOTING.md`
- Verify `credentials.json` and `token.json` exist
- Ensure Gmail API is enabled in Google Cloud Console

### Test Failures
- Check screenshots in `cypress/screenshots/`
- Review videos in `cypress/videos/`
- Verify client configuration in fixtures

### Session Issues
- Tests automatically logout after completion
- If session persists, check logout button implementation
- Clear browser data manually if needed

## 👥 Authors

Baraa issa : Sr.quality engineer, Digital labs.
