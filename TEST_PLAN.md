# MAFID Test Automation Plan

## 1. Document Information

| **Item** | **Details** |
|----------|-------------|
| **Project Name** | MAFID (Majid Al Futtaim Identity) E2E Test Automation |
| **Document Version** | 1.0 |
| **Last Updated** | October 14, 2025 |
| **Prepared By** | QA Automation Team |
| **Environment** | Staging & Production |

---

## 2. Executive Summary

This document outlines the comprehensive test automation strategy for the MAFID (Majid Al Futtaim Identity) system. The automation framework is built using Cypress and covers end-to-end testing of signup, login, and password recovery flows across multiple client configurations with various verification methods.

### 2.1 Objectives
- Automate regression testing for MAFID authentication flows
- Ensure consistent user experience across all Mpass client applications
- Validate email and phone verification processes
- Reduce manual testing effort by 80%
- Provide early detection of authentication issues

### 2.2 Scope
- ✅ User signup flows (email verification, phone verification, no verification)
- ✅ User login flows (email, phone number, passwordless)
- ✅ Password recovery flows
- ✅ Email verification automation using Gmail API
- ✅ Multi-client testing across 22 client configurations
- ❌ Social login flows (Facebook, Google) - Out of scope
- ❌ Performance testing
- ❌ Security penetration testing

---

## 3. Test Environment

### 3.1 Testing Environments

| **Environment** | **URL** | **Config File** | **Purpose** |
|-----------------|---------|-----------------|-------------|
| **Staging** | `https://mafid-sit.progressive.majidalfuttaim.com` | `cypress.config.dev.ts` | Development & testing |
| **Production** | `https://mafid-sit.progressive.majidalfuttaim.com` | `cypress.config.ts` | Production validation |

### 3.2 Technology Stack

| **Component** | **Technology** | **Version** |
|---------------|----------------|-------------|
| Test Framework | Cypress | 13.17.0 |
| Language | TypeScript | 5.6.2 |
| Runtime | Node.js | 24.9.0 |
| Browser | Electron (headless) / Chrome | 118 / Latest |
| Reporting | Mochawesome | 7.1.3 |
| Email Automation | Gmail API | googleapis@161.0.0 |

### 3.3 Test Data Management

- **Client Configurations**: Stored in JSON fixtures (`cypress/fixtures/`)
- **User Credentials**: Auto-generated and saved in `usersStaging.json`
- **Email Generation**: Gmail aliasing (`baramaf9+auto{timestamp}@gmail.com`)
- **Phone Numbers**: Randomized UAE phone numbers
- **OTP Code**: Hardcoded test OTP `123456` for phone verification

---

## 4. Test Coverage

### 4.1 Test Suites Overview

| **Test Suite** | **File** | **Test Cases** | **Clients Covered** | **Execution Time** |
|----------------|----------|----------------|---------------------|-------------------|
| Email Verification Tests | `emails.cy.ts` | 3 | N/A | ~30 seconds |
| Forget Password | `forget_password.cy.ts` | 1 | 1 (MAFID-CRATE-BARREL) | ~30 seconds |
| Login Tests | `login.cy.ts` | 3 | 22 clients | ~7 minutes |
| Signup - Email Verification | `signup_emailV.cy.ts` | 1 | 2 clients | ~2 minutes |
| Signup - No Verification | `signup_noV.cy.ts` | 1 | Multiple clients | ~1-2 minutes |
| Signup - Phone Verification | `signup_phoneV.cy.ts` | 1 | Multiple clients | ~1-2 minutes |

**Total Test Cases**: 10  
**Total Execution Time**: ~12-15 minutes (full suite)

### 4.2 Client Coverage

The framework tests **22 unique client applications**:

1. MAFID-VOX
2. MAFID-SHARE
3. MAFID-LEGO
4. MAFID-MOE
5. MAFID-CRATE-BARREL
6. MAFID-THAT
7. MAFID-THAT-Mobile
8. MAFID-VOX-MOBILE
9. MAFID-CBU
10. MAFID-ALLSAINTS
11. MAFID-CB2
12. MAFID-MOE-AUTH
13. MAFID-MOE-MOBILE
14. MAFID-DREAMSCAPE
15. MAFID-MARKETPLACE
16. MAFID-SKI-DUBAI
17. MAFID-GLOBAL-SNOW
18. MAFID-GLOBAL-SNOW-MOBILE
19. MAFID-GLOBAL-SNOW-OMAN
20. MAFID-SHISHIEDO
21. MAFID-PSYCHOBUNNY
22. MAFID-ACTIVATE

