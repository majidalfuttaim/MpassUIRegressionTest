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
      
      // Add password
      signupPage.addPasswordToField(password);
            
      // Submit the form
      signupPage.clickSignupSubmitButton();
      
      // Verify email from inbox - Gmail API will fetch email, click verification link, and navigate back to login
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
      }, client.name);
    });
  });
 
  
  
  

});