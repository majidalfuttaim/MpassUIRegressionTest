# Gmail API Setup Guide for Email Verification Automation

## 🎯 Overview

This guide will help you set up Gmail API integration for automated email verification in your Cypress tests.

## 📋 Prerequisites

- Gmail account (baramaf9@gmail.com or any Gmail account)
- Google Cloud account (free tier is sufficient)
- Node.js installed
- Cypress project set up

## 🚀 Step-by-Step Setup

### Step 1: Google Cloud Console Setup

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com
   - Sign in with your Google account

2. **Create a New Project**
   - Click on project dropdown (top left)
   - Click "NEW PROJECT"
   - Project name: "Mpass Email Verification" (or any name)
   - Click "CREATE"
   - Wait for project creation (should take a few seconds)

3. **Enable Gmail API**
   - Make sure your new project is selected
   - Go to: https://console.cloud.google.com/apis/library
   - Search for "Gmail API"
   - Click on "Gmail API"
   - Click "ENABLE"

4. **Create OAuth 2.0 Credentials**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Click "CREATE CREDENTIALS" → "OAuth client ID"
   
   - **If you see "Configure Consent Screen" warning:**
     - Click "CONFIGURE CONSENT SCREEN"
     - Choose "External" (unless you have a Google Workspace)
     - Click "CREATE"
     - Fill in required fields:
       - App name: "Mpass Test Automation"
       - User support email: your email
       - Developer contact: your email
     - Click "SAVE AND CONTINUE"
     - Skip "Scopes" (click "SAVE AND CONTINUE")
     - Add your email as test user
     - Click "SAVE AND CONTINUE"
     - Go back to Credentials page
   
   - Now create OAuth client ID:
     - Click "CREATE CREDENTIALS" → "OAuth client ID"
     - Application type: "Desktop app"
     - Name: "Cypress Test Client"
     - Click "CREATE"

5. **Download Credentials**
   - After creation, you'll see a dialog with Client ID and Client Secret
   - Click "DOWNLOAD JSON"
   - Save the file

### Step 2: Project Configuration

1. **Save Credentials File**
   ```bash
   # Rename the downloaded file to credentials.json
   # Move it to your project root
   mv ~/Downloads/client_secret_*.json /Users/baraissa/Documents/Mpass\ automation\ FE/credentials.json
   ```

2. **Generate Authentication Token**
   ```bash
   cd "/Users/baraissa/Documents/Mpass automation FE"
   node cypress/plugins/generateToken.js
   ```

3. **Follow Authentication Flow**
   - The script will display a URL
   - Copy the URL and open in your browser
   - Sign in with your Gmail account (baramaf9@gmail.com)
   - You'll see a warning "Google hasn't verified this app"
     - Click "Advanced"
     - Click "Go to Mpass Test Automation (unsafe)"
   - Review permissions and click "Allow"
   - You'll be redirected to a page showing an authorization code
   - Copy the entire code
   - Paste it back in the terminal
   - Press Enter

4. **Verify Token Creation**
   ```bash
   # Check if token.json was created
   ls -la token.json
   ```
   You should see the token.json file in your project root

### Step 3: Security (Important!)

1. **Add to .gitignore**
   ```bash
   echo "credentials.json" >> .gitignore
   echo "token.json" >> .gitignore
   ```

2. **Verify .gitignore**
   ```bash
   cat .gitignore
   ```
   Make sure both files are listed

## ✅ Verification

Test the Gmail API integration:

```bash
npx cypress run --spec "cypress/e2e/signup_emailV.cy.ts"
```

You should see:
- ✅ Email sent via Infobip
- ✅ Gmail API fetches verification email
- ✅ Verification link extracted and visited
- ✅ Email verified automatically
- ✅ Test continues with login

## 📁 Files Created

- `/credentials.json` - OAuth credentials (DON'T COMMIT)
- `/token.json` - Authentication token (DON'T COMMIT)
- `/cypress/plugins/gmailPlugin.ts` - Gmail API integration
- `/cypress/plugins/generateToken.js` - Token generator script

## 🔧 How It Works

1. **Signup** - User fills form and submits
2. **Email Sent** - Infobip sends verification email to Gmail
3. **Gmail API** - Cypress task fetches email from Gmail inbox
4. **Link Extraction** - Regex extracts verification link from email HTML
5. **Auto-Click** - Cypress visits the verification link
6. **Verification** - Email is verified automatically
7. **Continue** - Test proceeds with login flow

## 🐛 Troubleshooting

### Error: "credentials.json not found"
- Make sure you downloaded the credentials from Google Cloud
- Rename to `credentials.json` (not `client_secret_*.json`)
- Place in project root directory

### Error: "token.json not found"
- Run: `node cypress/plugins/generateToken.js`
- Follow the authentication steps

### Error: "Invalid grant" or "Token expired"
- Delete token.json
- Run: `node cypress/plugins/generateToken.js` again
- Re-authenticate

### Gmail API not finding emails
- Check email address format matches exactly
- Verify email was actually sent (check Infobip logs)
- Try increasing `maxRetries` or `retryDelay` in the task call
- Check Gmail inbox manually to confirm email arrived

### Permission errors
- Make sure you granted all permissions during OAuth flow
- Gmail API must be enabled in Google Cloud Console
- Check OAuth consent screen includes your test email

## 🔄 Token Refresh

The OAuth token expires after some time. If tests start failing:

1. Delete old token:
   ```bash
   rm token.json
   ```

2. Generate new token:
   ```bash
   node cypress/plugins/generateToken.js
   ```

3. Re-authenticate following the prompts

## 📊 API Quota

Gmail API free tier limits:
- **250 quota units per second**
- **1 billion quota units per day**

Each API call costs 5-10 quota units. This is more than enough for testing.

## 🎉 Success Indicators

When everything is working, you'll see in Cypress logs:

```
📧 Starting Gmail API email verification process
📬 Fetching verification email from Gmail for: baramaf9+auto1728489600@gmail.com
[Gmail] Attempt 1/10: Checking inbox for baramaf9+auto1728489600@gmail.com
[Gmail] ✅ Found verification link: https://mafid-sit.progressive...
✅ Verification email received!
📧 Subject: Verify your email address
🔗 Verification link: https://...
🌐 Clicking verification link...
✅ Verification complete. Current URL: https://...
✅✅ Email verified successfully!
```

## 📝 Next Steps

After successful setup:
1. Run your test suite
2. Monitor Gmail API quota in Google Cloud Console
3. Set up error handling for edge cases
4. Consider adding cleanup tasks to delete test emails

## 🔗 Useful Links

- [Google Cloud Console](https://console.cloud.google.com)
- [Gmail API Documentation](https://developers.google.com/gmail/api)
- [OAuth 2.0 Setup](https://developers.google.com/gmail/api/auth/about-auth)
- [API Quotas](https://developers.google.com/gmail/api/reference/quota)