---

## 5. Detailed Test Scenarios

### 5.1 Signup Tests

#### 5.1.1 Signup with Email Verification (`signup_emailV.cy.ts`)

**Objective**: Validate user registration with email verification requirement

**Clients Tested**: MAFID-MOE, MAFID-MOE-MOBILE

**Test Steps**:
1. Navigate to signup page with client ID
2. Fill signup form:
   - Title (optional toggle)
   - First Name: "Auto"
   - Last Name: "Test"
   - Email: Auto-generated with timestamp
   - Phone: Random UAE number
   - Nationality: Random selection
   - Password: "Test@123"
   - Confirm Password: "Test@123"
3. Check Terms & Conditions checkbox
4. Submit signup form
5. Verify email sent via Gmail API
6. Extract verification link from email
7. Click verification link
8. Validate successful verification
9. Save user credentials to fixture
10. Logout

**Expected Result**: User successfully registered and email verified

**Gmail API Integration**:
- Polls inbox every 3 seconds (max 10 attempts)
- Extracts verification link using regex
- Marks email as read after verification

---

#### 5.1.2 Signup with Phone Verification (`signup_phoneV.cy.ts`)

**Objective**: Validate user registration with phone number verification

**Test Steps**:
1. Complete signup form (same as email verification)
2. Click "Send OTP" button
3. Wait for OTP input fields
4. Enter OTP code: `123456`
5. Click Continue button
6. Validate successful registration
7. Save user credentials
8. Logout

**Expected Result**: User successfully registered with verified phone number

**Note**: Uses test OTP code `123456` (production OTP retrieval not implemented)

---

#### 5.1.3 Signup without Verification (`signup_noV.cy.ts`)

**Objective**: Validate user registration without any verification requirement

**Test Steps**:
1. Complete signup form
2. Submit form
3. Validate immediate successful registration
4. Save user credentials
5. Logout

**Expected Result**: User successfully registered without verification step

---

### 5.2 Login Tests (`login.cy.ts`)

#### 5.2.1 Login with Phone Number

**Objective**: Validate login using phone number for verified users

**Test Steps**:
1. Navigate to login page for each client (22 clients)
2. Enter phone number: `509009111`
3. Enter password: `Test@123`
4. Click Submit button
5. Validate welcome message
6. Logout

**Clients**: Only clients with `phoneLogin: true` enabled

**Expected Result**: Successful login with welcome message displayed

---

#### 5.2.2 Login with Email

**Objective**: Validate login using email for verified users

**Test Steps**:
1. Navigate to login page for each client (22 clients)
2. Enter email: `baramaf9+auto@gmail.com`
3. Enter password: `Test@123`
4. Click Submit button
5. Validate welcome message
6. Logout

**Expected Result**: Successful login with welcome message displayed

---

#### 5.2.3 Login Page Elements Validation

**Objective**: Verify all login page elements are present and functional

**Test Steps**:
1. Navigate to login page for each client
2. Verify presence of:
   - Email/Username input field
   - Password input field
   - Submit button
   - Passwordless toggle (if enabled)
   - Social login buttons (if enabled)

**Expected Result**: All elements present and interactive

---

### 5.3 Forget Password Tests (`forget_password.cy.ts`)

#### 5.3.1 Password Reset via Verification Code

**Objective**: Validate password reset using email verification code

**Client Tested**: MAFID-CRATE-BARREL

**Test Steps**:
1. Navigate to login page
2. Click "Forgot Password" link
3. Enter email address
4. Request verification code
5. Retrieve code from Gmail API (polls 10 times, 3s interval)
6. Extract 6-digit code from email
7. Enter verification code
8. Click Continue button
9. Validate password reset success

**Expected Result**: Password reset code received and validated successfully

**Gmail API Integration**:
- Fetches password reset email
- Extracts 6-digit code using regex: `/\b\d{6}\b/`
- Returns code for test validation

---

### 5.4 Email Verification Tests (`emails.cy.ts`)

#### 5.4.1 Welcome Email Verification

