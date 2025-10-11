# Step-by-Step Visual Guide: Accessing OAuth Consent Screen

## 🎯 Goal
Add yourself as a test user OR publish the app to allow OAuth authentication

## 📍 Step-by-Step Instructions

### STEP 1: Access Google Cloud Console
```
https://console.cloud.google.com
```

### STEP 2: Select Your Project
- Look at the **top navigation bar**
- You'll see a project selector (looks like: "Select a project" or shows current project name)
- Click on it
- Find and select: **"Mpass Email Verification"**

### STEP 3: Navigate to OAuth Consent Screen

**Option A - Using Hamburger Menu:**
```
1. Click ☰ (hamburger menu icon, top left, next to "Google Cloud")
2. Scroll down to "APIs & Services"
3. Click on "OAuth consent screen"
```

**Option B - Using Quick Link:**
```
1. Open: https://console.cloud.google.com/apis/credentials
2. Ensure "Mpass Email Verification" is selected (top bar)
3. Click "OAuth consent screen" tab (horizontal menu near top)
```

### STEP 4: Configure Test Users or Publish

Once on the OAuth consent screen page, you'll see one of these scenarios:

#### Scenario A: App is in "Testing" Mode
You'll see:
- Status: "Testing" 
- A section called "Test users"
- Buttons: "EDIT APP" or "PUBLISH APP"

**To add test user:**
1. Click "EDIT APP" button
2. Navigate through screens by clicking "SAVE AND CONTINUE"
3. When you reach "Test users" section:
   - Click "+ ADD USERS"
   - Enter: `baramaf9@gmail.com`
   - Click "ADD"
   - Click "SAVE AND CONTINUE"

**OR to publish app (easier):**
1. Click "PUBLISH APP" button (usually top right)
2. Click "CONFIRM" on the dialog
3. Done! App is now public

#### Scenario B: App Not Configured Yet
If you see a setup wizard:
1. User Type: Select "External"
2. Click "CREATE"
3. Fill basic info:
   - App name: Mpass Test Automation
   - User support email: (select from dropdown)
   - Developer contact: (your email)
4. Click "SAVE AND CONTINUE" through all screens
5. On "Test users" screen:
   - Click "+ ADD USERS"
   - Add: baramaf9@gmail.com
6. Complete wizard

## 🔍 Troubleshooting Access Issues

### Issue 1: "Page not found" or 403 Error
**Cause:** Project not selected or wrong project

**Fix:**
1. Go to: https://console.cloud.google.com
2. Click project dropdown (top bar)
3. Ensure "Mpass Email Verification" is selected
4. Try accessing OAuth consent screen again

### Issue 2: Can't find "OAuth consent screen" menu
**Cause:** APIs & Services menu collapsed

**Fix:**
1. Go to: https://console.cloud.google.com/apis/dashboard
2. Look at left sidebar
3. Click "OAuth consent screen" (should be in the menu)
4. Or click "Credentials" then "OAuth consent screen" tab

### Issue 3: Link opens but shows different project
**Cause:** Multiple projects in account

**Fix:**
1. Look at top navigation bar for project name
2. Click the project selector dropdown
3. Scroll to find "Mpass Email Verification"
4. Select it
5. Page will reload with correct project

## ✅ Verification

After adding test user OR publishing, you should see:

**If Test User Added:**
- Status: Testing
- Test users: baramaf9@gmail.com (listed)

**If Published:**
- Status: In production
- Anyone can authenticate

## 🚀 Next Step

Once configured, run:
```bash
./setup-gmail.sh
```

The OAuth flow will now work without the "access_denied" error.

## 📸 What to Look For

**OAuth Consent Screen Page should show:**
```
┌─────────────────────────────────────────┐
│ OAuth consent screen                    │
├─────────────────────────────────────────┤
│ [EDIT APP]           [PUBLISH APP]      │
│                                         │
│ Publishing status: Testing              │
│                                         │
│ Test users (0 or more listed)          │
│ [+ ADD USERS]                          │
│                                         │
│ baramaf9@gmail.com (after adding)      │
└─────────────────────────────────────────┘
```

## 💡 Quick Fix Summary

1. **Open:** https://console.cloud.google.com
2. **Select project:** "Mpass Email Verification" (top bar)
3. **Navigate:** ☰ Menu → APIs & Services → OAuth consent screen
4. **Do one of:**
   - Click "PUBLISH APP" (fastest)
   - OR add test user: baramaf9@gmail.com
5. **Run:** `./setup-gmail.sh`
