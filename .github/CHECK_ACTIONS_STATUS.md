# GitHub Actions Status Check

## 🔍 Quick Status Check

### 1. **Check if Actions are Running**
Visit: https://github.com/majidalfuttaim/MpassUIRegressionTest/actions

Look for:
- ✅ Green checkmarks = Tests passing
- ❌ Red X = Tests failing
- 🟡 Yellow dot = Tests running
- ⚪ Gray = No runs yet or skipped

### 2. **Check if Secrets are Configured**
Visit: https://github.com/majidalfuttaim/MpassUIRegressionTest/settings/secrets/actions

You should see:
- ✅ `GMAIL_CREDENTIALS` - Required
- ✅ `GMAIL_TOKEN` - Required
- ⚙️ `CYPRESS_ENV` - Optional (can use empty object if not set)

---

## 🚀 Manual Trigger Test

To manually test if Actions work:

1. Go to: https://github.com/majidalfuttaim/MpassUIRegressionTest/actions
2. Click on **"Cypress E2E Tests"** workflow (left sidebar)
3. Click **"Run workflow"** button (top right)
4. Select branch: `main`
5. Click **"Run workflow"**

This will immediately start a test run.

---

## 📋 What to Look For

### ✅ If Working Correctly:
```
✓ Checkout code
✓ Setup Node.js
✓ Install dependencies
✓ Create Gmail credentials
✓ Create Cypress environment file (optional)
✓ Run Cypress tests (Staging)
✓ Upload test artifacts
```

### ❌ Common Errors:

#### Error: "secrets.GMAIL_CREDENTIALS is empty"
**Solution:** Add the `GMAIL_CREDENTIALS` secret
```bash
cat credentials.json
# Copy output and add as secret
```

#### Error: "secrets.GMAIL_TOKEN is empty"
**Solution:** Add the `GMAIL_TOKEN` secret
```bash
cat token.json
# Copy output and add as secret
```

#### Error: "Gmail API authentication failed"
**Solution:** Regenerate token.json
```bash
node cypress/plugins/generateToken.js
# Or run: ./setup-gmail-interactive.sh
```

#### Error: "npm ci failed"
**Solution:** Check package-lock.json is committed
```bash
git add package-lock.json
git commit -m "Add package-lock.json"
git push
```

---

## 🔧 Get Secret Values

Run these commands to get the content for GitHub Secrets:

### GMAIL_CREDENTIALS:
```bash
cat credentials.json
```

### GMAIL_TOKEN:
```bash
cat token.json
```

### CYPRESS_ENV (optional):
```bash
cat cypress/cypress.env.json
```

Copy the **entire JSON output** (including curly braces) and paste into GitHub Secrets.

---

## 📊 Current Workflow Configuration

### Triggers:
- ✅ **Push to main** - Runs automatically on every push
- ✅ **Pull requests** - Runs on PRs targeting main
- ✅ **Manual trigger** - Can be triggered from Actions tab

### Parallel Execution:
- Runs across 3 containers for faster execution
- Each container runs a subset of tests

### Test Specs:
```yaml
- signup_emailV.cy.ts
- signup_phoneV.cy.ts
- signup_noV.cy.ts
- login.cy.ts
- forget_password.cy.ts
- emails.cy.ts
- social_login.cy.ts
```

---

## 🎯 Expected Duration

With optimizations:
- **Full suite**: ~7-8 minutes (parallel execution)
- **Individual tests**:
  - Login: ~3m 30s
  - Forget Password: ~1m 44s
  - Signup Email: ~2m 25s
  - Signup Phone: ~1m 5s

---

## 📥 View Test Results

After a workflow run completes:

1. Go to the workflow run page
2. Scroll to **Artifacts** section
3. Download:
   - `cypress-reports-*` - HTML test reports
   - `cypress-screenshots-*` - Screenshots (if tests failed)
   - `cypress-videos-*` - Videos (if tests failed)

Open `cypress/reports/html/index.html` to view detailed test results.

---

## 🔄 Trigger Workflow from Command Line

To trigger a workflow run without making changes:

```bash
cd "/Users/baraissa/Documents/Mpass automation FE"

# Make a small change
echo "# GitHub Actions test" >> .github/TEST_TRIGGER.md

# Commit and push
git add .github/TEST_TRIGGER.md
git commit -m "🧪 Test GitHub Actions workflow"
git push origin main
```

This will trigger the workflow automatically.

---

## ✅ Verification Checklist

- [ ] GitHub Secrets configured (GMAIL_CREDENTIALS, GMAIL_TOKEN)
- [ ] Workflow files exist in `.github/workflows/`
- [ ] No syntax errors in workflow YAML files
- [ ] Repository has Actions enabled (check Settings → Actions)
- [ ] You have write permissions to the repository
- [ ] Workflow has run at least once (check Actions tab)

---

## 📞 Need Help?

If Actions are not working:
1. Check the workflow run logs for specific errors
2. Verify all secrets are set correctly
3. Ensure workflow YAML syntax is valid
4. Check repository Actions permissions

**Quick test:** Push this file to trigger a workflow run!
