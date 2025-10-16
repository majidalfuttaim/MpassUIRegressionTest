# GitHub Actions - Quick Reference

## 📋 What Was Added

Your project now has **3 GitHub Actions workflows** that will automatically run your Cypress tests:

### 1. **Main Workflow** (`cypress-tests.yml`)
- ✅ Runs on every push to `main` branch
- ✅ Runs on pull requests
- ✅ **Parallel execution** across 3 containers (faster!)
- ✅ All 6 test suites included

### 2. **Simple Workflow** (`cypress-tests-simple.yml`) 
- ✅ Same triggers as main workflow
- ✅ **No parallelization** (simpler, easier to debug)
- ✅ All tests run sequentially

### 3. **Nightly Tests** (`nightly-tests.yml`)
- ✅ Runs automatically every day at **2 AM UTC**
- ✅ Can also be triggered manually
- ✅ Full test suite with 90-day artifact retention

---

## 🚀 Getting Started (3 Steps)

### Step 1: Get Your Secrets Content
Run this command in your project directory:
```bash
./.github/get-secrets-content.sh
```

This will display all the content you need to copy.

### Step 2: Add Secrets to GitHub
1. Go to: https://github.com/baraIssa/MpassUIRegressionTest/settings/secrets/actions
2. Click "New repository secret"
3. Add these 2 **required** secrets:
   - `GMAIL_CREDENTIALS` (from credentials.json)
   - `GMAIL_TOKEN` (from token.json)
4. Optionally add:
   - `CYPRESS_ENV` (from cypress/cypress.env.json)

### Step 3: Done! 🎉
Your workflows are already pushed and will run automatically!

---

## 📊 Viewing Test Results

### After a workflow runs:
1. Go to the **Actions** tab in GitHub
2. Click on a workflow run
3. Scroll to **Artifacts** section
4. Download the reports to view HTML test results

### Files you'll get:
- **HTML Reports**: Beautiful test reports with pass/fail details
- **Screenshots**: Captured on test failures
- **Videos**: Screen recordings of test runs

---

## 🎯 Which Workflow Should You Use?

| Workflow | When to Use | Speed | Complexity |
|----------|------------|-------|------------|
| **Main** (`cypress-tests.yml`) | Production use, faster results | ⚡⚡⚡ Fast (parallel) | Medium |
| **Simple** (`cypress-tests-simple.yml`) | Debugging, simpler setup | ⚡ Slower (sequential) | Low |
| **Nightly** (`nightly-tests.yml`) | Scheduled regression testing | ⚡⚡⚡ Fast | Medium |

**Recommendation**: Start with `cypress-tests-simple.yml`, then switch to `cypress-tests.yml` for production.

---

## 🔧 Disabling a Workflow

If you want to use only one workflow, you can disable the others:

1. Go to **Actions** tab
2. Click on the workflow you want to disable
3. Click the **"..."** menu (top right)
4. Select **"Disable workflow"**

Or simply delete the unwanted `.yml` files from `.github/workflows/`.

---

## ⚙️ Customization

All workflows are in `.github/workflows/` and can be edited:

### Change schedule for nightly tests:
Edit `nightly-tests.yml`, line with `cron:`:
```yaml
- cron: '0 2 * * *'  # 2 AM UTC daily
# Change to: '0 14 * * *'  # 2 PM UTC daily
```

### Add more test specs:
Add to the `spec:` section in any workflow:
```yaml
spec: |
  cypress/e2e/signup_emailV.cy.ts
  cypress/e2e/your-new-test.cy.ts
```

### Change browser:
Replace `browser: chrome` with:
```yaml
browser: electron  # or firefox, edge
```

---

## 📚 Full Documentation

For detailed setup instructions, see:
- **`.github/GITHUB_ACTIONS_SETUP.md`** - Complete setup guide
- **`.github/get-secrets-content.sh`** - Helper script for secrets

---

## ✅ Current Status

- ✅ Workflows pushed to GitHub
- ✅ Ready to run (just add secrets!)
- ✅ All test specs included
- ✅ Reports will be generated automatically

---

## 🆘 Need Help?

Run the helper script to verify your secrets are ready:
```bash
./.github/get-secrets-content.sh
```

Check if files exist:
```bash
ls -la credentials.json token.json cypress/cypress.env.json
```

If missing, run:
```bash
./setup-gmail-interactive.sh
```

---

**Next Step**: Add the 2 required secrets to GitHub, and your tests will run automatically! 🚀
