import { LoginPage } from "../pages/login_page.cy"
import { SignupPage } from "../pages/signup_page.cy"


const loginPage = new LoginPage()
const signupPage = new SignupPage()


describe('Test Sign up Feature For client with No verification required', () => {
  let clients!: Array<{ clientId: string; name: string; passwordLessEmail: boolean; googleLogin: boolean; facebookLogin: boolean; phoneLogin: boolean }>;

  before(() => {
    const fixtureFileName = `clientNoverification.json`;
    
    // Load the fixture data
    cy.fixture(fixtureFileName).then((data) => {
      clients = data.clientDetails;
    });
  });

  it('Complete signup form without verification', function() {
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
      
      // Scroll back up to phone input field (page scrolls down after country selection)
      cy.get('#phoneNumber').scrollIntoView({ offset: { top: -100, left: 0 } });
      cy.wait(500); // Wait for scroll animation to complete
      cy.get('#phoneNumber').should('be.visible').and('not.be.disabled');
      
      signupPage.addPhoneInsideTheField(phoneNumber);
      
      // Add nationality and capture the selected value
      signupPage.selectRandomNationality().then((nationality: string) => {
        selectedNationality = nationality;
      });
      
      // Add password
      signupPage.addPasswordToField(password);
            
      // Submit the form
      signupPage.clickSignupSubmitButton();

      // Click on "Skip till next time" button
      signupPage.clickSkipButton();

      // Click on toggle button
      signupPage.clickToggleLine();

      // Click on Save button
      signupPage.clickSaveButton();

      // Save user data to usersStaging.json with phone_verified: false
      cy.then(() => {
        signupPage.saveUserDataToFixture(firstName, lastName, email, phoneNumber, selectedNationality, password, false);
      });

      // Verify welcome message
      signupPage.verifyWelcomeMessage();

      // Click on Logout button
      signupPage.clickLogoutButton();
    });
  });
});
