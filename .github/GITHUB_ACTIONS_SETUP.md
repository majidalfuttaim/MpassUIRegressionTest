# GitHub Actions Setup Guide

This guide will help you configure GitHub Actions for running Cypress E2E tests automatically.

## Quick Start

**Option 1: Use the helper script (Recommended)**
```bash
./.github/get-secrets-content.sh
```
This script will display all the content you need to copy for GitHub secrets.

**Option 2: Manual setup**
Follow the detailed instructions below.

---

## Required GitHub Secrets

You need to add the following secrets to your GitHub repository:

### 1. Navigate to GitHub Secrets
1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

### 2. Add Required Secrets

#### `GMAIL_CREDENTIALS`
This is your Gmail API credentials file content.

**How to get it:**
```bash
cat credentials.json
```

**Copy the entire JSON content** and paste it as the secret value.

Example format:
```json
{
  "installed": {
    "client_id": "your-client-id.apps.googleusercontent.com",
    "project_id": "your-project-id",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    ...
  }
}
```

---

#### `GMAIL_TOKEN`
This is your Gmail API token file content.

**How to get it:**
```bash
cat token.json
```

**Copy the entire JSON content** and paste it as the secret value.

Example format:
```json
{
  "type": "authorized_user",
  "client_id": "your-client-id.apps.googleusercontent.com",
  "client_secret": "your-client-secret",
  "refresh_token": "your-refresh-token"
}
```

---

#### `CYPRESS_ENV` (Optional)
This is your Cypress environment configuration. This secret is optional - the tests will use the default configuration from the Cypress config files if not provided.

**How to get it:**
```bash
cat cypress/cypress.env.json
```

**Copy the entire JSON content** and paste it as the secret value.

Example format:
```json
{
    "Prod": {
        "baseUrl": "https://identity.progressive.majidalfuttaim.com/landing/client/",
        "defaultCommandTimeout": 10000,
        "video": true,
        "fixtureFile": "./cypress/fixtures/clientDetailsProd.json"
    },
    "Staging": {
        "fixtureFile": "./cypress/fixtures/clientDetailsStaging.json"
    }
}
```

**Note:** If you skip this secret, remove or comment out the "Create Cypress environment file" step in the workflow files.

---

#### `CYPRESS_RECORD_KEY` (Optional)
Only needed if you want to use Cypress Dashboard for recording test runs.

**How to get it:**
1. Sign up at https://dashboard.cypress.io/
2. Create a project
3. Copy the record key provided

**Note:** If you don't want to use Cypress Dashboard, you can skip this and remove the `record: true` line from the workflow file.

---

## Workflow Configuration

The workflow file is located at: `.github/workflows/cypress-tests.yml`

### Triggers
The workflow runs on:
- **Push to main branch** - Automatically runs when code is pushed to main
- **Pull requests to main** - Runs on PRs targeting main branch
- **Manual trigger** - Can be triggered manually from GitHub Actions tab

### Features
- ✅ Runs on Ubuntu with Chrome browser
- ✅ Node.js 24.9.0 (matches your local environment)
- ✅ Parallel execution across 3 containers for faster test runs
- ✅ Tests all 6 test specs (signup, login, forget password, emails)
- ✅ Generates Mochawesome HTML reports
- ✅ Uploads test artifacts (reports, screenshots, videos)
- ✅ Screenshot/video upload on test failures
- ✅ Test summary in GitHub Actions UI

### Test Specs Included
1. `signup_emailV.cy.ts` - Email verification signup
2. `signup_phoneV.cy.ts` - Phone verification signup
3. `signup_noV.cy.ts` - No verification signup
4. `login.cy.ts` - Login tests
5. `forget_password.cy.ts` - Password reset tests
6. `emails.cy.ts` - Email verification tests

---

## How to Run

### Automatic Runs
Tests run automatically when you push to main or create a PR.

### Manual Run
1. Go to your repository on GitHub
2. Click **Actions** tab
3. Select **Cypress E2E Tests** workflow
4. Click **Run workflow** button
5. Select branch and click **Run workflow**

---

## Viewing Results

### Test Reports
1. Go to **Actions** tab
2. Click on a workflow run
3. Scroll down to **Artifacts** section
4. Download `cypress-reports-*` to view HTML reports
5. Open `cypress/reports/html/index.html` in a browser

### Screenshots & Videos (on failures)
- Download `cypress-screenshots-*` artifact
- Download `cypress-videos-*` artifact

### Test Summary
- View the summary directly in the GitHub Actions run page
- Shows test execution details, environment, and specs run

---

## Customization

### Change Test Environment
Edit `.github/workflows/cypress-tests.yml`:

**For Production:**
```yaml
- name: Run Cypress tests (Production)
  uses: cypress-io/github-action@v6
  with:
    config-file: cypress.config.ts  # Change from cypress.config.dev.ts
```

### Add/Remove Test Specs
Edit the `spec:` section:
```yaml
spec: |
  cypress/e2e/signup_emailV.cy.ts
  cypress/e2e/login.cy.ts
  # Add or remove specs here
```

### Adjust Parallel Containers
Change the matrix containers count:
```yaml
matrix:
  containers: [1, 2, 3, 4, 5]  # Increase for more parallelization
```

---

## Troubleshooting

### Gmail API Errors
- Verify `GMAIL_CREDENTIALS` and `GMAIL_TOKEN` secrets are set correctly
- Ensure token hasn't expired (regenerate if needed)
- Check that credentials.json and token.json have proper JSON format

### Test Failures
- Check the uploaded screenshots and videos in Artifacts
- Review the test logs in the GitHub Actions run
- Ensure all npm dependencies are compatible

### Workflow Not Running
- Check that the workflow file is in `.github/workflows/` directory
- Verify YAML syntax is correct
- Ensure you have write permissions to the repository

---

## Security Notes

⚠️ **IMPORTANT:**
- Never commit `credentials.json`, `token.json`, or `cypress.env.json` to the repository
- These files are in `.gitignore` to prevent accidental commits
- Only store them as GitHub Secrets
- Secrets are encrypted and only exposed during workflow execution

---

## Next Steps

1. ✅ Add all required secrets to GitHub
2. ✅ Push this workflow file to main branch
3. ✅ Monitor the first automated run
4. ✅ Review test reports and artifacts
5. ✅ Customize as needed for your team's workflow

---

## Support

For issues with:
- **Cypress**: https://docs.cypress.io/
- **GitHub Actions**: https://docs.github.com/en/actions
- **Gmail API**: See `GMAIL_API_SETUP.md` in this repository
