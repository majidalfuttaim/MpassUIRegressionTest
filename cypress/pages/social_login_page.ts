
export class SocialLogin{

    SocialLoginByFacebookShouldExists(){
        cy.get('#submit-button-facebook').should('exist');
    }

    SocialLoginByGoogleShouldExists(){
        cy.get('#submit-button-google').should('exist');
    }

    SocialLoginByAppleShouldExists(){
        cy.get('#submit-button').should('exist');
    }

    SocialLoginByFacebookShouldNotExists(){
        cy.get('#submit-button-facebook').should('not.exist');
    }

    SocialLoginByGoogleShouldNotExists(){
        cy.get('#submit-button-google').should('not.exist');
    }

    SocialLoginByAppleShouldNotExists(){
        cy.get('#submit-button').should('not.exist');
    }



}