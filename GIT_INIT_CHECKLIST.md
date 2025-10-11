# 🚀 Git Repository Initialization Checklist

Follow these steps to initialize and push the project to your Git repository.

## ✅ Pre-Initialization Checklist

Before initializing git, verify these files exist:

### Required Files (Created ✅)
- [x] `.gitignore` - Git ignore rules
- [x] `.gitattributes` - Line ending configuration
- [x] `README.md` - Project documentation
- [x] `SETUP.md` - Setup instructions
- [x] `GIT_REPOSITORY_GUIDE.md` - Git guide
- [x] `credentials.json.template` - Credentials template
- [x] `cypress.env.json.template` - Environment template
- [x] `package.json` - Dependencies

### Files That Should NOT Exist in Repo
- [ ] Verify `credentials.json` is NOT in git (it's ignored)
- [ ] Verify `token.json` is NOT in git (it's ignored)
- [ ] Verify `cypress.env.json` is NOT in git (it's ignored)
- [ ] Verify `usersStaging.json` is NOT in git (it's ignored)

---

## 📋 Step-by-Step Git Initialization

### Step 1: Initialize Git Repository

```bash
cd "/Users/baraissa/Documents/Mpass automation FE"
git init
```

Expected output:
```
Initialized empty Git repository in /Users/baraissa/Documents/Mpass automation FE/.git/
```

### Step 2: Verify .gitignore is Working

```bash
git status
```

**Check that these files DO NOT appear in the list:**
- ❌ credentials.json
- ❌ token.json
- ❌ cypress.env.json
- ❌ node_modules/
- ❌ cypress/fixtures/usersStaging.json
- ❌ cypress/videos/
- ❌ cypress/screenshots/
- ❌ cypress/reports/

**These files SHOULD appear:**
- ✅ package.json
- ✅ tsconfig.json
- ✅ README.md
- ✅ .gitignore
- ✅ cypress/e2e/*.cy.ts
- ✅ cypress/pages/*.ts
- ✅ etc.

### Step 3: Add Files to Staging

```bash
git add .
```

### Step 4: Verify What Will Be Committed

```bash
git status
```

Review the list carefully. If you see any sensitive files, STOP and update .gitignore!

### Step 5: Create Initial Commit

```bash
git commit -m "Initial commit: MAFID Test Automation Framework

- Add core test files (login, signup with email/phone verification)
- Add page object model structure
- Add Gmail API integration for email verification
- Add comprehensive documentation
- Add setup templates for new team members
- Configure .gitignore to exclude sensitive files"
```

### Step 6: Create GitHub/GitLab Repository

On GitHub or GitLab:
1. Create a new repository
2. Copy the repository URL (e.g., `https://github.com/username/mafid-automation.git`)

### Step 7: Add Remote and Push

```bash
# Add remote origin
git remote add origin <your-repository-url>

# Verify remote
git remote -v

# Push to main branch
git branch -M main
git push -u origin main
```

---

## 🔒 Security Verification

### After pushing, verify on GitHub/GitLab:

Visit your repository and confirm these files are **NOT** visible:
- ❌ credentials.json
- ❌ token.json
- ❌ cypress.env.json
- ❌ cypress/fixtures/usersStaging.json

If you accidentally committed sensitive files:

```bash
# Remove from git but keep locally
git rm --cached credentials.json token.json cypress.env.json

# Commit the removal
git commit -m "Remove sensitive files from git"

# Force push (if needed)
git push origin main --force
```

---

## 📥 For Team Members Cloning the Repo

Share these instructions with your team:

### 1. Clone the repository
```bash
git clone <repository-url>
cd "Mpass automation FE"
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create local configuration files
```bash
# Copy templates
cp credentials.json.template credentials.json
cp cypress.env.json.template cypress.env.json
```

### 4. Configure credentials
Edit the following files with actual values:
- `credentials.json` - Add Google Cloud credentials
- `cypress.env.json` - Add Gmail email

### 5. Generate OAuth token
```bash
node cypress/plugins/generateToken.js
```

### 6. Verify setup
```bash
npx cypress open --e2e
```

---

## 🔄 Daily Git Workflow

### Before starting work:
```bash
git pull origin main
npm install  # In case dependencies changed
```

### After making changes:
```bash
# Check what changed
git status

# Add files
git add <files>

# Commit
git commit -m "Description of changes"

# Push
git push origin main
```

### Branch workflow (recommended):
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push branch
git push origin feature/your-feature-name

# Create pull request on GitHub/GitLab
```

---

## 📊 Repository Statistics

After initialization, you can check:

```bash
# Number of files tracked
git ls-files | wc -l

# Repository size
du -sh .git

# See what's ignored
git status --ignored
```

---

## ✅ Final Checklist

Before sharing the repository:

- [ ] Git repository initialized
- [ ] All sensitive files properly ignored
- [ ] README.md is comprehensive
- [ ] SETUP.md has clear instructions
- [ ] Template files are provided
- [ ] .gitignore is working correctly
- [ ] Initial commit created
- [ ] Pushed to remote repository
- [ ] Verified sensitive files are NOT in remote repo
- [ ] Team members can clone and setup

---

## 🆘 Troubleshooting

### "File is already tracked by git"
```bash
# Remove from git but keep locally
git rm --cached <file>
git commit -m "Stop tracking <file>"
```

### "Accidentally committed sensitive file"
```bash
# If not pushed yet
git reset HEAD~1

# If already pushed
git rm --cached <sensitive-file>
git commit -m "Remove sensitive file"
git push --force
```

### ".gitignore not working"
```bash
# Clear git cache
git rm -r --cached .
git add .
git commit -m "Fix .gitignore"
```

---

## 🎉 You're Done!

Your repository is now properly configured and ready for team collaboration! 🚀

Share the repository URL with your team and point them to:
1. [README.md](README.md) - Overview
2. [SETUP.md](SETUP.md) - Setup instructions
3. [GIT_REPOSITORY_GUIDE.md](GIT_REPOSITORY_GUIDE.md) - What to commit

Happy coding! 💻
