# Email Verification Automation Guide

## Current Status ✅

Your signup test with email verification is **working correctly** up to the email verification step:

1. ✅ Form fills successfully
2. ✅ Signup submission works
3. ✅ Email is sent via Infobip (POST `/mafid/infobip/send-email` returns 200)
4. ✅ Test navigates to login page
5. ⏸️ **Manual step**: Email verification link must be clicked manually
6. ⏸️ After manual verification, test continues with login

## Test Flow

```
User fills form → Submit → Email sent → Navigate to login → 
[MANUAL: Click email link] → Login → OTP → Save user
```

## Email Details

- **Email Format**: `baramaf9+auto{timestamp}@gmail.com`
- **Email Service**: Infobip
- **Verification Email Subject**: (Check your inbox)
- **Current Behavior**: Test pauses and logs instructions for manual verification

## Files Modified

### 1. `cypress/pages/signup_page.cy.ts`
- **Line 327-360**: `verifyEmailFromInbox(email)` - Handles email verification step
- **Line 362-381**: `navigateToLoginAfterEmailVerification(clientId)` - Navigate to login via landing page
- **Line 512-556**: `closeSignupPopup()` - Close success popup
- **Line 558-619**: `loginAfterSignup(email, password)` - Login with signup credentials
- **Line 621-680**: `completeVerificationAndSave(userData)` - OTP verification and save

### 2. `cypress/e2e/signup_emailV.cy.ts`
- **Lines 51-80**: Complete test flow with all methods

### 3. `cypress/support/gmailHelpers.ts` (NEW)
- Helper functions for future Gmail API integration
- Currently contains placeholder functions

## Next Steps to Fully Automate

### Option 1: Use Mailosaur (Recommended for CI/CD)

**Pros**: 
- Dedicated for test automation
- Easy to integrate
- Works in CI/CD

**Steps**:
```bash
# 1. Install
npm install --save-dev @mailosaur/cypress-mailosaur-plugin

# 2. Sign up at mailosaur.com and get API key

# 3. Add to cypress.env.json:
{
  "MAILOSAUR_API_KEY": "your-api-key",
  "MAILOSAUR_SERVER_ID": "your-server-id"
}

# 4. Update cypress/support/e2e.ts:
import '@mailosaur/cypress-mailosaur-plugin';

# 5. Change email format in test:
const email = `auto${timestamp}@{MAILOSAUR_SERVER_ID}.mailosaur.net`;
```

**Update `verifyEmailFromInbox()`**:
```typescript
verifyEmailFromInbox(email: string) {
  cy.log('📧 Fetching verification email...');
  
  cy.mailosaurGetMessage(
    Cypress.env('MAILOSAUR_SERVER_ID'),
    {
      sentTo: email,
      subject: 'Verify'  // Adjust subject as needed
    },
    {
      timeout: 30000
    }
  ).then((message) => {
    // Extract verification link from email
    const verificationLink = message.html.links[0].href; // Adjust selector
    cy.log(`✅ Found verification link: ${verificationLink}`);
    
    // Visit verification link
    cy.visit(verificationLink);
    cy.wait(2000);
    cy.log('✅ Email verified successfully');
  });
}
```

### Option 2: Use Gmail API

**Pros**:
- Uses real Gmail account
- No third-party service needed
- Free

**Cons**:
- Complex OAuth setup
- Requires Google Cloud project

**Steps**:
```bash
# 1. Install
npm install googleapis @types/googleapis

# 2. Set up Google Cloud project:
# - Enable Gmail API
# - Create Service Account or OAuth 2.0 credentials
# - Download credentials JSON

# 3. Add to cypress.config.ts:
const { google } = require('googleapis');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        async 'gmail:getVerificationEmail'({ email }) {
          // Gmail API implementation
          const gmail = google.gmail({ version: 'v1', auth });
          const response = await gmail.users.messages.list({
            userId: 'me',
            q: `to:${email} subject:verify`
          });
          // Parse and return verification link
        }
      });
    }
  }
});
```

### Option 3: Use Public Inbox (Quick Testing Only)

**Pros**:
- No setup required
- Instant testing

**Cons**:
- Not secure
- Not reliable for production
- Emails are public

**Mailinator Example**:
```typescript
verifyEmailFromInbox(email: string) {
  // Use mailinator address instead
  const username = email.split('@')[0];
  
  cy.origin('https://www.mailinator.com', { args: { username } }, ({ username }) => {
    cy.visit(`/v4/public/inboxes.jsp?to=${username}`);
    cy.wait(5000);
    cy.contains('Verify', { timeout: 30000 }).click();
    cy.wait(2000);
  });
}

// Change email in test:
const email = `auto${timestamp}@mailinator.com`;
```

## Current Manual Process

1. Run test:
   ```bash
   npx cypress run --spec "cypress/e2e/signup_emailV.cy.ts"
   ```

2. When test logs "EMAIL VERIFICATION STEP":
   - Open Gmail inbox for `baramaf9+auto{timestamp}@gmail.com`
   - Click verification link in email
   - Test automatically continues after verification

3. Test completes: Login → OTP → Save user

## Recommended Next Action

**For Production Automation**: Implement **Option 1 (Mailosaur)**
- Most reliable
- Best for CI/CD pipelines
- Easy to maintain

**For Quick Testing**: Implement **Option 3 (Mailinator)**
- Fastest to set up
- Good for proof of concept
- Change email format to use public inbox

## Files to Update for Full Automation

1. **cypress/pages/signup_page.cy.ts**
   - Update `verifyEmailFromInbox()` method (lines 327-360)
   - Add actual email fetching logic
   - Extract and visit verification link

2. **cypress/e2e/signup_emailV.cy.ts**
   - Possibly update email format based on chosen service
   - No other changes needed

3. **cypress.config.ts** or **cypress.env.json**
   - Add API keys/credentials for chosen service

4. **package.json**
   - Install required email service package

## Test Results

Last successful run reached email verification step:
```
✅ POST /dbconnections/signup - 200
✅ POST /mafid/infobip/send-email - 200
✅ Navigated to login page
⏸️ Waiting for manual email verification
```

All code compiles without errors. Ready to implement full automation when you choose an email service! 🚀
