#!/bin/bash

# Interactive Google Cloud Setup Guide
# This script provides step-by-step instructions with validation

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     Gmail API Setup - Interactive Guide                   ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "This will guide you through setting up Gmail API for email verification."
echo ""

# Step 1: Check if credentials already exist
if [ -f "credentials.json" ]; then
    echo "✅ Found existing credentials.json"
    echo ""
    read -p "Do you want to use existing credentials? (Y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Nn]$ ]]; then
        echo "📝 Backing up existing credentials..."
        mv credentials.json credentials.json.backup
        echo "✅ Backed up to credentials.json.backup"
        echo ""
    else
        echo "✅ Using existing credentials"
        echo ""
        # Skip to token generation
        exec ./setup-gmail.sh
        exit 0
    fi
fi

echo "════════════════════════════════════════════════════════════"
echo "STEP 1: Google Cloud Console Setup"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "📋 Follow these steps in your browser:"
echo ""
echo "1️⃣  Open: https://console.cloud.google.com"
echo "    → Sign in with your Google account (baramaf9@gmail.com or any)"
echo ""

read -p "Press ENTER when you're logged in to Google Cloud Console..."
echo ""

echo "2️⃣  Create a new project:"
echo "    → Click the project dropdown (top left, next to 'Google Cloud')"
echo "    → Click 'NEW PROJECT'"
echo "    → Project name: Mpass Email Verification"
echo "    → Click 'CREATE'"
echo "    → Wait ~10 seconds for project creation"
echo "    → Select your new project from the dropdown"
echo ""

read -p "Press ENTER when you've created and selected the project..."
echo ""

echo "3️⃣  Enable Gmail API:"
echo "    → Click this link: https://console.cloud.google.com/apis/library/gmail.googleapis.com"
echo "    → Make sure your new project is selected (check top bar)"
echo "    → Click the blue 'ENABLE' button"
echo "    → Wait ~5 seconds for activation"
echo ""

read -p "Press ENTER when Gmail API is enabled..."
echo ""

echo "════════════════════════════════════════════════════════════"
echo "STEP 2: Configure OAuth Consent Screen"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "4️⃣  Configure consent screen:"
echo "    → Click: https://console.cloud.google.com/apis/credentials/consent"
echo "    → Choose 'External' user type"
echo "    → Click 'CREATE'"
echo ""
echo "    Fill in the form:"
echo "    • App name: Mpass Test Automation"
echo "    • User support email: (select your email)"
echo "    • Developer contact: (enter your email)"
echo "    → Click 'SAVE AND CONTINUE'"
echo ""
echo "    On Scopes page:"
echo "    → Just click 'SAVE AND CONTINUE' (skip adding scopes)"
echo ""
echo "    On Test users page:"
echo "    → Click '+ ADD USERS'"
echo "    → Enter: baramaf9@gmail.com (or your email)"
echo "    → Click 'ADD'"
echo "    → Click 'SAVE AND CONTINUE'"
echo ""
echo "    On Summary page:"
echo "    → Click 'BACK TO DASHBOARD'"
echo ""

read -p "Press ENTER when OAuth consent screen is configured..."
echo ""

echo "════════════════════════════════════════════════════════════"
echo "STEP 3: Create OAuth Credentials"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "5️⃣  Create OAuth Client ID:"
echo "    → Click: https://console.cloud.google.com/apis/credentials"
echo "    → Click '+ CREATE CREDENTIALS' (top of page)"
echo "    → Select 'OAuth client ID'"
echo ""
echo "    Configure OAuth client:"
echo "    • Application type: Desktop app"
echo "    • Name: Cypress Test Client"
echo "    → Click 'CREATE'"
echo ""
echo "    You'll see a popup with Client ID and Client Secret"
echo "    → Click 'DOWNLOAD JSON' button"
echo "    → The file will be saved to your Downloads folder"
echo ""

read -p "Press ENTER when you've downloaded the JSON file..."
echo ""

echo "════════════════════════════════════════════════════════════"
echo "STEP 4: Move Credentials File"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Now we need to move the downloaded file to your project..."
echo ""

# Find the downloaded credentials file
DOWNLOADS_DIR="$HOME/Downloads"
CRED_FILE=$(find "$DOWNLOADS_DIR" -name "client_secret_*.json" -type f -mmin -5 2>/dev/null | head -n 1)

if [ -n "$CRED_FILE" ]; then
    echo "✅ Found credentials file: $(basename "$CRED_FILE")"
    echo "📁 Location: $CRED_FILE"
    echo ""
    read -p "Move this file to credentials.json? (Y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        cp "$CRED_FILE" "./credentials.json"
        echo "✅ Credentials copied to credentials.json"
        echo ""
    else
        echo "⚠️  Please manually copy the file:"
        echo "   cp $CRED_FILE ./credentials.json"
        exit 1
    fi
else
    echo "❌ Could not find downloaded credentials file automatically."
    echo ""
    echo "📝 Please manually copy the file:"
    echo "   1. Locate client_secret_*.json in your Downloads folder"
    echo "   2. Run: cp ~/Downloads/client_secret_*.json ./credentials.json"
    echo ""
    read -p "Press ENTER when you've copied credentials.json to this directory..."
    
    if [ ! -f "credentials.json" ]; then
        echo ""
        echo "❌ credentials.json still not found!"
        echo "Please create it and run this script again."
        exit 1
    fi
fi

echo ""
echo "✅ credentials.json is ready!"
echo ""

echo "════════════════════════════════════════════════════════════"
echo "STEP 5: Generate Authentication Token"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Now we'll authenticate with your Gmail account..."
echo ""
read -p "Press ENTER to start authentication..."
echo ""

# Run the token generator
./setup-gmail.sh

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    SETUP COMPLETE! 🎉                      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "✅ credentials.json created"
echo "✅ token.json generated"
echo "✅ Gmail API ready to use"
echo ""
echo "🚀 Next step: Run your test!"
echo ""
echo "   npx cypress run --spec 'cypress/e2e/signup_emailV.cy.ts'"
echo ""
echo "📚 Documentation:"
echo "   • Quick Reference: QUICK_REFERENCE.md"
echo "   • Full Setup Guide: GMAIL_API_SETUP.md"
echo "   • Implementation Details: IMPLEMENTATION_SUMMARY.md"
echo ""
