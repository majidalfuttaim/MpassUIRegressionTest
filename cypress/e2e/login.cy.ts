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
    const phone =users[0].phoneNumber;
    clients.forEach((client, index) => {
      // Log to Cypress
      cy.log(`🔍 Testing client: ${client.name} (${index + 1}/${clients.length})`);
      cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      cy.log('📋 CLIENT: ' + client.name);
      cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // Log to terminal console
      cy.task('log', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', { log: false });
      cy.task('log', '📋 TESTING CLIENT: ' + client.name + ' (' + (index + 1) + '/' + clients.length + ')', { log: false });
      cy.task('log', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', { log: false });
      
      // Store client name in Cypress env for error reporting
      Cypress.env('currentClient', client.name);
      
      loginPage.navigateToLoginPage(client.clientId);
      if(  client.phoneLogin == true){
        loginPage.typeInEmailInputFiled(phone);
        loginPage.typeInPasswordInputFiled('Test@123');
        loginPage.clickOnSubmitButton();
        loginPage.validateWelcomeMessage(client.name);
        loginPage.clickLogoutButton();
        cy.log('✅ PASSED: ' + client.name);
        cy.task('log', '✅ PASSED: ' + client.name, { log: false });
      }else{
        cy.log('⏭️ SKIPPED: ' + client.name + ' - does not have phone login enabled');
        cy.task('log', '⏭️ SKIPPED: ' + client.name, { log: false });
      }
    });
  });

  it('Check Login successfully by email for user that has verified email and phone number' , function() {
    const email =users[0].email;
    const password =users[0].password
    clients.forEach((client, index) => {
      // Log to Cypress
      cy.log(`🔍 Testing client: ${client.name} (${index + 1}/${clients.length})`);
      cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      cy.log('📋 CLIENT: ' + client.name);
      cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // Log to terminal console
      cy.task('log', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', { log: false });
      cy.task('log', '📋 TESTING CLIENT: ' + client.name + ' (' + (index + 1) + '/' + clients.length + ')', { log: false });
      cy.task('log', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', { log: false });
      
      // Store client name in Cypress env for error reporting
      Cypress.env('currentClient', client.name);
      
      loginPage.navigateToLoginPage(client.clientId);
      loginPage.typeInEmailInputFiled(email);
      loginPage.typeInPasswordInputFiled('Test@123');
      loginPage.clickOnSubmitButton();
      loginPage.validateWelcomeMessage(client.name);
      loginPage.clickLogoutButton();
      cy.log('✅ PASSED: ' + client.name);
      cy.task('log', '✅ PASSED: ' + client.name, { log: false });
    });
  });

  it('Check Main login page elements: ' , function() {
    clients.forEach((client, index) => {
      // Log to Cypress
      cy.log(`🔍 Testing client: ${client.name} (${index + 1}/${clients.length})`);
      cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      cy.log('📋 CLIENT: ' + client.name);
      cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // Log to terminal console
      cy.task('log', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', { log: false });
      cy.task('log', '📋 TESTING CLIENT: ' + client.name + ' (' + (index + 1) + '/' + clients.length + ')', { log: false });
      cy.task('log', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', { log: false });
      
      // Store client name in Cypress env for error reporting
      Cypress.env('currentClient', client.name);
      
      loginPage.navigateToLoginPage(client.clientId)
      loginPage.checkLoginMainLabel()
      loginPage.checkMainLogo()
      loginPage.checkTheEmailFiled()
      loginPage.checkPasswordFiled()
      loginPage.checkSubmitLoginBtn()
      loginPage.checkFooterCopy()
      cy.log('✅ PASSED: ' + client.name);
      cy.task('log', '✅ PASSED: ' + client.name, { log: false });
    });
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