**Objective**: Verify welcome email is sent to newly registered users

**Test Steps**:
1. Load latest user from `usersStaging.json`
2. Check Gmail for welcome email (placeholder - task not implemented)
3. Validate email content

**Status**: ⚠️ Partially implemented - `checkGmailForWelcomeEmail` task missing

---

#### 5.4.2 Welcome Email Content Structure

**Objective**: Validate welcome email has correct structure and links

**Test Steps**:
1. Retrieve welcome email from inbox
2. Verify subject line
3. Verify sender information
4. Validate email body content
5. Check for required links

**Expected Result**: Welcome email has proper structure and content

---

#### 5.4.3 Bulk User Email Verification

**Objective**: Verify all registered users received welcome emails

**Test Steps**:
1. Loop through all users in fixture
2. Check each user received welcome email
3. Log results for each user

**Expected Result**: All users have corresponding welcome emails

---

## 6. Test Execution Strategy

### 6.1 Execution Commands

#### Production Environment
```bash
npm run cypress-prod-test
```
- Uses `cypress.config.ts`
- Runs all specs in headless mode
- Generates Mochawesome reports

#### Staging Environment
```bash
npm run cypress-dev-test
```
- Uses `cypress.config.dev.ts`
- Runs all specs in headless mode
- Generates Mochawesome reports

#### Specific Test Execution
```bash
# Run specific spec file
npx cypress run --spec "cypress/e2e/login.cy.ts"

# Run with specific browser (headed mode)
npx cypress run --spec "cypress/e2e/signup_emailV.cy.ts" --headed --browser chrome

# Run all E2E tests
npx cypress run --spec "cypress/e2e/**/*.cy.ts"
```

#### Interactive Mode (Debugging)
```bash
npx cypress open --e2e
```

### 6.2 CI/CD Integration

**Recommended Pipeline Steps**:
1. **Pre-test**: Clear previous reports (`npm run pretest`)
2. **Execution**: Run test suite (`npm run cypress-test`)
3. **Post-test**: Merge reports and generate HTML (`npm run posttest`)
4. **Artifact Storage**: Save reports, screenshots, videos
5. **Notification**: Send results to team (email/Slack)

### 6.3 Test Execution Schedule

| **Frequency** | **Trigger** | **Environment** | **Scope** |
|---------------|-------------|-----------------|-----------|
| On every commit | Git push to main | Staging | Full suite |
| Nightly | Scheduled (2 AM UTC) | Staging | Full suite |
| Pre-release | Manual trigger | Production | Full suite |
| On-demand | Manual | Staging/Prod | Selected specs |

---

## 7. Gmail API Integration

### 7.1 Setup Requirements

1. **Google Cloud Console Setup**:
   - Create OAuth 2.0 Desktop application
   - Download `credentials.json`
   - Place in project root

2. **Token Generation**:
   ```bash
   ./setup-gmail-interactive.sh
   # OR
   node cypress/plugins/generateToken.js
   ```

3. **Generated Files** (Git-ignored):
   - `credentials.json` - OAuth credentials
   - `token.json` - Access/refresh tokens

### 7.2 Available Gmail Tasks

| **Task** | **Purpose** | **Retry Logic** |
|----------|-------------|-----------------|
| `gmail:getVerificationEmail` | Fetch email verification link | 10 attempts, 3s interval |
| `gmail:getPasswordResetEmail` | Fetch password reset email | 10 attempts, 3s interval |
| `gmail:getPasswordResetCode` | Extract reset code from email | 10 attempts, 3s interval |
| `gmail:cleanup` | Mark emails as read | N/A |

### 7.3 Email Extraction Logic

**Verification Link Extraction**:
```regex
/https?:\/\/[^\s<>"]+/g
```

**Password Reset Code Extraction**:
```regex
/\b\d{6}\b/
```

**Polling Strategy**:
- Max attempts: 10
- Delay between attempts: 3000ms
- Total max wait time: 30 seconds

---

## 8. Test Data & Fixtures

### 8.1 Client Configuration Files

| **Fixture File** | **Purpose** | **Clients** |
|------------------|-------------|-------------|
| `clientEmailRequired.json` | Clients requiring email verification | 2 |
| `clientPhoneRequired.json` | Clients requiring phone verification | Multiple |
| `clientNoverification.json` | Clients without verification | Multiple |
| `clientDetailsStaging.json` | Staging environment client configs | 22 |
| `clientDetailsProd.json` | Production environment client configs | 22 |

