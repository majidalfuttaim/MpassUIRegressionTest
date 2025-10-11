# Cypress Test Execution Commands

## Run Signup Phone Verification Test (signup_phoneV.cy.ts)

### Single Test with HTML Report
```bash
npx cypress run --spec "cypress/e2e/signup_phoneV.cy.ts" --reporter mochawesome --reporter-options "reportDir=cypress/reports/html,reportFilename=signup_phoneV-report,overwrite=false,html=true,json=true"
```

### All Tests with HTML Reports
```bash
npx cypress run --reporter mochawesome --reporter-options "reportDir=cypress/reports/html,reportFilename=all-tests-report,overwrite=false,html=true,json=true"
```

### Open Cypress GUI for Interactive Testing
```bash
npx cypress open --e2e
```

## Report Location

- **HTML Reports**: `cypress/reports/html/`
- **Report Format**: `pass_YYYY_MM_DD_HH_MM_SS-signup_phoneV-report.html` (for passed tests)
- **Report Format**: `fail_YYYY_MM_DD_HH_MM_SS-signup_phoneV-report.html` (for failed tests)

## Test Results Summary

### Latest Run (October 8, 2025)
- **Test**: signup_phoneV.cy.ts
- **Status**: ✅ PASSED
- **Duration**: 53 seconds
- **Report**: `cypress/reports/html/pass_2025_10_08_14_11_18-signup_phoneV-report.html`

### What the Test Does
1. Navigates to signup page with client ID from fixtures
2. Fills signup form with random user data (title, name, email, phone, nationality, password)
3. Submits the form and waits for OTP verification page
4. Sends OTP and enters verification code (123456)
5. Verifies OTP and proceeds to save page
6. **Saves user data to `cypress/fixtures/usersStaging.json`** with object structure (user0, user1, etc.)
7. Clicks Save button to complete signup
8. Test passes after Save button click

### User Data Saved
User registration data is automatically saved to `cypress/fixtures/usersStaging.json` with the following structure:
```json
{
  "user0": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "baramaf9+auto1728394278000@gmail.com",
    "phoneNumber": "501234567",
    "nationality": "United Arab Emirates",
    "password": "Test@1234",
    "mobile_verified": true
  },
  "user1": { ... }
}
```

## Additional Options

### Run Specific Browser
```bash
# Chrome
npx cypress run --spec "cypress/e2e/signup_phoneV.cy.ts" --browser chrome --reporter mochawesome --reporter-options "reportDir=cypress/reports/html,reportFilename=signup_phoneV-report,overwrite=false,html=true,json=true"

# Firefox
npx cypress run --spec "cypress/e2e/signup_phoneV.cy.ts" --browser firefox --reporter mochawesome --reporter-options "reportDir=cypress/reports/html,reportFilename=signup_phoneV-report,overwrite=false,html=true,json=true"

# Edge
npx cypress run --spec "cypress/e2e/signup_phoneV.cy.ts" --browser edge --reporter mochawesome --reporter-options "reportDir=cypress/reports/html,reportFilename=signup_phoneV-report,overwrite=false,html=true,json=true"
```

### Run in Headed Mode (See Browser UI)
```bash
npx cypress run --spec "cypress/e2e/signup_phoneV.cy.ts" --headed --reporter mochawesome --reporter-options "reportDir=cypress/reports/html,reportFilename=signup_phoneV-report,overwrite=false,html=true,json=true"
```

### Generate Combined Report (After Multiple Test Runs)
```bash
npx mochawesome-merge "cypress/reports/*.json" > cypress/reports/mochawesome-combined.json
npx marge cypress/reports/mochawesome-combined.json --reportDir cypress/reports/html --reportFilename combined-report
```

## Troubleshooting

### Clear Cypress Cache
```bash
npx cypress cache clear
```

### Verify Cypress Installation
```bash
npx cypress verify
```

### View Cypress Version
```bash
npx cypress version
```
