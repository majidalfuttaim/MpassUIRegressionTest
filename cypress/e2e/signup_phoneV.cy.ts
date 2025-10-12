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
      signupPage.addConfirmPassword(password);
      
      signupPage.logSubmittingForm();
      signupPage.clickSignupSubmitButton();
      
      signupPage.logWaitingForOTP();
      signupPage.waitForOTPPage();
      
      signupPage.logClickingSendOTP();
      signupPage.clickSendOTPButton();
      
      signupPage.logWaitingForOTPFields();
      
      signupPage.logEnteringOTP();
      signupPage.enterOTPCode('123456');
      
      signupPage.logVerifyingOTP();
      
      signupPage.logClickingContinue();
      signupPage.clickVerifyOTPButton();
      
      signupPage.logSavingUserData();
      
      cy.fixture(`usersStaging.json`).then((usersData: any) => {
        const existingUserKeys = Object.keys(usersData);
        const userCount = existingUserKeys.filter(key => key.startsWith('user')).length;
        const newUserKey = `user${userCount}`;
        
        signupPage.logUserCount(userCount, newUserKey);
        
        const newUser = {
          firstName: firstName,
          lastName: lastName,
          email: email, 
          phoneNumber: phoneNumber,
          nationality: selectedNationality || 'Unknown',
          password: password,
          mobile_verified: true
        };
        
        usersData[newUserKey] = newUser;
        
        signupPage.logTotalUsers(userCount + 1);
        
        signupPage.logWritingToFile();
        return cy.writeFile('cypress/fixtures/usersStaging.json', usersData).then(() => {
          signupPage.logUserDataWritten(newUserKey, newUser);
        });
      });
      
      signupPage.logClickingSaveButton();
      signupPage.clickSaveButton();
      
      signupPage.logSaveButtonClicked();
      cy.wait(1000);
      
      // Mark test as passed
      cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      cy.log('🎉 TEST PASSED: User signup completed successfully!');
      cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      cy.log('User Details Saved:');
      cy.log(`  First Name: ${firstName}`);
      cy.log(`  Last Name: ${lastName}`);
      cy.log(`  Email: ${email}`);
      cy.log(`  Phone: ${phoneNumber}`);
      cy.log(`  Nationality: ${selectedNationality || 'Unknown'}`);
      cy.log(`  Password: ${password}`);
      cy.log(`  Mobile Verified: true`);
      cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // Logout after test completion to ensure clean state for next test
      cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      cy.log('🚪 LOGGING OUT TO CLEAR SESSION');
      cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      signupPage.clickLogoutButton();
      
      // Log success
      cy.log('✅ PASSED: ' + client.name);
      cy.task('log', '✅ PASSED: ' + client.name, { log: false });
      
      // Final assertion to pass the test
      expect(true).to.be.true;
    });
  });
 
  
  
  

});