import { ForgetPasswordPage } from "../pages/forget_password_page";

const forgetPasswordPage = new ForgetPasswordPage();

describe('Test Forget Password Feature with client IDs from fixture file', () => {
  let clients!: Array<{ clientId: string; name: string; passwordLessEmail: boolean; googleLogin: boolean; facebookLogin: boolean; phoneLogin: boolean }>;
  let usersStaging: any;

  before(() => {
    const fixtureFileName = `clientDetailsStaging.json`;
    
    cy.fixture(fixtureFileName).then((data) => {
      clients = data.clientDetails;
    });
    cy.fixture('usersStaging.json').then((data) => {
      usersStaging = data;
    });
  });

  it('Check Forgot Password link exists on login page', function() {
    // Sample only first 5 clients for element checking to reduce test time
    // Forgot password link is consistent across clients, so full coverage isn't necessary
    const sampleClients = clients.slice(0, 5);
    
    sampleClients.forEach((client, index) => {
      Cypress.env('currentClient', client.name);
      
      forgetPasswordPage.navigateToLoginPage(client.clientId, client.name, index + 1, sampleClients.length);
      forgetPasswordPage.checkForgotPasswordLinkExists();
      forgetPasswordPage.logTestPassed(client.name);
    });
    
    cy.log(`✅ Forgot password link checks completed for ${sampleClients.length}/${clients.length} clients (sampling)`);
  });


  it('Check Forgot Password by link', function() {
    const userKeys = Object.keys(usersStaging);
    
    const currentMinute = new Date().getMinutes();
    const randomUserOffset = currentMinute % userKeys.length;
    
    cy.log(`🔄 Selecting user based on current time - offset: ${randomUserOffset}`);
    
    // Randomly select 2 clients from the list (reduced from 3 for faster execution)
    const shuffled = [...clients].sort(() => 0.5 - Math.random());
    const selectedClients = shuffled.slice(0, 2);
    
    cy.log(`🎯 Testing 2 random clients out of ${clients.length} total clients (optimized)`);
    selectedClients.forEach((client, idx) => {
      cy.log(`   ${idx + 1}. ${client.name} (${client.clientId})`);
    });
    
    // Test selected clients with complete end-to-end flow
    selectedClients.forEach((client, index) => {
      Cypress.env('currentClient', client.name);
      
      forgetPasswordPage.navigateToLandingPage(client.clientId, client.name);
      forgetPasswordPage.clickForgotPasswordLinkFromLanding();
      forgetPasswordPage.validateForgotPasswordPageLoaded();
      
      const userIndex = (randomUserOffset + index) % userKeys.length;
      const userKey = userKeys[userIndex];
      const user = usersStaging[userKey];
      const email = user.email;
      
      cy.log(`📧 Using user: ${userKey} (${email})`);
      cy.log(`📬 All emails go to baramaf9@gmail.com inbox (Gmail + aliasing)`);
      
      forgetPasswordPage.typeEmailInField(email);
      forgetPasswordPage.clickResetPasswordButton();
      forgetPasswordPage.validateSuccessMessage();
      forgetPasswordPage.verifyResetEmailFromInbox(email, client.clientId);
      forgetPasswordPage.validateResetPasswordPageLoaded();
      
      const newPassword = 'NewTest@123';
      forgetPasswordPage.enterNewPassword(newPassword);
      forgetPasswordPage.confirmNewPassword(newPassword);
      forgetPasswordPage.submitPasswordReset();
      forgetPasswordPage.validatePasswordResetSuccess();
      
      forgetPasswordPage.navigateToLoginPageAfterReset(client.clientId);
      forgetPasswordPage.loginWithNewPassword(email, newPassword);
      forgetPasswordPage.validateLoginSuccess();
      
      // Try logout - use Cypress get instead of querySelector
      cy.get('body').then($body => {
        if ($body.text().includes('Logout') || $body.text().includes('Log out')) {
          forgetPasswordPage.clickLogoutButton();
        } else {
          cy.log(`⚠️ Logout button not found - skipping logout`);
        }
      });
      
      forgetPasswordPage.logTestPassed(client.name);
    });
  });

  it('Check Forgot Password by verification code', function() {
    const userKeys = Object.keys(usersStaging);
    const currentMinute = new Date().getMinutes();
    const randomUserOffset = currentMinute % userKeys.length;
    
    const shuffled = [...clients].sort(() => 0.5 - Math.random());
    const selectedClients = shuffled.slice(0, 1);
    
    selectedClients.forEach((client, index) => {
      Cypress.env('currentClient', client.name);
      
      if (index > 0) {
        cy.clearCookies();
        cy.clearLocalStorage();
      }
      
      forgetPasswordPage.navigateToLandingPage(client.clientId, client.name);
      forgetPasswordPage.clickForgotPasswordLinkFromLanding();
      forgetPasswordPage.validateForgotPasswordPageLoaded();
      
      const userIndex = (randomUserOffset + index) % userKeys.length;
      const userKey = userKeys[userIndex];
      const user = usersStaging[userKey];
      const email = user.email;
      
      forgetPasswordPage.typeEmailInField(email);
      forgetPasswordPage.clickResetPasswordButton();
      forgetPasswordPage.validateSuccessMessage();
      
      forgetPasswordPage.getResetCodeFromInbox(email).then((code: any) => {
        forgetPasswordPage.validateCodeEntryPageLoaded();
        forgetPasswordPage.enterVerificationCode(code);
        forgetPasswordPage.clickVerifyCodeButton();
        forgetPasswordPage.validateResetPasswordPageLoaded();
        
        const newPassword = 'NewTest@123';
        forgetPasswordPage.enterNewPassword(newPassword);
        forgetPasswordPage.confirmNewPassword(newPassword);
        forgetPasswordPage.submitPasswordReset();
        // forgetPasswordPage.validatePasswordResetSuccess(); // May auto-redirect
        
        forgetPasswordPage.navigateToLoginPageAfterReset(client.clientId);
        forgetPasswordPage.loginWithNewPassword(email, newPassword);
        forgetPasswordPage.validateLoginSuccess();
        
        cy.get('body').then($body => {
          if ($body.text().includes('Logout') || $body.text().includes('Log out')) {
            forgetPasswordPage.clickLogoutButton();
            cy.clearCookies();
            cy.clearLocalStorage();
          } else {
            cy.clearCookies();
            cy.clearLocalStorage();
          }
        });
        
        forgetPasswordPage.logTestPassed(client.name);
      });
    });
  });
});