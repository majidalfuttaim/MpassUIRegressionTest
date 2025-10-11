# 📦 Git Repository Structure Guide

This document explains which files should be committed to the repository and which should be kept local.

## ✅ Files TO COMMIT (Core Project Files)

### Configuration Files
- ✅ `package.json` - Project dependencies
- ✅ `tsconfig.json` - TypeScript configuration
- ✅ `cypress.config.ts` - Cypress main configuration
- ✅ `cypress.config.dev.ts` - Cypress dev configuration
- ✅ `.gitignore` - Git ignore rules
- ✅ `.gitattributes` - Git attributes for line endings

### Documentation
- ✅ `README.md` - Project overview
- ✅ `SETUP.md` - Setup instructions
- ✅ `GMAIL_API_SETUP.md` - Gmail API setup guide
- ✅ `EMAIL_AUTOMATION_GUIDE.md` - Email automation guide
- ✅ `EMAIL_VERIFICATION_SETUP.md` - Email verification setup
- ✅ `OAUTH_ACCESS_GUIDE.md` - OAuth access guide
- ✅ `OAUTH_TROUBLESHOOTING.md` - OAuth troubleshooting
- ✅ `CYPRESS_RUN_COMMANDS.md` - Cypress commands reference
- ✅ `LOGIN_TEST_COMMANDS.md` - Login test commands
- ✅ `QUICK_REFERENCE.md` - Quick reference guide
- ✅ `IMPLEMENTATION_SUMMARY.md` - Implementation summary

### Template Files (Examples for team members)
- ✅ `credentials.json.template` - Gmail credentials template
- ✅ `cypress.env.json.template` - Environment config template
- ✅ `cypress/fixtures/usersStaging.json.template` - User data template

### Shell Scripts
- ✅ `setup-gmail.sh` - Gmail setup script
- ✅ `setup-gmail-interactive.sh` - Interactive Gmail setup

### Test Files
- ✅ `cypress/e2e/*.cy.ts` - All test files
  - `login.cy.ts`
  - `signup_emailV.cy.ts`
  - `signup_phoneV.cy.ts`
  - `social_login.cy.ts`
  - `emails.cy.ts`

### Page Object Files
- ✅ `cypress/pages/*.ts` - All page object files
  - `login_page.cy.ts`
  - `signup_page.cy.ts`
  - `social_login_page.ts`

### Support Files
- ✅ `cypress/support/*.ts` - Support and helper files
  - `commands.ts`
  - `e2e.ts`
  - `emailHelpers.ts`
  - `gmailHelpers.ts`

### Plugin Files
- ✅ `cypress/plugins/*.ts` - Plugin files
  - `gmailPlugin.ts`
  - `generateToken.js`

### Fixture Files (Non-Sensitive Data Only)
- ✅ `cypress/fixtures/clientDetailsStaging.json` - Client configs
- ✅ `cypress/fixtures/clientDetailsProd.json` - Production client configs
- ✅ `cypress/fixtures/clientEmailRequired.json` - Email verification clients
- ✅ `cypress/fixtures/clientPhoneRequired.json` - Phone verification clients

### Static Assets
- ✅ `cypress/assets/*` - CSS, JS, fonts
  - `app.css`
  - `app.js`
  - `*.woff`, `*.woff2` - Font files

---

## ❌ Files NOT TO COMMIT (Local/Generated Files)

### Sensitive Credentials (🔒 NEVER COMMIT)
- ❌ `credentials.json` - Gmail API credentials (SENSITIVE!)
- ❌ `token.json` - OAuth access token (SENSITIVE!)
- ❌ `cypress.env.json` - Environment variables (may contain secrets)

### Generated Test Data
- ❌ `cypress/fixtures/usersStaging.json` - Auto-generated user data
- ❌ `cypress/output.json` - Test output

### Dependencies
- ❌ `node_modules/` - NPM packages (reinstall with `npm install`)
- ❌ `package-lock.json` - Lock file (generated automatically)
- ❌ `yarn.lock` - Yarn lock file
- ❌ `pnpm-lock.yaml` - PNPM lock file

### Generated Files
- ❌ `cypress/videos/` - Test recordings
- ❌ `cypress/screenshots/` - Test screenshots
- ❌ `cypress/downloads/` - Downloaded files during tests
- ❌ `cypress/reports/` - Test reports (HTML/JSON)

### Build Files
- ❌ `dist/` - Build output
- ❌ `build/` - Build output
- ❌ `.cache/` - Cache files
- ❌ `*.tsbuildinfo` - TypeScript build info

### IDE Files
- ❌ `.vscode/` - VS Code settings (personal preferences)
- ❌ `.idea/` - IntelliJ/WebStorm settings
- ❌ `*.swp`, `*.swo` - Vim swap files

### OS Files
- ❌ `.DS_Store` - macOS folder settings
- ❌ `Thumbs.db` - Windows thumbnail cache
- ❌ `Desktop.ini` - Windows folder settings

### Logs
- ❌ `*.log` - All log files
- ❌ `npm-debug.log*` - NPM debug logs
- ❌ `yarn-debug.log*` - Yarn debug logs

### Temporary Files
- ❌ `tmp/` - Temporary files
- ❌ `temp/` - Temporary files
- ❌ `.tmp/` - Temporary files

---

## 🔍 How to Verify Before Committing

### Check what will be committed:
```bash
git status
```

### Check ignored files:
```bash
git status --ignored
```

### Verify .gitignore is working:
```bash
# These should NOT appear in git status:
ls credentials.json      # Should be ignored
ls token.json           # Should be ignored
ls cypress.env.json     # Should be ignored
```

---

## 🚨 Security Checklist

Before pushing to remote repository, ensure:

- [ ] No `credentials.json` in commit
- [ ] No `token.json` in commit
- [ ] No `cypress.env.json` in commit
- [ ] No `usersStaging.json` in commit
- [ ] No sensitive passwords or API keys in any file
- [ ] All template files use placeholder values

---

## 📝 First-Time Git Setup

### Initialize repository:
```bash
git init
git add .
git status  # Verify only correct files are staged
```

### Verify .gitignore is working:
```bash
# These files should appear as "Untracked files" but NOT in "Changes to be committed":
# - credentials.json
# - token.json
# - cypress.env.json
# - node_modules/
```

### Commit core files:
```bash
git commit -m "Initial commit: Core test automation framework"
```

### Push to remote:
```bash
git remote add origin <your-repo-url>
git branch -M main
git push -u origin main
```

---

## 🔄 Cloning on New Machine

When team members clone the repo:

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd "Mpass automation FE"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create local config files from templates**
   ```bash
   cp credentials.json.template credentials.json
   cp cypress.env.json.template cypress.env.json
   ```

4. **Configure with actual credentials**
   - Edit `credentials.json` with Google Cloud credentials
   - Edit `cypress.env.json` with actual email

5. **Generate OAuth token**
   ```bash
   node cypress/plugins/generateToken.js
   ```

6. **Verify setup**
   ```bash
   npx cypress open --e2e
   ```

---

## 📚 Additional Resources

- See [SETUP.md](SETUP.md) for complete setup instructions
- See [README.md](README.md) for project overview
- See [GMAIL_API_SETUP.md](GMAIL_API_SETUP.md) for Gmail API details

---

## ✅ Summary

**TO COMMIT**: Source code, tests, configs, documentation, templates  
**NOT TO COMMIT**: Credentials, tokens, generated files, dependencies, build output

When in doubt, check `.gitignore`! 🔍
