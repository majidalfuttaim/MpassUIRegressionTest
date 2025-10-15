import EmailPage from '../pages/email_page.cy';

describe('Email Verification Tests', () => {
  let usersData: any;
  let emailPage: EmailPage;

  before(() => {
    emailPage = new EmailPage();
    cy.fixture('usersStaging.json').then((data) => {
      usersData = data;
      const userCount = Object.keys(usersData).filter(key => key.startsWith('user')).length;
      cy.log(`📊 Loaded ${userCount} users from fixture`);
      cy.task('log', `📊 Loaded ${userCount} users from fixture`);
    });
  });

  it('Check if verification email was sent to the newly registered user', function() {
    const { userKey: latestUserKey, user: latestUser } = emailPage.getLatestUser(usersData);
    
    if (!emailPage.validateUserExists(latestUser)) {
      this.skip();
    }

    emailPage.logSectionHeader('📧 Checking verification email for latest user');
    emailPage.logUserInfo(latestUserKey, latestUser);
    emailPage.logSearchCriteria();
    emailPage.logSectionHeader('');
    
    emailPage.checkForVerificationEmail(latestUser.email, 10, 3000).then((result: any) => {
      if (result && result.found) {
        emailPage.logEmailFound(result);
        emailPage.verifyEmailSubject(result);
        emailPage.verifyEmailInBody(result, latestUser.email);
      } else {
        emailPage.logEmailNotFound(latestUser.email);
      }
    });
  });

  it('Verify verification email content and structure', function() {
    const { userKey: latestUserKey, user: latestUser } = emailPage.getLatestUser(usersData);
    
    if (!emailPage.validateUserExists(latestUser)) {
      this.skip();
    }

    emailPage.logSectionHeader('📝 Verifying verification email content structure');
    
    emailPage.checkForVerificationEmail(latestUser.email, 5, 2000).then((result: any) => {
      if (result && result.found) {
        emailPage.verifyEmailContentStructure(result);
        emailPage.checkEmailInBodyContent(result, latestUser.email);
        emailPage.logContentChecksPassed();
      } else {
        emailPage.logEmailNotFoundForContentVerification(latestUser.email);
      }
    });
  });

  it('Check verification emails for all recently registered users', function() {
    const userKeys = Object.keys(usersData).filter(key => key.startsWith('user'));
    
    if (!userKeys || userKeys.length === 0) {
      emailPage.validateUserExists(null);
      this.skip();
    }

    emailPage.logBulkCheckHeader(userKeys.length);
    
    const recentUsers = emailPage.getRecentUsers(usersData, 3);
    
    recentUsers.forEach((userKey, index) => {
      const user = usersData[userKey];
      emailPage.logBulkUserCheck(index, recentUsers.length, userKey, user.email);
      
      emailPage.checkForVerificationEmail(user.email, 5, 2000).then((result: any) => {
        if (result && result.found) {
          emailPage.logBulkEmailFound(result.subject);
        } else {
          emailPage.logBulkEmailNotFound();
        }
      });
    });
    
    emailPage.logBulkVerificationComplete();
  });
});