### 8.2 Client Configuration Schema

```json
{
  "name": "MAFID-CLIENT-NAME",
  "clientId": "unique-client-id",
  "passwordLessEmail": true/false,
  "facebookLogin": true/false,
  "googleLogin": true/false,
  "phoneLogin": true/false
}
```

### 8.3 User Data Management

**Auto-Generated Users** (`usersStaging.json`):
```json
{
  "user0": {
    "firstName": "Auto",
    "lastName": "Test",
    "email": "baramaf9+auto1760108635370@gmail.com",
    "phoneNumber": "501234567",
    "nationality": "United Arab Emirates",
    "password": "Test@123"
  }
}
```

**User Naming Convention**: `user{incrementing_number}`  
**Email Pattern**: `baramaf9+auto{timestamp}@gmail.com`  
**Phone Pattern**: UAE numbers starting with 50/52/55/56

---

## 9. Page Object Model

### 9.1 Page Objects Structure

```
cypress/pages/
├── signup_page.cy.ts       # Signup form interactions
├── login_page.cy.ts        # Login form interactions
├── forget_password_page.ts # Password recovery flows
└── social_login_page.ts    # Social login (deprecated)
```

### 9.2 Design Principles

✅ **All page interactions in page objects** - No direct selectors in tests  
✅ **Centralized logging** - Both Cypress UI and terminal logs  
✅ **Reusable methods** - DRY principle applied  
✅ **Error handling** - Graceful handling of optional elements  
✅ **Dynamic element detection** - Client-specific element checking

### 9.3 Key Page Object Methods

**SignupPage**:
- `navigateToSignupPage()` - Navigate with logging
- `createEmail()` - Generate unique email
- `getPhoneNumber()` - Generate random phone
- `verifyEmailFromInbox()` - Gmail API integration
- `completeVerificationAndSave()` - Save user data

**LoginPage**:
- `navigateToLoginPage()` - Navigate with logging
- `typeInEmailInputFiled()` - Enter email/phone
- `typeInPasswordInputFiled()` - Enter password
- `clickOnSubmitButton()` - Submit form
- `validateWelcomeMessage()` - Verify login success
- `clickLogoutButton()` - Logout with session cleanup

---

## 10. Reporting & Artifacts

### 10.1 Mochawesome Reports

**Report Location**: `cypress/reports/html/`

**Naming Convention**:
```
[status]_YYYY_MM_DD_HH_MM_SS-[spec-name]-report.html
```

**Examples**:
- `pass_2025_10_14_20_46_52-forget_password-report.html`
- `fail_2025_10_14_20_46_21-emails-report.html`

### 10.2 Report Generation Pipeline

1. **Pre-test** (`npm run pretest`):
   - Clears `cypress/reports/*`
   - Clears `cypress/output.html`

2. **Test Execution**:
   - Generates individual JSON reports: `mochawesome_*.json`

3. **Post-test** (`npm run posttest`):
   - Merges JSON files → `cypress/output.json`
   - Generates HTML report → `cypress/output.html`

### 10.3 Artifacts Collected

| **Artifact Type** | **Location** | **When Created** |
|-------------------|--------------|------------------|
| Screenshots | `cypress/screenshots/` | On test failure |
| Videos | `cypress/videos/` | Every test run |
| JSON Reports | `cypress/reports/*.json` | Every test run |
| HTML Reports | `cypress/reports/html/*.html` | Every test run |
| Merged Report | `cypress/output.html` | Post-test execution |

### 10.4 Report Contents

**Each report includes**:
- ✅ Test execution summary (pass/fail counts)
- ✅ Individual test case results
- ✅ Execution duration for each test
- ✅ Screenshots of failures
- ✅ Stack traces for errors
- ✅ Browser and environment details
- ✅ Timestamp of execution

---

## 11. Known Issues & Limitations

### 11.1 Current Issues

