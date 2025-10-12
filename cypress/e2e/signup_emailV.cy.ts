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
      signupPage.logClientTest(client.name, index + 1, clients.length);
      Cypress.env('currentClient', client.name);
      
      const email = signupPage.createEmail();
      const phoneNumber = signupPage.getPhoneNumber();
      const password = 'Test@123';
      const firstName = 'Auto';
      const lastName = 'Test';
      let selectedNationality = '';
      
      signupPage.navigateToSignupPage(client.clientId);
      
      signupPage.logFillingForm();
      signupPage.clickOnTitleTogle();
      signupPage.addFirstName(firstName);
      signupPage.addLastName(lastName);
      signupPage.addEmailInsideEmailField(email);
      signupPage.clickOnPhoneArrow();
      signupPage.clickOnCountry();
      signupPage.addPhoneInsideTheField(phoneNumber);
      
      signupPage.logSelectingNationality();
      signupPage.selectRandomNationality().then((nationality: string) => {
        selectedNationality = nationality;
        signupPage.logNationalitySelected(selectedNationality);
      });
      
      signupPage.logEnteringPassword();
      signupPage.addPasswordToField(password);
            
      signupPage.logSubmittingForm();
      signupPage.clickSignupSubmitButton();
      
      signupPage.logVerifyingEmail();
      signupPage.verifyEmailFromInbox(email, client.clientId);
      
      signupPage.closeSignupPopup();
      
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