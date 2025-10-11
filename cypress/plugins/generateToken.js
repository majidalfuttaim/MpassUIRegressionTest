const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

/**
 * Gmail OAuth Token Generator
 * 
 * This script helps you authenticate with Gmail API and generate token.json
 * 
 * Steps:
 * 1. Make sure credentials.json exists in project root
 * 2. Run: node cypress/plugins/generateToken.js
 * 3. Follow the authentication URL
 * 4. Copy the code and paste it back
 * 5. token.json will be created
 */

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.modify'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

async function generateToken() {
  // Check if credentials.json exists
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error('\n❌ ERROR: credentials.json not found!');
    console.log('\nPlease follow these steps:');
    console.log('1. Go to: https://console.cloud.google.com');
    console.log('2. Create a new project or select existing one');
    console.log('3. Enable Gmail API');
    console.log('4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID');
    console.log('5. Choose "Desktop app" as application type');
    console.log('6. Download the credentials');
    console.log('7. Save the file as credentials.json in your project root');
    console.log('\nThen run this script again.\n');
    process.exit(1);
  }

  // Load credentials
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));
  const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Generate auth URL
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('\n🔐 Gmail API Authentication\n');
  console.log('Step 1: Open this URL in your browser:');
  console.log('\n', authUrl, '\n');
  console.log('Step 2: Authorize the application');
  console.log('Step 3: Copy the authorization code from the URL\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Paste the authorization code here: ', async (code) => {
    rl.close();

    try {
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);

      // Save token to file
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));

      console.log('\n✅ Success! Token saved to token.json');
      console.log('\nYou can now run your Cypress tests with Gmail API integration.\n');
    } catch (error) {
      console.error('\n❌ Error retrieving access token:', error.message);
      console.log('\nPlease try again and make sure you copied the full authorization code.\n');
      process.exit(1);
    }
  });
}

generateToken();
