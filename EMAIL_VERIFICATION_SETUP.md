# 📧 Gmail API Email Verification - Quick Start

## ✨ What's New

Your Cypress tests can now **automatically verify emails** using Gmail API! No more manual clicking of verification links.

## 🎯 Quick Setup (3 Steps)

### Step 1: Google Cloud Setup (5 minutes)

1. **Create Google Cloud Project**
   - Visit: https://console.cloud.google.com
   - Create new project: "Mpass Email Verification"

2. **Enable Gmail API**
   - Go to: https://console.cloud.google.com/apis/library
   - Search "Gmail API" → Enable

3. **Create OAuth Credentials**
   - Go to: https://console.cloud.google.com/apis/credentials
   - CREATE CREDENTIALS → OAuth client ID → Desktop app
   - Download JSON file

4. **Save Credentials**
   ```bash
   # Rename downloaded file to credentials.json
   mv ~/Downloads/client_secret_*.json credentials.json
   ```

### Step 2: Authenticate (2 minutes)

Run the setup script:

```bash
./setup-gmail.sh
```

Or manually:

```bash
node cypress/plugins/generateToken.js
```

Follow the prompts:
1. Open the URL in your browser
2. Sign in with Gmail account
3. Allow permissions (click "Advanced" → "Go to app (unsafe)")
4. Copy the authorization code
5. Paste in terminal

### Step 3: Run Tests

```bash
npx cypress run --spec "cypress/e2e/signup_emailV.cy.ts"
```

🎉 **That's it!** Email verification is now fully automated.

## 🔍 What Happens During Test

```
1. User signs up
   └─> Email sent via Infobip
   
2. Gmail API activates
   └─> Checks Gmail inbox for verification email
   └─> Retries every 3 seconds (max 10 attempts)
   
3. Email found
   └─> Extracts verification link from HTML
   └─> Automatically visits link
   
4. Email verified ✅
   └─> Test continues with login
```

## 📊 Test Output Example

```
📧 Starting Gmail API email verification process
📬 Fetching verification email from Gmail for: baramaf9+auto1728489600@gmail.com
[Gmail] Attempt 1/10: Checking inbox...
[Gmail] ✅ Found verification link: https://mafid-sit.progressive...
✅ Verification email received!
🔗 Verification link: https://...
🌐 Clicking verification link...
✅✅ Email verified successfully!
```

## 🔐 Security

✅ **credentials.json** and **token.json** are in .gitignore  
✅ Never commit these files to git  
✅ Each developer needs their own credentials

## 🛠️ Files Modified

| File | Purpose |
|------|---------|
| `cypress/plugins/gmailPlugin.ts` | Gmail API integration |
| `cypress/plugins/generateToken.js` | OAuth token generator |
| `cypress/pages/signup_page.cy.ts` | Updated `verifyEmailFromInbox()` |
| `cypress.config.ts` | Added Gmail tasks |
| `.gitignore` | Protected credentials |

## 🐛 Troubleshooting

### "credentials.json not found"
→ Download OAuth credentials from Google Cloud and save as `credentials.json`

### "token.json not found"  
→ Run: `./setup-gmail.sh` or `node cypress/plugins/generateToken.js`

### "Invalid grant" error
→ Token expired. Delete `token.json` and run setup script again

### Gmail not finding emails
→ Check email was sent (look for Infobip POST 200)  
→ Verify email address matches exactly  
→ Wait longer (increase `retryDelay` in code)

## 📚 Detailed Documentation

For complete setup instructions, see: **[GMAIL_API_SETUP.md](GMAIL_API_SETUP.md)**

## 🔄 Token Refresh

Tokens expire periodically. To refresh:

```bash
rm token.json
./setup-gmail.sh
```

## 🎯 Testing

Test the integration:

```bash
# Run full test with reporting
npx cypress run --spec "cypress/e2e/signup_emailV.cy.ts" \
  --reporter mochawesome \
  --reporter-options "reportDir=cypress/reports/html,reportFilename=signup_emailV-report"

# Or open Cypress UI
npx cypress open --e2e
```

## ✅ Success Checklist

- [ ] Google Cloud project created
- [ ] Gmail API enabled
- [ ] OAuth credentials downloaded as `credentials.json`
- [ ] Ran `./setup-gmail.sh` successfully
- [ ] `token.json` created
- [ ] Test runs and verifies email automatically
- [ ] Credentials added to `.gitignore`

## 🚀 Next Steps

1. **Run your tests** - Email verification is now automated!
2. **Monitor quota** - Check Google Cloud Console for API usage
3. **Add cleanup** - Use `cy.task('gmail:cleanup')` to delete test emails

## 💡 Tips

- Gmail API has generous free tier (1B quota units/day)
- Each email check uses ~5-10 quota units
- Tokens last for days/weeks before needing refresh
- You can use same credentials across multiple machines

---

**Need help?** Check [GMAIL_API_SETUP.md](GMAIL_API_SETUP.md) for detailed instructions.

## Troubleshooting

- **Emails not found**: Increase timeout in `waitForEmail` function
- **Wrong credentials**: Check environment variables in `cypress.env.json`
- **API errors**: Verify your email service API key and permissions
