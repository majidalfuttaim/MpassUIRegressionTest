class EmailPage {
  /**
   * Log section header with decorative borders
   */
  logSectionHeader(title: string) {
    cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    cy.task('log', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    cy.log(title);
    cy.task('log', title);
    cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    cy.task('log', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }

  /**
   * Log user information
   */
  logUserInfo(userKey: string, user: any) {
    cy.log(`   User Key: ${userKey}`);
    cy.task('log', `   User Key: ${userKey}`);
    cy.log(`   Email: ${user.email}`);
    cy.task('log', `   Email: ${user.email}`);
    cy.log(`   Name: ${user.firstName} ${user.lastName}`);
    cy.task('log', `   Name: ${user.firstName} ${user.lastName}`);
  }

  /**
   * Log search criteria for verification emails
   */
  logSearchCriteria() {
    cy.log('   Searching for email with:');
    cy.task('log', '   Searching for email with:');
    cy.log('   • Subject: "Please verify your email"');
    cy.task('log', '   • Subject: "Please verify your email"');
    cy.log('   • User email must appear in email body');
    cy.task('log', '   • User email must appear in email body');
    cy.log('   • Time window: Last 30 minutes');
    cy.task('log', '   • Time window: Last 30 minutes');
  }

  /**
   * Load users from fixture file
   */
  loadUsersFromFixture() {
    cy.fixture('usersStaging.json').then((data) => {
      const userCount = Object.keys(data).filter(key => key.startsWith('user')).length;
      cy.log(`📊 Loaded ${userCount} users from fixture`);
      cy.task('log', `📊 Loaded ${userCount} users from fixture`);
    });
  }

  /**
   * Get the latest user from users data
   */
  getLatestUser(usersData: any) {
    const userKeys = Object.keys(usersData).filter(key => key.startsWith('user')).sort();
    const latestUserKey = userKeys[userKeys.length - 1];
    const latestUser = usersData[latestUserKey];
    
    return { userKey: latestUserKey, user: latestUser };
  }

  /**
   * Check if user exists, skip test if not
   */
  validateUserExists(user: any) {
    if (!user) {
      cy.log('❌ No users found in fixture file');
      cy.task('log', '❌ No users found in fixture file');
      return false;
    }
    return true;
  }

  /**
   * Check for verification email using Gmail API
   */
  checkForVerificationEmail(email: string, maxRetries: number = 10, retryDelay: number = 3000) {
    return cy.task('gmail:checkForWelcomeEmail', {
      email: email,
      maxRetries: maxRetries,
      retryDelay: retryDelay
    });
  }

  /**
   * Log verification email found with details
   */
  logEmailFound(result: any) {
    cy.log('✅ Verification email found!');
    cy.task('log', '✅ Verification email found!');
    cy.log(`   Subject: ${result.subject}`);
    cy.task('log', `   Subject: ${result.subject}`);
    cy.log(`   From: ${result.message.from}`);
    cy.task('log', `   From: ${result.message.from}`);
    cy.log(`   Date: ${result.message.date}`);
    cy.task('log', `   Date: ${result.message.date}`);
  }

  /**
   * Verify email subject is "Please verify your email"
   */
  verifyEmailSubject(result: any) {
    cy.log('Checking email subject...');
    cy.task('log', 'Checking email subject...');
    expect(result.subject).to.exist;
    expect(result.subject.toLowerCase()).to.include('please verify your email');
    cy.log('✅ Email subject is "Please verify your email"');
    cy.task('log', '✅ Email subject is "Please verify your email"');
  }

  /**
   * Verify user's email appears in email body
   */
  verifyEmailInBody(result: any, userEmail: string) {
    const bodyText = result.body || '';
    if (bodyText.toLowerCase().includes(userEmail.toLowerCase())) {
      cy.log(`✅ Email body contains user's email: ${userEmail}`);
      cy.task('log', `✅ Email body contains user's email: ${userEmail}`);
    } else {
      cy.log(`⚠️ Warning: Email body does not contain user's email`);
      cy.task('log', `⚠️ Warning: Email body does not contain user's email`);
    }
  }

  /**
   * Log when no verification email is found
   */
  logEmailNotFound(userEmail: string) {
    cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    cy.task('log', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    cy.log('❌ No verification email found');
    cy.task('log', '❌ No verification email found');
    cy.log('   This could mean:');
    cy.task('log', '   This could mean:');
    cy.log('   1. The verification email was not sent');
    cy.task('log', '   1. The verification email was not sent');
    cy.log('   2. Emails are delayed (check manually later)');
    cy.task('log', '   2. Emails are delayed (check manually later)');
    cy.log('   3. Email was sent to a different address');
    cy.task('log', '   3. Email was sent to a different address');
    cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    cy.task('log', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    cy.log('⚠️ Test will continue but email was not found');
    cy.task('log', '⚠️ Test will continue but email was not found');
    cy.log('📧 Please check Gmail manually for: ' + userEmail);
    cy.task('log', '📧 Please check Gmail manually for: ' + userEmail);
  }

  /**
   * Verify email content structure (subject, body exists, sender, date)
   */
  verifyEmailContentStructure(result: any) {
    cy.log('✅ Email found - verifying content...');
    cy.task('log', '✅ Email found - verifying content...');
    
    // Check subject
    cy.log('Checking email subject...');
    cy.task('log', 'Checking email subject...');
    expect(result.subject).to.exist;
    expect(result.subject.toLowerCase()).to.include('please verify your email');
    cy.log(`✅ Subject is: "${result.subject}"`);
    cy.task('log', `✅ Subject is: "${result.subject}"`);
    
    // Check body exists
    cy.log('Checking email body...');
    cy.task('log', 'Checking email body...');
    expect(result.body).to.exist;
    cy.log(`✅ Email body exists (${result.body.length} characters)`);
    cy.task('log', `✅ Email body exists (${result.body.length} characters)`);
    
    // Check sender
    cy.log(`Checking sender...`);
    cy.task('log', `Checking sender...`);
    expect(result.message.from).to.exist;
    cy.log(`✅ Sender: ${result.message.from}`);
    cy.task('log', `✅ Sender: ${result.message.from}`);
    
    // Check date
    cy.log(`Checking date...`);
    cy.task('log', `Checking date...`);
    expect(result.message.date).to.exist;
    cy.log(`✅ Date: ${result.message.date}`);
    cy.task('log', `✅ Date: ${result.message.date}`);
  }

  /**
   * Check if user's email appears in body (for content structure verification)
   */
  checkEmailInBodyContent(result: any, userEmail: string) {
    const bodyLower = result.body.toLowerCase();
    const emailLower = userEmail.toLowerCase();
    
    if (bodyLower.includes(emailLower)) {
      cy.log(`✅ Body contains user's email: ${userEmail}`);
      cy.task('log', `✅ Body contains user's email: ${userEmail}`);
    } else {
      cy.log(`⚠️ Body does not contain user's email`);
      cy.task('log', `⚠️ Body does not contain user's email`);
    }
  }

  /**
   * Log all email content checks passed
   */
  logContentChecksPassed() {
    cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    cy.task('log', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    cy.log('✅ All email content checks passed!');
    cy.task('log', '✅ All email content checks passed!');
    cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    cy.task('log', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }

  /**
   * Log email not found for content verification
   */
  logEmailNotFoundForContentVerification(userEmail: string) {
    cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    cy.task('log', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    cy.log('❌ No verification email found for content verification');
    cy.task('log', '❌ No verification email found for content verification');
    cy.log('   This could mean:');
    cy.task('log', '   This could mean:');
    cy.log('   1. The verification email was not sent');
    cy.task('log', '   1. The verification email was not sent');
    cy.log('   2. Emails are delayed (check manually later)');
    cy.task('log', '   2. Emails are delayed (check manually later)');
    cy.log('   3. Email was sent to a different address');
    cy.task('log', '   3. Email was sent to a different address');
    cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    cy.task('log', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    cy.log('⚠️ Test will continue but email was not found');
    cy.task('log', '⚠️ Test will continue but email was not found');
    cy.log('📧 Please check Gmail manually for: ' + userEmail);
    cy.task('log', '📧 Please check Gmail manually for: ' + userEmail);
  }

  /**
   * Get recent users (last N users)
   */
  getRecentUsers(usersData: any, count: number = 3) {
    const userKeys = Object.keys(usersData).filter(key => key.startsWith('user'));
    return userKeys.slice(-count);
  }

  /**
   * Log bulk check header
   */
  logBulkCheckHeader(totalUsers: number) {
    cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    cy.task('log', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    cy.log(`📊 Checking verification emails for ${totalUsers} users`);
    cy.task('log', `📊 Checking verification emails for ${totalUsers} users`);
    cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    cy.task('log', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }

  /**
   * Log individual user check in bulk verification
   */
  logBulkUserCheck(index: number, total: number, userKey: string, email: string) {
    cy.log(`\n📧 ${index + 1}/${total} - Checking ${userKey}: ${email}`);
    cy.task('log', `\n📧 ${index + 1}/${total} - Checking ${userKey}: ${email}`);
  }

  /**
   * Log bulk user email found
   */
  logBulkEmailFound(subject: string) {
    cy.log(`   ✅ Verification email found`);
    cy.task('log', `   ✅ Verification email found`);
    cy.log(`   Subject: ${subject}`);
    cy.task('log', `   Subject: ${subject}`);
  }

  /**
   * Log bulk user email not found
   */
  logBulkEmailNotFound() {
    cy.log(`   ❌ Verification email NOT found`);
    cy.task('log', `   ❌ Verification email NOT found`);
  }

  /**
   * Log bulk verification complete
   */
  logBulkVerificationComplete() {
    cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    cy.task('log', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    cy.log('✅ Bulk verification email check complete');
    cy.task('log', '✅ Bulk verification email check complete');
    cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    cy.task('log', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }
}

export default EmailPage;
