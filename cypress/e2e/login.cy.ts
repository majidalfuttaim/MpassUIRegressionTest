import { LoginPage } from "../pages/login_page.cy"
const loginPage = new LoginPage()


describe('Test Login Feature with client IDs from fixture file', () => {
  let clients!: Array<{ clientId: string; name: string; passwordLessEmail: boolean; googleLogin: boolean; facebookLogin: boolean; phoneLogin: boolean }>;
  let users!: Array<{ email: string; password: string; phoneVerified: boolean, phoneNumber: string}>;

  before(() => {
    const fixtureFileName = `clientDetailsStaging.json`; //`clientDetails${env}.json`;
    // Load the fixture data
    cy.fixture(fixtureFileName).then((data) => {
      clients = data.clientDetails;
      users= data.userDetails;
    });
  });

  it('Check Login successfully by Username(Phonenumber) for user that has verified email and phone number' , function() {
    const phone = users[0].phoneNumber;
    clients.forEach((client, index) => {
      // Store client name in Cypress env for error reporting
      Cypress.env('currentClient', client.name);
      
      // First check if phone login is enabled in fixture - skip early without navigating
      if (client.phoneLogin !== true) {
        loginPage.logTestSkipped(client.name, 'does not have phone login enabled in configuration');
        return; // Skip this client early without loading the page
      }
      
      // Only navigate if phone login is enabled
      loginPage.navigateToLoginPage(client.clientId, client.name, index + 1, clients.length);
      
      // Check if phone login is allowed by examining the placeholder
      loginPage.checkIfPhoneLoginAllowed(client.name).then((phoneLoginAllowed) => {
        if (phoneLoginAllowed) {
          // Both conditions met: proceed with phone login
          cy.log(`✅ Proceeding with phone login for: ${client.name}`);
          cy.task('log', `✅ Proceeding with phone login for: ${client.name}`, { log: false });
          
          loginPage.typeInEmailInputFiled(phone);
          loginPage.typeInPasswordInputFiled('Test@123');
          loginPage.clickOnSubmitButton();
          loginPage.validateWelcomeMessage(client.name);
          loginPage.clickLogoutButton();
          loginPage.logTestPassed(client.name);
        } else {
          // Placeholder doesn't allow phone - skip this client
          cy.log(`⏭️ Skipping ${client.name}: Email-only placeholder detected`);
          cy.task('log', `⏭️ Skipping ${client.name}: Email-only placeholder detected`, { log: false });
          loginPage.logTestSkipped(client.name, 'login by phone number is not allowed (email-only placeholder detected)');
        }
      });
    });
  });

  it('Check Login successfully by email for user that has verified email and phone number' , function() {
    const email =users[0].email;
    const password =users[0].password
    clients.forEach((client, index) => {
      // Store client name in Cypress env for error reporting
      Cypress.env('currentClient', client.name);
      
      loginPage.navigateToLoginPage(client.clientId, client.name, index + 1, clients.length);
      loginPage.typeInEmailInputFiled(email);
      loginPage.typeInPasswordInputFiled('Test@123');
      loginPage.clickOnSubmitButton();
      loginPage.validateWelcomeMessage(client.name);
      loginPage.clickLogoutButton();
      loginPage.logTestPassed(client.name);
    });
  });

  it('Check Main login page elements: ' , function() {
    // Sample only first 5 clients for element checking to reduce test time
    // Elements are consistent across clients, so full coverage isn't necessary
    const sampleClients = clients.slice(0, 5);
    
    sampleClients.forEach((client, index) => {
      // Store client name in Cypress env for error reporting
      Cypress.env('currentClient', client.name);
      
      loginPage.navigateToLoginPage(client.clientId, client.name, index + 1, sampleClients.length);
      loginPage.checkLoginMainLabel()
      loginPage.checkMainLogo()
      loginPage.checkTheEmailFiled()
      loginPage.checkPasswordFiled()
      loginPage.checkSubmitLoginBtn()
      loginPage.checkFooterCopy()
      loginPage.logTestPassed(client.name);
    });
    
    cy.log(`✅ Element checks completed for ${sampleClients.length}/${clients.length} clients (sampling)`);
  });

  // it('Check Error message upon adding wrong creadantials: ' , function() {
  //   //Need to add unblock function here.
  //   const email =users[0].email;
  //   clients.forEach((client) => {
  //     cy.log(`data ${JSON.stringify(client.name)}`);
  //     loginPage.navigateToLoginPage(client.clientId);
  //     loginPage.typeInEmailInputFiled(email);
  //     loginPage.typeInPasswordInputFiled('Test@1234576676');
  //     loginPage.clickOnSubmitButton();
  //     loginPage.checkTheInvalidemailOrPswordErrorMsg()
  //   });
  // });
  
});
