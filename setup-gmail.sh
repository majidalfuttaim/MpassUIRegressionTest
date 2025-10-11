#!/bin/bash

# Gmail API Setup Script for Cypress Email Verification
# This script helps you set up Gmail API authentication

echo "🔧 Gmail API Setup for Cypress"
echo "================================"
echo ""

# Check if credentials.json exists
if [ ! -f "credentials.json" ]; then
    echo "❌ credentials.json not found!"
    echo ""
    echo "Please follow these steps:"
    echo "1. Go to: https://console.cloud.google.com"
    echo "2. Create a new project"
    echo "3. Enable Gmail API"
    echo "4. Create OAuth 2.0 Desktop credentials"
    echo "5. Download the credentials"
    echo "6. Save as credentials.json in project root"
    echo ""
    echo "See GMAIL_API_SETUP.md for detailed instructions"
    exit 1
fi

echo "✅ Found credentials.json"

# Check if token.json exists
if [ -f "token.json" ]; then
    echo "✅ Found existing token.json"
    read -p "Do you want to regenerate token? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "✅ Using existing token"
        exit 0
    fi
    echo "🔄 Regenerating token..."
    rm token.json
fi

# Generate token
echo "🔐 Starting OAuth authentication..."
echo ""
node cypress/plugins/generateToken.js

# Verify token was created
if [ -f "token.json" ]; then
    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "Next steps:"
    echo "1. Run your test: npx cypress run --spec 'cypress/e2e/signup_emailV.cy.ts'"
    echo "2. Watch email verification happen automatically!"
    echo ""
else
    echo ""
    echo "❌ Token generation failed"
    echo "Please check the error messages above"
    exit 1
fi
