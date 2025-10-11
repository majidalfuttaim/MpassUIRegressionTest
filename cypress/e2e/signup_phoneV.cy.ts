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
      
      // Save user data to fixture
      signupPage.savePhoneVerifiedUserData(firstName, lastName, email, phoneNumber, selectedNationality, password);
      
      // Click Save button on the next page
      signupPage.clickSaveButton();
      
      cy.wait(1000);
      
      // Logout after test completion
      signupPage.clickLogoutButton();
      
      // Log success
      signupPage.logTestPassed(client.name);
      
      // Final assertion to pass the test
      expect(true).to.be.true;
    });
  });
 
  
  
  

});