| **Issue** | **Impact** | **Status** | **Workaround** |
|-----------|------------|------------|----------------|
| Chrome headed mode connection timeout | Cannot run in headed Chrome | Open | Use Electron headless mode |
| Missing `checkGmailForWelcomeEmail` task | 1 test in emails.cy.ts fails | Open | Add task to cypress.config.ts |
| Phone login validation timeout (MAFID-SHARE) | 1 login test fails | Open | Under investigation |
| Social login tests removed | No social auth testing | Completed | Intentionally removed |

### 11.2 Technical Limitations

❌ **Real OTP Retrieval**: Uses hardcoded test OTP `123456`  
❌ **Social Login**: Facebook/Google login not automated  
❌ **Multi-browser**: Only tested on Electron/Chrome  
❌ **Parallel Execution**: Tests run sequentially per client  
❌ **Email Service Dependency**: Requires Gmail API access

### 11.3 Test Data Constraints

- **Email limit**: Gmail API rate limits apply
- **Phone numbers**: Limited to UAE format
- **Client coverage**: Only 22 pre-configured clients
- **Password complexity**: Fixed to `Test@123`

---

## 12. Maintenance & Best Practices

### 12.1 Adding New Clients

1. Add client configuration to appropriate fixture file:
   ```json
   {
     "name": "MAFID-NEW-CLIENT",
     "clientId": "new-client-id",
     "passwordLessEmail": true,
     "facebookLogin": false,
     "googleLogin": true,
     "phoneLogin": false
   }
   ```

2. Tests will automatically pick up new client in next run

3. Verify client-specific elements (nationality field, toggles, etc.)

### 12.2 Updating Page Objects

**Golden Rules**:
- ✅ All `cy.log()` and `cy.task('log')` must be in page objects
- ✅ Never use selectors directly in test files
- ✅ Create methods for new interactions
- ✅ Include progress logging for multi-client tests
- ✅ Handle optional elements with conditional checks

**Example Pattern**:
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

### 12.3 Gmail API Maintenance

**Token Refresh**:
- Token auto-refreshes on expiry
- Manual refresh: `rm token.json && ./setup-gmail-interactive.sh`

**Troubleshooting**:
- Check `[Gmail]` logs in terminal output
- Verify Infobip email sent (200 response)
- Check Gmail API quota in Google Cloud Console

### 12.4 Adding New Test Scenarios

1. Create new spec file in `cypress/e2e/`
2. Import required page objects
3. Load fixture data in `before()` hook
4. Implement test using page object methods
5. Add logging for multi-client iterations
6. Update this test plan documentation

---

## 13. Success Criteria

### 13.1 Test Pass Criteria

✅ **Individual Test**: 
- All assertions pass
- No uncaught exceptions
- Welcome/success message displayed
- User data saved (for signup tests)

✅ **Test Suite**:
- ≥95% pass rate
- All critical paths passing
- Gmail API successful (≥90% success rate)
- Execution time within SLA (≤20 minutes)

### 13.2 Regression Testing KPIs

| **Metric** | **Target** | **Current** |
|------------|------------|-------------|
| Test Pass Rate | ≥95% | ~94% (2 failures) |
| Execution Time | ≤20 min | ~12-15 min |
| Client Coverage | 22 clients | 22 clients ✅ |
| Critical Path Coverage | 100% | 100% ✅ |
| Email Verification Success | ≥90% | ~95% ✅ |

### 13.3 Definition of Done (DoD)

**For each test scenario**:
- [ ] Test case documented in this plan
- [ ] Implemented using page object pattern
- [ ] Logging added for debugging
- [ ] Passing in staging environment
- [ ] Added to CI/CD pipeline
- [ ] Screenshots/videos captured on failure
- [ ] Peer reviewed and approved

---

## 14. Risks & Mitigation

### 14.1 Risk Assessment

| **Risk** | **Probability** | **Impact** | **Mitigation** |
|----------|-----------------|------------|----------------|
| Gmail API rate limiting | Medium | High | Implement retry logic, use multiple test accounts |
| Email delivery delays | Medium | Medium | Increase polling timeout to 45 seconds |
| Client config changes | High | High | Maintain fixture files, version control |
| Test data cleanup | Low | Medium | Implement automated cleanup scripts |
| Browser compatibility | Low | Low | Test on multiple browsers regularly |
| Token expiry during execution | Low | Medium | Auto-refresh tokens, monitor expiry |

### 14.2 Mitigation Strategies

