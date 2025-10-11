# OAuth Setup Troubleshooting

## Current Issue
You're seeing: **"Error 403: access_denied"** with message "Mpass Test Automation has not completed the Google verification process"

## Why This Happens
Google requires apps in "Testing" mode to explicitly list test users who can authenticate.

## Solutions (Choose One)

### Solution 1: Add Test User (Recommended for Testing)

1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Click "EDIT APP"
3. Navigate through screens (SAVE AND CONTINUE) until "Test users"
4. Click "+ ADD USERS"
5. Add: `baramaf9@gmail.com` (or the email you're using)
6. Click "ADD" → "SAVE AND CONTINUE"
7. Run: `./setup-gmail.sh`

### Solution 2: Publish App (Quick Fix, Less Secure)

1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Click "PUBLISH APP" button (near top)
3. Confirm publishing
4. Run: `./setup-gmail.sh`

⚠️ **Note**: Publishing makes the app available to anyone. For internal testing, Solution 1 is better.

### Solution 3: Use Service Account (Advanced)

Instead of OAuth, use a Service Account with domain-wide delegation. This is more complex but doesn't require user interaction.

## After Fixing

Once you've added yourself as a test user OR published the app:

```bash
# Run the authentication
./setup-gmail.sh
```

You'll see the OAuth URL again. This time:
1. Open the URL in your browser
2. Sign in with your Google account
3. You'll see a warning "Google hasn't verified this app"
   - Click "Advanced"
   - Click "Go to Mpass Test Automation (unsafe)"
4. Click "Allow" to grant permissions
5. You'll be redirected to localhost with a code in the URL
6. Copy the code parameter from the URL (everything after `code=`)
7. Paste it in the terminal
8. Press Enter

Example URL after redirect:
```
http://localhost/?code=4/0AanRRrt1234567890abcdefg&scope=https://www.googleapis.com/auth/gmail.readonly...
```

Copy this part: `4/0AanRRrt1234567890abcdefg`

## Verification

After successful authentication, you should see:
```
✅ Success! Token saved to token.json
```

Then verify files exist:
```bash
ls -la credentials.json token.json
```

Both files should be present.

## Next Step

Run your test:
```bash
npx cypress run --spec "cypress/e2e/signup_emailV.cy.ts"
```

## OAuth Request Details

Your OAuth request includes:
- **Scopes**: 
  - `gmail.readonly` - Read emails
  - `gmail.modify` - Mark emails as read
- **Client ID**: `269925320587-7ibfm46gunj6dj9o2uuca921r1smvlsd.apps.googleusercontent.com`
- **Redirect URI**: `http://localhost`
- **Access Type**: `offline` (to get refresh token)

These are all correct for Gmail API integration.
