import {LoginPage} from "../pages/login_page.cy"
import {SocialLogin} from "../pages/social_login_page"

const loginPage = new LoginPage()
const socialLogin = new SocialLogin()

describe('Test the Social login', () => {
let clients!: Array<{ clientId: string; name: string; passwordLessEmail: boolean; googleLogin: boolean; facebookLogin: boolean }>;

before(() => {
  // Determine which fixture file to load based on the environment variable
  const env = Cypress.env('ENV') || 'Prod'; // e.g., 'dev' or 'prod'
  const fixtureFileName = `clientDetails${env}.json`;
  // Load the fixture data
  cy.fixture(fixtureFileName).then((data) => {
    clients = data.clientDetails;
  });
});

it(' Should Check the Social login by Facebook for', function() {
  clients.forEach((client) => {
    cy.log(`data ${JSON.stringify(client.name)}`);
    if(client.facebookLogin == true){
      loginPage.navigateToLoginPage(client.clientId)
      socialLogin.SocialLoginByFacebookShouldExists()
      }
      else{
        loginPage.navigateToLoginPage(client.clientId)
        socialLogin.SocialLoginByFacebookShouldNotExists()
      }  
  });
});

it.only(' Should Check the Social login by Google for : ', function() {
  clients.forEach((client) => {
    cy.log(`data ${JSON.stringify(client.name)}`);
    if(client.googleLogin == true){
      loginPage.navigateToLoginPage(client.clientId)
      socialLogin.SocialLoginByGoogleShouldExists()
    }
    else{
      loginPage.navigateToLoginPage(client.clientId)
      socialLogin.SocialLoginByGoogleShouldNotExists()
    }
  })    
})

});


