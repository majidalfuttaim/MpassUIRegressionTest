import { LoginPage } from "../pages/login_page.cy"
import { SignupPage } from "../pages/signup_page.cy"


const loginPage = new LoginPage()
const signupPage = new SignupPage()


describe('Test Sign up Feature For client with phone verification required', () => {
  let clients!: Array<{ clientId: string; name: string; passwordLessEmail: boolean; googleLogin: boolean; facebookLogin: boolean; phoneLogin: boolean }>;

  before(() => {
    const fixtureFileName = `clientPhoneRequired.json`;
    
    // Load the fixture data
    cy.fixture(fixtureFileName).then((data) => {
      clients = data.clientDetails;
    });
  });

  it('Complete signup form with mobile_verified inside UAE', function() {
    clients.forEach((client, index) => {
      // Store client name in Cypress env for error reporting
      Cypress.env('currentClient', client.name);
      
      const email = signupPage.createEmail();
      const phoneNumber = signupPage.getPhoneNumber();
      const password = 'Test@123';
      const firstName = 'Auto';
      const lastName = 'Test';
      let selectedNationality = '';
      
      // Navigate to the signup page with logging
      signupPage.navigateToSignupPage(client.clientId, client.name, index + 1, clients.length);
      
      // Fill in the signup form
      signupPage.clickOnTitleTogle();
      signupPage.addFirstName(firstName);
      signupPage.addLastName(lastName);
      signupPage.addEmailInsideEmailField(email);
      signupPage.clickOnPhoneArrow();
      signupPage.clickOnCountry();
      
      // Wait for page re-render to complete after country selection - reduced from 2000ms
      cy.wait(1000);
      
      // Ensure phone input field is visible and stable before typing
      cy.get('#phoneNumber').should('be.visible').and('not.be.disabled');
      
      signupPage.addPhoneInsideTheField(phoneNumber);
      
      // Add nationality and capture the selected value
      signupPage.selectRandomNationality().then((nationality: string) => {
        selectedNationality = nationality;
      });
      
      // Add password and confirm password
      signupPage.addPasswordToField(password);
      signupPage.addConfirmPassword(password);
      
      // Submit the form
      signupPage.clickSignupSubmitButton();
      
      // Wait for OTP page to load
      signupPage.waitForOTPPage();
      
      // Click on Send OTP button
      signupPage.clickSendOTPButton();
      
      // Enter OTP code
      signupPage.enterOTPCode('123456');
      
      // Click continue/verify button
      signupPage.clickVerifyOTPButton();
      
      // Click submit button on preferences page
      signupPage.clickSubmitButtonOnPreferences();
      
      // After submit button interaction - a new page will appear
      cy.log('✅ Submit button interaction complete - a new page will appear');
      
      // Click on toggle line (optional - may not exist for all clients)
      cy.wait(500); // Wait for new page to load - reduced from 1000ms
      cy.document().then((doc) => {
        const toggleElement = doc.querySelector('.toggle__line');
        if (toggleElement) {
          signupPage.clickToggleLine();
          cy.log('✅ Clicked toggle line');
        } else {
          cy.log('⚠️ Toggle line not found - skipping (optional element)');
        }
      });
      
      // Click save button
      signupPage.clickSaveButton();
      
      // Wait for the new page to load after save - reduced from 2000ms
      cy.wait(1000);
      
      // Verify welcome message
      cy.log('🔍 Checking for "Welcome, You are logged in" message');
      cy.contains(/welcome.*logged in/i, {timeout: 10000}).should('be.visible');
      cy.log('✅ Welcome message verified');
      
      // Save user data to fixture
      signupPage.savePhoneVerifiedUserData(firstName, lastName, email, phoneNumber, selectedNationality, password);
      
      cy.wait(500); // Reduced from 1000ms
      
      // Logout after test completion
      signupPage.clickLogoutButton();
      
      // Log success
      signupPage.logTestPassed(client.name);
      
      // Final assertion to pass the test
      expect(true).to.be.true;
    });
  });
 
  
  
  

});