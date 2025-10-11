describe('Email Verification Tests', () => {
  let usersData: any;

  before(() => {
    // Load the users from the fixture file
    cy.fixture('usersStaging.json').then((data) => {
      usersData = data;
      const userCount = Object.keys(usersData).filter(key => key.startsWith('user')).length;
      cy.log(`Loaded ${userCount} users from fixture`);
    });
  });

  it('Check if welcome email was sent to the newly registered user', function() {
    // Get the most recently added user (highest user number)
    const userKeys = Object.keys(usersData).filter(key => key.startsWith('user')).sort();
    const latestUserKey = userKeys[userKeys.length - 1];
    const latestUser = usersData[latestUserKey];
    
    if (!latestUser) {
      cy.log('❌ No users found in fixture file');
      this.skip();
    }

    cy.log(`Checking welcome email for: ${latestUser.email} (${latestUserKey})`);
    cy.log(`User: ${latestUser.firstName} ${latestUser.lastName}`);
    
    // Note: This is a placeholder for actual email verification
    // You'll need to integrate with an email service API
    
    // Example approach 1: Using Mailosaur (if you have it set up)
    // cy.mailosaurGetMessage(serverId, {
    //   sentTo: latestUser.email
    // }).then(email => {
    //   expect(email.subject).to.contain('Welcome');
    //   cy.log('✅ Welcome email found!');
    // });

    // Example approach 2: Using Gmail API
    cy.task('checkGmailForWelcomeEmail', {
      email: latestUser.email,
      subject: 'Welcome'
    }).then((emailFound) => {
      expect(emailFound).to.be.true;
      cy.log('✅ Welcome email found in Gmail!');
    });

    // Example approach 3: Manual check with wait
    cy.wait(5000); // Wait for email to be sent
    cy.log('⚠️ Email verification not implemented yet');
    cy.log('📧 Please manually check email: ' + latestUser.email);
    cy.log('Expected: Welcome email should be received');
    
    // For now, we'll just log the information
    cy.log('User Details:');
    cy.log(`  User Key: ${latestUserKey}`);
    cy.log(`  Name: ${latestUser.firstName} ${latestUser.lastName}`);
    cy.log(`  Email: ${latestUser.email}`);
    cy.log(`  Phone: ${latestUser.phoneNumber}`);
    cy.log(`  Nationality: ${latestUser.nationality}`);
    cy.log(`  Mobile Verified: ${latestUser.mobile_verified}`);
  });

  it('Verify welcome email content and structure', function() {
    const userKeys = Object.keys(usersData).filter(key => key.startsWith('user')).sort();
    const latestUserKey = userKeys[userKeys.length - 1];
    const latestUser = usersData[latestUserKey];
    
    if (!latestUser) {
      cy.log('❌ No users found in fixture file');
      this.skip();
    }

    // This test would verify the email content once you have email API integration
    cy.log('📧 Verifying email content for: ' + latestUser.email);
    
    // TODO: Implement actual email content verification
    // Expected checks:
    // - Subject contains "Welcome"
    // - Body contains user's first name
    // - Email contains account activation link (if applicable)
    // - Email is from the correct sender
    
    cy.log('⚠️ Email content verification not implemented yet');
    cy.log('Expected checks:');
    cy.log('  ✓ Subject should contain "Welcome"');
    cy.log('  ✓ Body should contain first name: ' + latestUser.firstName);
    cy.log('  ✓ Email should be from official sender');
  });

  it('Check all registered users have received welcome emails', function() {
    const userKeys = Object.keys(usersData).filter(key => key.startsWith('user'));
    
    if (!userKeys || userKeys.length === 0) {
      cy.log('❌ No users found in fixture file');
      this.skip();
    }

    cy.log(`Checking welcome emails for ${userKeys.length} users`);
    
    userKeys.forEach((userKey, index) => {
      const user = usersData[userKey];
      cy.log(`\n${index + 1}. ${userKey}: ${user.email}`);
      cy.log(`   Name: ${user.firstName} ${user.lastName}`);
      cy.log(`   Mobile Verified: ${user.mobile_verified}`);
      
      // TODO: Add actual email verification logic here
      // For now, just log the information
    });
    
    cy.log('⚠️ Bulk email verification not implemented yet');
  });
});
