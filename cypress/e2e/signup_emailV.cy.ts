import { LoginPage } from "../pages/login_page.cy"
import { SignupPage } from "../pages/signup_page.cy"


const loginPage = new LoginPage()
const signupPage = new SignupPage()


describe('Test Sign up Feature For client with Email verification required', () => {
  let clients!: Array<{ clientId: string; name: string; passwordLessEmail: boolean; googleLogin: boolean; facebookLogin: boolean; phoneLogin: boolean }>;

  before(() => {
    const fixtureFileName = `clientEmailRequired.json`;
    
    // Load the fixture data
    cy.fixture(fixtureFileName).then((data) => {
      clients = data.clientDetails;
    });
  });

  it('Complete signup form with Email_verified inside UAE', function() {
    clients.forEach((client, index) => {
      // Log to Cypress UI and HTML reports
      cy.log(`🔍 Testing signup form for client: ${client.name} (${index + 1}/${clients.length})`);
      cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      cy.log('📋 CLIENT: ' + client.name);
      cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // Log to terminal console
      cy.task('log', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', { log: false });
      cy.task('log', '📋 TESTING CLIENT: ' + client.name + ' (' + (index + 1) + '/' + clients.length + ')', { log: false });
      cy.task('log', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', { log: false });
      
      // Store client name in Cypress env for error reporting
      Cypress.env('currentClient', client.name);
      
      const email = signupPage.createEmail();
      const phoneNumber = signupPage.getPhoneNumber();
      const password = 'Test@123';
      const firstName = 'Auto';
      const lastName = 'Test';
      let selectedNationality = '';
      
      // Navigate to the signup page
      signupPage.navigateToSignupPage(client.clientId);
      
      // Fill in the signup form
      cy.log('Filling signup form');
      signupPage.clickOnTitleTogle();
      signupPage.addFirstName(firstName);
      signupPage.addLastName(lastName);
      signupPage.addEmailInsideEmailField(email);
      signupPage.clickOnPhoneArrow();
      signupPage.clickOnCountry();
      signupPage.addPhoneInsideTheField(phoneNumber);
      
      // Add nationality and capture the selected value
      cy.log('Selecting first nationality');
      signupPage.selectRandomNationality().then((nationality: string) => {
        selectedNationality = nationality;
        cy.log(`✅ Captured nationality: ${selectedNationality}`);
      });
      
      // Add password
      cy.log('Entering password');
      signupPage.addPasswordToField(password);
            
      // Submit the form
      cy.log('Submitting signup form');
      signupPage.clickSignupSubmitButton();
      
      // Verify email from inbox - Gmail API will fetch email, click verification link, and navigate back to login
      cy.log('📧 Verifying email from inbox (Gmail API will auto-click verify link and return to login page)');
      signupPage.verifyEmailFromInbox(email, client.clientId);
      
      // Close any popup that might appear after returning to login page
      signupPage.closeSignupPopup();
      
      // Login with newly created credentials (email is already verified at this point)
      signupPage.loginAfterSignup(email, password);
    
      // Complete verification and save user data
      signupPage.completeVerificationAndSave({
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
        nationality: selectedNationality,
        password: password
      });
      
      cy.log('✅ PASSED: ' + client.name);
      cy.task('log', '✅ PASSED: ' + client.name, { log: false });
      cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });
  });
 
  
  
  

});