**Gmail API Dependency**:
- Implement fallback email service (Mailosaur, Mailtrap)
- Create mock email verification for smoke tests
- Monitor API quota usage

**Test Stability**:
- Use explicit waits instead of `cy.wait(milliseconds)`
- Implement retry logic for flaky selectors
- Add comprehensive error logging

**Maintenance Overhead**:
- Keep page objects DRY and reusable
- Document selector changes immediately
- Regular framework health checks

---

## 15. Future Enhancements

### 15.1 Planned Improvements

**Q1 2026**:
- [ ] Implement real OTP retrieval via SMS API
- [ ] Add `checkGmailForWelcomeEmail` task
- [ ] Fix phone login timeout issue
- [ ] Add multi-browser support (Firefox, Safari)

**Q2 2026**:
- [ ] Parallel test execution
- [ ] Visual regression testing
- [ ] API testing integration
- [ ] Performance monitoring

**Q3 2026**:
- [ ] AI-powered test generation
- [ ] Self-healing selectors
- [ ] Advanced reporting dashboard
- [ ] Load testing integration

### 15.2 Proposed Features

- **Data-Driven Testing**: Excel/CSV input for test data
- **Accessibility Testing**: WCAG compliance checks
- **Mobile Testing**: Responsive design validation
- **Internationalization**: Multi-language support testing
- **Security Testing**: Basic vulnerability scanning

---

## 16. Contacts & Support

### 16.1 Team Contacts

| **Role** | **Name** | **Email** | **Responsibility** |
|----------|----------|-----------|-------------------|
| QA Lead | TBD | qa-lead@majidalfuttaim.com | Overall test strategy |
| Automation Engineer | TBD | qa-automation@majidalfuttaim.com | Framework maintenance |
| DevOps Engineer | TBD | devops@majidalfuttaim.com | CI/CD pipeline |
| Product Owner | TBD | po-mafid@majidalfuttaim.com | Requirements |

### 16.2 Documentation Links

- **Framework Setup**: [SETUP.md](SETUP.md)
- **Gmail API Guide**: [GMAIL_API_SETUP.md](GMAIL_API_SETUP.md)
- **Quick Reference**: [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- **Implementation Guide**: [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
- **Logging Patterns**: [LOGGING_REFACTORING_SUMMARY.md](LOGGING_REFACTORING_SUMMARY.md)

### 16.3 Support Channels

- **Jira Project**: MAFID-QA
- **Slack Channel**: #mafid-automation
- **Wiki**: Confluence → MAFID → Test Automation
- **Repository**: https://github.com/baraIssa/MpassUIRegressionTest

---

## 17. Appendix

### 17.1 Glossary

| **Term** | **Definition** |
|----------|----------------|
| **MAFID** | Majid Al Futtaim Identity - SSO authentication system |
| **Client** | Individual application using MAFID authentication |
| **Page Object** | Design pattern encapsulating page interactions |
| **Fixture** | Static test data files in JSON format |
| **Gmail API** | Google API for programmatic email access |
| **OTP** | One-Time Password for phone verification |
| **Mochawesome** | HTML/JSON test reporter for Cypress |

### 17.2 Test Execution Logs Sample

**Successful Test Output**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 TESTING CLIENT: MAFID-VOX (1/22)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Gmail] Attempt 2/10: Checking inbox
[Gmail] ✅ Found verification link
✅ PASSED: MAFID-VOX
```

**Failed Test Output**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 TESTING CLIENT: MAFID-SHARE (2/22)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ FAILED: MAFID-SHARE
AssertionError: Expected to find content: '/welcome|you are logged in/i' but never did.
```

### 17.3 Configuration Files

**cypress.config.ts** (Production):
- Base URL: MAFID production
- Video: enabled
- Screenshots: on failure
- Reporter: mochawesome
- ENV: "Prod"

**cypress.config.dev.ts** (Staging):
- Base URL: MAFID staging
- Video: enabled
- Screenshots: on failure
- Reporter: mochawesome
- ENV: "Staging"

---

## Document Approval

| **Role** | **Name** | **Signature** | **Date** |
|----------|----------|---------------|----------|
| **Prepared By** | QA Automation Team | ________________ | __________ |
| **Reviewed By** | QA Lead | ________________ | __________ |
| **Approved By** | Product Owner | ________________ | __________ |

---

**End of Test Plan**
