# 🚀 Project Setup Guide

Complete setup instructions for getting the MAFID Automation Framework running on your machine.

## 📋 Prerequisites Check

Before starting, ensure you have:

- [ ] **Node.js** v18 or higher installed
- [ ] **npm** v8 or higher installed
- [ ] **Git** installed
- [ ] **Gmail account** with API access enabled
- [ ] **Google Cloud Project** (for Gmail API)

### Verify Prerequisites

```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show 8.x.x or higher
git --version     # Should show git version
```

## 📥 Step 1: Clone and Install

### 1.1 Clone the Repository

```bash
git clone <repository-url>
cd "Mpass automation FE"
```

### 1.2 Install Dependencies

```bash
npm install
```

This will install:
- Cypress
- TypeScript
- Mochawesome (reporting)
- Gmail API libraries
- Other dependencies

### 1.3 Verify Cypress Installation

```bash
npx cypress verify
```

## 🔐 Step 2: Gmail API Setup

### 2.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Gmail API for your project

### 2.2 Create OAuth Credentials

1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > OAuth client ID**
3. Choose **Desktop app**
4. Download the credentials JSON file

### 2.3 Configure Credentials

1. Copy the template file:
   ```bash
   cp credentials.json.template credentials.json
   ```

2. Edit `credentials.json` with your downloaded credentials

3. **IMPORTANT**: Never commit this file! It's in `.gitignore`

### 2.4 Generate Access Token

Run the interactive setup:

```bash
chmod +x setup-gmail-interactive.sh
./setup-gmail-interactive.sh
```

Or run the plugin manually:
```bash
node cypress/plugins/generateToken.js
```

This will:
- Open a browser for Google authentication
- Generate `token.json` with access/refresh tokens
- Save it locally (also in `.gitignore`)

## ⚙️ Step 3: Environment Configuration

### 3.1 Create Environment File

```bash
cp cypress.env.json.template cypress.env.json
```

### 3.2 Edit Configuration

Edit `cypress.env.json`:

```json
{
  "baseUrl": "https://mafid-sit.progressive.majidalfuttaim.com",
  "gmailEmail": "your-actual-email@gmail.com"
}
```

Replace `your-actual-email@gmail.com` with the Gmail account you set up.

## 🧪 Step 4: Verify Setup

### 4.1 Run a Simple Test

Open Cypress UI:
```bash
npx cypress open --e2e
```

### 4.2 Run Email Verification Test

Test the Gmail API integration:
```bash
npx cypress run --spec "cypress/e2e/signup_emailV.cy.ts"
```

If this passes, your setup is complete! ✅

## 📁 Step 5: Understand the File Structure

### Files You Should NEVER Commit:
- ❌ `credentials.json` - Gmail API credentials
- ❌ `token.json` - OAuth access token
- ❌ `cypress.env.json` - Environment config
- ❌ `cypress/fixtures/usersStaging.json` - Generated test data
- ❌ `node_modules/` - Dependencies
- ❌ `cypress/videos/` - Test recordings
- ❌ `cypress/screenshots/` - Test screenshots

### Files You SHOULD Commit:
- ✅ `*.cy.ts` - Test files
- ✅ `cypress/pages/*.ts` - Page objects
- ✅ `cypress/fixtures/client*.json` - Client configs (no sensitive data)
- ✅ `package.json` - Dependencies list
- ✅ `tsconfig.json` - TypeScript config
- ✅ `cypress.config.ts` - Cypress config
- ✅ `README.md` - Documentation

## 🔧 Step 6: Configure Your IDE

### VS Code (Recommended)

Install recommended extensions:
- **Cypress Snippets** - For code completion
- **ESLint** - For code quality
- **Prettier** - For code formatting

### IntelliJ/WebStorm

1. Enable TypeScript support
2. Mark `cypress` as test sources root
3. Install Cypress plugin

## ✅ Final Verification Checklist

Before starting development, verify:

- [ ] `npm install` completed successfully
- [ ] `credentials.json` exists and is configured
- [ ] `token.json` was generated
- [ ] `cypress.env.json` is configured
- [ ] Can open Cypress UI: `npx cypress open --e2e`
- [ ] Email verification test passes
- [ ] Phone verification test passes
- [ ] Login test passes

## 🐛 Troubleshooting

### Issue: "credentials.json not found"
**Solution**: 
```bash
cp credentials.json.template credentials.json
# Edit with your Google Cloud credentials
```

### Issue: "Gmail API error: invalid_grant"
**Solution**: 
```bash
rm token.json
node cypress/plugins/generateToken.js
# Re-authenticate
```

### Issue: "Cypress binary not found"
**Solution**: 
```bash
npx cypress install
npx cypress verify
```

### Issue: Tests fail with "Cannot find module"
**Solution**: 
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 Next Steps

Once setup is complete:

1. Read [README.md](README.md) for project overview
2. Review [GMAIL_API_SETUP.md](GMAIL_API_SETUP.md) for detailed API docs
3. Check [CYPRESS_RUN_COMMANDS.md](CYPRESS_RUN_COMMANDS.md) for test commands
4. Review test files in `cypress/e2e/`
5. Understand Page Objects in `cypress/pages/`

## 🆘 Getting Help

If you're stuck:

1. Check [OAUTH_TROUBLESHOOTING.md](OAUTH_TROUBLESHOOTING.md)
2. Review existing documentation files
3. Contact the team
4. Check Cypress documentation: https://docs.cypress.io

## 🎉 You're Ready!

Your development environment is now set up. Happy testing! 🚀
