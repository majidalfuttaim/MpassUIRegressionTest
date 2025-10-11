# 🚀 Gmail API Quick Reference

## One-Time Setup (Do Once)

### 1. Google Cloud (5 min)
```
1. https://console.cloud.google.com → Create Project
2. Enable Gmail API
3. Create OAuth Desktop credentials
4. Download → Save as credentials.json
```

### 2. Authenticate (2 min)
```bash
./setup-gmail.sh
# Follow OAuth flow → Copy code → Paste → Done!
```

## Daily Usage

### Run Test
```bash
# Full test with email verification
npx cypress run --spec "cypress/e2e/signup_emailV.cy.ts"

# With reporting
npx cypress run --spec "cypress/e2e/signup_emailV.cy.ts" \
  --reporter mochawesome \
  --reporter-options "reportDir=cypress/reports/html,reportFilename=signup-report"

# Open Cypress UI
npx cypress open --e2e
```

## Files You Need

| File | Status | Where to Get |
|------|--------|--------------|
| `credentials.json` | ❌ You create | Google Cloud Console |
| `token.json` | ✅ Auto-generated | Run setup-gmail.sh |

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Token expired | `rm token.json && ./setup-gmail.sh` |
| No credentials | Download from Google Cloud |
| Email not found | Check Infobip sent it (POST 200) |

## Test Flow

```
Signup → Email sent → Gmail API fetches → Extract link → Visit → Verified ✅
         (Infobip)    (auto-retry 10x)   (regex)      (auto)
```

## Logs You'll See

```
✅ POST /dbconnections/signup - 200
✅ POST /mafid/infobip/send-email - 200
📧 Starting Gmail API email verification process
[Gmail] Attempt 1/10: Checking inbox...
[Gmail] ✅ Found verification link
✅✅ Email verified successfully!
```

## Important Files

```
/cypress/plugins/gmailPlugin.ts      → Gmail API logic
/cypress/plugins/generateToken.js    → OAuth setup
/cypress/pages/signup_page.cy.ts     → verifyEmailFromInbox()
/cypress.config.ts                   → Task registration
```

## Commands

```bash
# Setup
./setup-gmail.sh

# Run test
npx cypress run --spec "cypress/e2e/signup_emailV.cy.ts"

# Check credentials
ls -la credentials.json token.json

# Refresh token
rm token.json && node cypress/plugins/generateToken.js
```

## Security Checklist

- [x] credentials.json in .gitignore
- [x] token.json in .gitignore
- [ ] Never commit credentials
- [ ] Never share OAuth tokens

## Links

- [Full Setup Guide](GMAIL_API_SETUP.md)
- [Quick Start](EMAIL_VERIFICATION_SETUP.md)
- [Implementation Details](IMPLEMENTATION_SUMMARY.md)
- [Google Cloud Console](https://console.cloud.google.com)

## Support

**Token issues?** Delete token.json and re-authenticate  
**Email not found?** Check retry count and email delivery  
**API quota?** Check Google Cloud Console dashboard  

---

**Ready?** Run `./setup-gmail.sh` to get started! 🎉
