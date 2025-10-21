# Self-Hosted GitHub Runner Setup for VPN-Required Tests

## Why Self-Hosted Runner?

Your testing environment (`https://mafid-sit.progressive.majidalfuttaim.com`) requires VPN access, which GitHub's cloud runners don't have. A self-hosted runner runs on your own infrastructure with VPN access.

---

## 🎯 **Setup Steps**

### 1. **Choose a Machine**

Options:
- Your local development machine (Mac/Windows/Linux)
- A dedicated server in your office
- A VM with VPN access
- A cloud VM with VPN connection

**Requirements:**
- VPN connection to access test environment
- Node.js 24.9.0+ installed
- Chrome browser installed
- Reliable internet connection

---

### 2. **Add Self-Hosted Runner to GitHub**

#### **Go to Repository Settings:**
```
https://github.com/majidalfuttaim/MpassUIRegressionTest/settings/actions/runners/new
```

#### **Follow GitHub's Instructions:**

1. **Select your OS** (macOS, Linux, or Windows)
2. **Download the runner**
3. **Configure the runner:**
   ```bash
   # Example for macOS/Linux
   mkdir actions-runner && cd actions-runner
   
   # Download (GitHub provides the latest URL)
   curl -o actions-runner-osx-x64-2.319.1.tar.gz -L https://github.com/actions/runner/releases/download/v2.319.1/actions-runner-osx-x64-2.319.1.tar.gz
   
   # Extract
   tar xzf ./actions-runner-osx-x64-2.319.1.tar.gz
   
   # Create the runner
   ./config.sh --url https://github.com/majidalfuttaim/MpassUIRegressionTest --token YOUR_TOKEN
   
   # Run it
   ./run.sh
   ```

4. **Add labels** (optional but recommended):
   - `vpn-enabled`
   - `cypress-ready`
   - `staging-access`

---

### 3. **Install as a Service (Recommended)**

For production use, install the runner as a service so it starts automatically:

#### **macOS:**
```bash
cd actions-runner
sudo ./svc.sh install
sudo ./svc.sh start
```

#### **Linux:**
```bash
cd actions-runner
sudo ./svc.sh install
sudo ./svc.sh start
```

#### **Windows (PowerShell as Admin):**
```powershell
cd actions-runner
.\svc.sh install
.\svc.sh start
```

---

### 4. **Update Workflow to Use Self-Hosted Runner**

Edit `.github/workflows/cypress-tests.yml`:

```yaml
jobs:
  cypress-run:
    runs-on: self-hosted  # Changed from ubuntu-latest
    
    # Optional: Use specific labels
    # runs-on: [self-hosted, vpn-enabled, cypress-ready]
```

---

## 🔄 **Alternative: Keep Both Cloud and Self-Hosted**

You can have workflows for both:

### **For Cloud Runners (No VPN needed):**
- Syntax checks
- Linting
- Unit tests
- Mock API tests

### **For Self-Hosted (VPN required):**
- E2E tests against staging
- Integration tests
- Full test suite

**Example:**
```yaml
# .github/workflows/cypress-tests-vpn.yml
name: Cypress E2E Tests (VPN Required)

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  cypress-run:
    runs-on: self-hosted  # VPN-enabled runner
    
    steps:
      # ... rest of your steps
```

---

## 📋 **Verification Steps**

After setup:

1. **Check runner status:**
   - Go to: `Settings` → `Actions` → `Runners`
   - Should show: ✅ Idle (green)

2. **Test the runner:**
   - Push a commit
   - Watch the Actions tab
   - Job should run on your self-hosted runner

3. **Monitor logs:**
   ```bash
   cd actions-runner
   tail -f _diag/Runner_*.log
   ```

---

## ⚙️ **Runner Configuration**

### **Environment Variables:**

Add to runner's environment:
```bash
# In ~/.bashrc, ~/.zshrc, or service configuration
export NODE_OPTIONS="--max-old-space-size=4096"
export CHROME_BIN="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

### **Dependencies:**

Ensure installed:
```bash
# Node.js
node --version  # Should be 24.9.0+

# Chrome
google-chrome --version  # or chrome --version

# Git
git --version
```

---

## 🔐 **Security Considerations**

1. **VPN Connection:**
   - Ensure VPN auto-connects on startup
   - Monitor VPN health

2. **Secrets:**
   - Runner has access to repository secrets
   - Secure the machine running the runner
   - Use firewall rules

3. **Network:**
   - Whitelist GitHub's webhook IPs if needed
   - Ensure stable VPN connection

4. **Updates:**
   - Runner auto-updates by default
   - Keep Node.js and Chrome updated

---

## 🚨 **Troubleshooting**

### **Runner Not Connecting:**
```bash
# Check logs
cd actions-runner
tail -f _diag/Runner_*.log

# Restart service
sudo ./svc.sh stop
sudo ./svc.sh start
```

### **VPN Issues:**
- Ensure VPN is connected before runner starts
- Test manually: `curl https://mafid-sit.progressive.majidalfuttaim.com`
- Set up VPN auto-reconnect

### **Tests Failing:**
- Verify all dependencies installed
- Check Chrome browser path
- Ensure credentials files copied to runner workspace

---

## 📊 **Monitoring**

### **Check Runner Status:**
```
https://github.com/majidalfuttaim/MpassUIRegressionTest/settings/actions/runners
```

### **View Job Logs:**
```
https://github.com/majidalfuttaim/MpassUIRegressionTest/actions
```

### **Local Logs:**
```bash
cd actions-runner
ls -la _diag/
```

---

## 🎯 **Best Practices**

1. **Dedicated Machine:**
   - Use a dedicated machine/VM for the runner
   - Don't run on your personal development machine for production

2. **High Availability:**
   - Set up multiple runners for redundancy
   - Use runner groups for different test suites

3. **Maintenance:**
   - Schedule regular restarts
   - Monitor disk space
   - Keep dependencies updated

4. **Resource Management:**
   - Limit concurrent jobs if needed
   - Monitor CPU/RAM usage
   - Clean up old artifacts

---

## 🔗 **Useful Links**

- [GitHub Self-Hosted Runners Docs](https://docs.github.com/en/actions/hosting-your-own-runners)
- [Adding Self-Hosted Runners](https://docs.github.com/en/actions/hosting-your-own-runners/adding-self-hosted-runners)
- [Running Scripts Before/After](https://docs.github.com/en/actions/hosting-your-own-runners/running-scripts-before-or-after-a-job)

---

## ✅ **Quick Start Checklist**

- [ ] Choose machine with VPN access
- [ ] Install Node.js 24.9.0+
- [ ] Install Chrome browser
- [ ] Connect VPN
- [ ] Go to GitHub Settings → Actions → Runners → New
- [ ] Download and configure runner
- [ ] Install as service
- [ ] Update workflow to use `runs-on: self-hosted`
- [ ] Test with a simple workflow
- [ ] Monitor runner status

---

**After setup, your tests will run on your own infrastructure with VPN access! 🎉**
