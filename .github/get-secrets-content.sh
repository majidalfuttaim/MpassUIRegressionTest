#!/bin/bash

# GitHub Actions Secrets Helper Script
# This script helps you prepare the secrets content for GitHub Actions

echo "=================================================="
echo "GitHub Actions Secrets - Content Generator"
echo "=================================================="
echo ""
echo "This script will show you the content to copy for each GitHub secret."
echo ""

# Function to check if file exists
check_file() {
    if [ ! -f "$1" ]; then
        echo "❌ ERROR: File not found: $1"
        return 1
    fi
    return 0
}

# GMAIL_CREDENTIALS
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. GMAIL_CREDENTIALS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if check_file "credentials.json"; then
    echo ""
    echo "Copy the content below (everything including the curly braces):"
    echo "---START---"
    cat credentials.json
    echo ""
    echo "---END---"
    echo ""
else
    echo "⚠️  Please run './setup-gmail-interactive.sh' first to generate credentials.json"
fi
echo ""

# GMAIL_TOKEN
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. GMAIL_TOKEN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if check_file "token.json"; then
    echo ""
    echo "Copy the content below (everything including the curly braces):"
    echo "---START---"
    cat token.json
    echo ""
    echo "---END---"
    echo ""
else
    echo "⚠️  Please run './setup-gmail-interactive.sh' first to generate token.json"
fi
echo ""

# CYPRESS_ENV (Optional)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. CYPRESS_ENV (Optional)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if check_file "cypress/cypress.env.json"; then
    echo ""
    echo "Copy the content below (everything including the curly braces):"
    echo "---START---"
    cat cypress/cypress.env.json
    echo ""
    echo "---END---"
    echo ""
    echo "⚠️  NOTE: This secret is OPTIONAL. The tests will work without it."
else
    echo "⚠️  File not found, but this secret is optional anyway."
fi
echo ""

echo "=================================================="
echo "Next Steps:"
echo "=================================================="
echo ""
echo "1. Go to: https://github.com/baraIssa/MpassUIRegressionTest/settings/secrets/actions"
echo "2. Click 'New repository secret'"
echo "3. Create each secret:"
echo "   - Name: GMAIL_CREDENTIALS"
echo "   - Value: [paste content from section 1 above]"
echo ""
echo "   - Name: GMAIL_TOKEN"
echo "   - Value: [paste content from section 2 above]"
echo ""
echo "   - Name: CYPRESS_ENV (optional)"
echo "   - Value: [paste content from section 3 above]"
echo ""
echo "4. Save each secret"
echo "5. Push your workflow files to GitHub"
echo ""
echo "=================================================="
echo "Security Reminder:"
echo "=================================================="
echo "⚠️  NEVER commit these files to Git:"
echo "   - credentials.json"
echo "   - token.json"
echo "   - cypress.env.json"
echo ""
echo "✅ They are already in .gitignore"
echo ""
