# VPN Requirement for GitHub Actions

## ⚠️ **Current Issue**

The test environment requires VPN access:
```
https://mafid-sit.progressive.majidalfuttaim.com
```

**Error when running on GitHub's cloud runners:**
```
CypressError: `cy.visit()` failed trying to load:
https://mafid-sit.progressive.majidalfuttaim.com/landing/client/...

We attempted to make an http request to this URL but the request failed without a response.
```

**Reason:** GitHub's cloud runners (`ubuntu-latest`) don't have access to your internal VPN-protected staging environment.

---

## ✅ **Solution: Use Self-Hosted Runner**

A self-hosted GitHub runner runs on **your own machine/server** that has VPN access.

### **Quick Setup:**

1. **Go to:**
   ```
   https://github.com/majidalfuttaim/MpassUIRegressionTest/settings/actions/runners/new
   ```

2. **Follow GitHub's setup instructions** for your OS

3. **Ensure VPN is connected** on the runner machine

4. **Use the new workflow file:**
   - `.github/workflows/cypress-tests-selfhosted.yml`
   - Already configured with `runs-on: self-hosted`

---

## 📋 **Current Workflow Files**

### **Cloud Runners (Won't Work - VPN Required):**
- ❌ `.github/workflows/cypress-tests.yml` - Uses `ubuntu-latest`
- ❌ `.github/workflows/cypress-tests-simple.yml` - Uses `ubuntu-latest`
- ❌ `.github/workflows/nightly-tests.yml` - Uses `ubuntu-latest`

**These will fail** because they can't access the VPN-protected staging environment.

### **Self-Hosted Runner (Will Work):**
- ✅ `.github/workflows/cypress-tests-selfhosted.yml` - Uses `self-hosted`

**This will work** once you set up a self-hosted runner with VPN access.

---

## 🎯 **Two Options to Proceed**

### **Option 1: Set Up Self-Hosted Runner (Recommended)**

**Best for:** Production use, regular automated testing

**Steps:**
1. Read `.github/SELF_HOSTED_RUNNER_SETUP.md`
2. Set up runner on a machine with VPN access
3. Use `cypress-tests-selfhosted.yml` workflow
4. Tests will run automatically with VPN access

**Pros:**
- ✅ Automated testing on every push
- ✅ Runs in background
- ✅ Can run 24/7
- ✅ Multiple runners for parallel execution

**Cons:**
- ⚠️ Requires dedicated machine/VM
- ⚠️ Need to maintain VPN connection
- ⚠️ Requires setup time

---

### **Option 2: Disable GitHub Actions (Temporary)**

**Best for:** If you're not ready to set up self-hosted runner yet

**Steps:**
1. Disable workflow files temporarily
2. Run tests locally with `npm run cypress-dev-test`
3. Set up self-hosted runner later

**How to disable:**
```bash
# Rename workflow files to prevent them from running
cd ".github/workflows"
mv cypress-tests.yml cypress-tests.yml.disabled
mv cypress-tests-simple.yml cypress-tests-simple.yml.disabled
mv nightly-tests.yml nightly-tests.yml.disabled

# Keep the self-hosted one for when you're ready
# cypress-tests-selfhosted.yml stays active
```

**Pros:**
- ✅ Stops failing workflow runs immediately
- ✅ No setup required
- ✅ Tests still work locally

**Cons:**
- ❌ No automated testing
- ❌ Must remember to run tests manually
- ❌ No CI/CD benefits

---

## 🔄 **Recommended Approach**

### **Immediate (Now):**
1. **Disable the cloud-based workflows** that keep failing:
   ```bash
   # Rename to .disabled so they don't run
   git mv .github/workflows/cypress-tests.yml .github/workflows/cypress-tests.yml.disabled
   git mv .github/workflows/cypress-tests-simple.yml .github/workflows/cypress-tests-simple.yml.disabled
   git mv .github/workflows/nightly-tests.yml .github/workflows/nightly-tests.yml.disabled
   git commit -m "🔧 Disable cloud workflows (VPN required)"
   git push
   ```

2. **Continue running tests locally** with VPN:
   ```bash
   npm run cypress-dev-test
   ```

### **Soon (Next Week):**
1. **Set up self-hosted runner:**
   - Choose a machine (your Mac, a VM, or dedicated server)
   - Follow `.github/SELF_HOSTED_RUNNER_SETUP.md`
   - Connect VPN on that machine
   - Install runner

2. **Enable self-hosted workflow:**
   - The `cypress-tests-selfhosted.yml` is already ready
   - Once runner is set up, it will work automatically

---

## 📊 **Comparison**

| Feature | Cloud Runners | Self-Hosted Runner | Local Only |
|---------|---------------|-------------------|------------|
| VPN Access | ❌ No | ✅ Yes | ✅ Yes |
| Automated Testing | ✅ Yes | ✅ Yes | ❌ Manual |
| Setup Required | None | Medium | None |
| Cost | Free | $0 (use existing hardware) | Free |
| Maintenance | None | Low | None |
| Best For | Public sites | Internal/VPN sites | Development |

---

## 🎯 **Action Items**

### **Right Now:**
```bash
cd "/Users/baraissa/Documents/Mpass automation FE"

# Option A: Disable failing workflows
git mv .github/workflows/cypress-tests.yml .github/workflows/cypress-tests.yml.disabled
git mv .github/workflows/cypress-tests-simple.yml .github/workflows/cypress-tests-simple.yml.disabled
git mv .github/workflows/nightly-tests.yml .github/workflows/nightly-tests.yml.disabled
git add .github/workflows/
git commit -m "🔧 Disable cloud workflows - VPN required for staging environment"
git push origin main
```

### **This Week:**
1. ✅ Read `.github/SELF_HOSTED_RUNNER_SETUP.md`
2. ✅ Identify machine for self-hosted runner
3. ✅ Set up runner following GitHub's instructions
4. ✅ Test with `cypress-tests-selfhosted.yml`

### **Or Continue:**
Just run tests locally with VPN:
```bash
npm run cypress-dev-test
```

---

## 📝 **Notes**

- **Staging URL:** `https://mafid-sit.progressive.majidalfuttaim.com`
- **VPN Required:** Yes, always
- **GitHub Runners:** No VPN access (can't reach staging)
- **Solution:** Self-hosted runner with VPN

---

**Questions? Check:**
- `.github/SELF_HOSTED_RUNNER_SETUP.md` - Detailed setup guide
- `.github/workflows/cypress-tests-selfhosted.yml` - Ready-to-use workflow

**Need help setting up self-hosted runner? Let me know!**
