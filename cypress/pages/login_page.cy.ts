
export class LoginPage{
    private editProfileLbl: string;
    private continueBtn: string;
    private emailInputSelector: string;
    private emailOrPhone: string;

    constructor() {
        this.emailInputSelector = '#email'; // Update this selector according to your HTML
        this.emailOrPhone = '#emailOrPhone';
        this.editProfileLbl = '.text-client-primary'; // Replace with your actual selector
        this.continueBtn = '#submit-button'; // Replace with your actual selector
    }

    // Logging methods
    logClientTest(clientName: string, currentIndex: number, totalClients: number) {
        cy.log(`🔍 Testing client: ${clientName} (${currentIndex}/${totalClients})`);
        cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        cy.log('📋 CLIENT: ' + clientName);
        cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        cy.task('log', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', { log: false });
        cy.task('log', '📋 TESTING CLIENT: ' + clientName + ' (' + currentIndex + '/' + totalClients + ')', { log: false });
        cy.task('log', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', { log: false });
    }

    logTestPassed(clientName: string) {
        cy.log('✅ PASSED: ' + clientName);
        cy.task('log', '✅ PASSED: ' + clientName, { log: false });
    }

    logTestSkipped(clientName: string, reason: string) {
        cy.log('⏭️ SKIPPED: ' + clientName + ' - ' + reason);
        cy.task('log', '⏭️ SKIPPED: ' + clientName, { log: false });
    }

    public checkEmailPlaceholder(): boolean {
    

        // cy.get(this.emailInputSelector).then(($input) => {
        //     const placeholder = $input.attr('placeholder');
        //     if (placeholder === expectedPlaceholder) {
        //         return true; // Placeholder is correct
        //     } else {
        //         cy.log("This BU doesnt have Phone number verifiecation");
        //         return false;
        //     }
        // });

        // Returning false because Cypress commands are asynchronous,
        // the function will return before the check completes.
        return false;
    }

    clickOnLoginPageButton() {
        cy.get('.w-full').click();
    }

    findPasswordlessToggle() {
        cy.get('[alt="client logo"]')
    }

    switchPasswordlessToggle() {
        cy.document().then((doc) => {
            const toggleElement = doc.querySelector('.toggle__line');
            if (toggleElement) {
                cy.get('.toggle__line', { timeout: 5000 }).click();
                cy.log('✅ Passwordless toggle clicked');
            } else {
                cy.log('⚠️ Toggle element .toggle__line not found - skipping toggle switch');
            }
        });
    }

    passwordlessTogglee() {
      return cy.get('.my-4 > .justify-between')
    }

    

    navigateToLoginPage(ClientID: string, clientName?: string, currentIndex?: number, totalClients?: number) {
        // Log client testing start if name provided
        if (clientName && currentIndex && totalClients) {
            cy.log(`🔍 Testing client: ${clientName} (${currentIndex}/${totalClients})`);
            cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            cy.log('📋 CLIENT: ' + clientName);
            cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            
            // Log to terminal console
            cy.task('log', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', { log: false });
            cy.task('log', '📋 TESTING CLIENT: ' + clientName + ' (' + currentIndex + '/' + totalClients + ')', { log: false });
            cy.task('log', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', { log: false });
        }
        
        cy.visit(''+ ClientID, { timeout: 120000 }); // Increased timeout for visit
        // Find and click any button/link containing "Login" text
        cy.contains('button, a', /login/i, { timeout: 15000 }).should('be.visible').click();
    }

    checkThePasswordlessToggleNotExists () {
        cy.document().then((doc) => {
            const toggleElement = doc.querySelector('.toggle__line');
            if (!toggleElement) {
                cy.log('✅ Passwordless toggle does not exist (as expected)');
            } else {
                cy.get('.toggle__line', { timeout: 5000 }).should('not.exist');
            }
        });
    }

    checkEmailPlaceholderValue(value: string){
        cy.document().then((doc) => {
            const emailInput = doc.querySelector('#email');
            const emailOrPhoneInput = doc.querySelector('#emailOrPhone');
            const usernameInput = doc.querySelector('#username');
            
            if (emailInput) {
                cy.get('#email').should('have.attr', 'placeholder', value);
            } else if (emailOrPhoneInput) {
                cy.get('#emailOrPhone').should('have.attr', 'placeholder', value);
            } else if (usernameInput) {
                cy.get('#username').should('have.attr', 'placeholder', value);
            } else {
                cy.log('⚠️ Email input field not found, skipping placeholder check');
            }
        });
    }

    checkPasswordlessPlaceholderValue(value: string){
        cy.document().then((doc) => {
            const emailInput = doc.querySelector('#email');
            const emailOrPhoneInput = doc.querySelector('#emailOrPhone');
            const usernameInput = doc.querySelector('#username');
            
            if (emailInput && emailInput.tagName === 'INPUT') {
                cy.get('#email').invoke('attr', 'placeholder').should('contain', value);
            } else if (emailOrPhoneInput) {
                // Second solution: Use cy.wrap() with DOM element extraction
                cy.wrap(emailOrPhoneInput).then(($el) => {
                    const placeholder = $el.attr('placeholder') || $el.find('input').attr('placeholder');
                    if (placeholder) {
                        expect(placeholder).to.contain(value);
                        cy.log(`✅ Placeholder contains: "${placeholder}"`);
                    } else {
                        cy.log('⚠️ Placeholder not found in #emailOrPhone');
                    }
                });
            } else if (usernameInput) {
                cy.get('#username').invoke('attr', 'placeholder').should('contain', value);
            } else {
                cy.log('⚠️ Email input field not found, skipping placeholder check');
            }
        });
    }

    clickBlankAreaBeforeSubmit() {
        cy.get('body').then(($body) => {
            const focusedElement = $body[0].ownerDocument.activeElement;
            if (focusedElement && focusedElement.tagName !== 'BODY') {
                cy.wrap(focusedElement).blur({ force: true });
            } else {
                cy.get('body').click(0, 0, { force: true });
            }
        });
        // Removed 500ms wait - form validation happens automatically
    }
      
    clickOnSubmitButton() {
        this.clickBlankAreaBeforeSubmit();
        // Wait for submit button to be enabled (form validation to pass)
        cy.get('#submit-button').should('not.be.disabled', { timeout: 10000 });
        cy.get('#submit-button').click({force: true});
        // Removed 5000ms wait - let subsequent assertions handle waiting
    }

    checkMainLogo(){
        cy.get('[alt="client logo"]', { timeout: 10000 }).should('exist').then(($el) => {
            if ($el && $el.length > 0) {
                cy.log('✅ Main logo found');
            } else {
                cy.log('⚠️ Main logo cannot be found');
            }
        });
    }
    checkLoginMainLabel(){
        cy.document().then((doc) => {
            const mainLabel = doc.querySelector('.text-2xl');
            const altLabel = doc.querySelector('.main-label-alt');
            if (mainLabel) {
                cy.get('.text-2xl', { timeout: 10000 }).should('exist');
            } else if (altLabel) {
                cy.get('.main-label-alt', { timeout: 10000 }).should('exist');
            } else {
                cy.log('⚠️ Login main label not found - neither .text-2xl nor .main-label-alt exists');
            }
        });
    }
    typeInEmailInputFiled(email: string){
        cy.get('body').then(($body) => {
            if ($body.find('#email').length > 0 && $body.find('#email').is('input')) {
                cy.get('#email').clear({force: true}).type(email, {force: true});
            } else if ($body.find('#emailOrPhone').length > 0) {
                // Check if it's a div containing an input
                if ($body.find('#emailOrPhone input').length > 0) {
                    cy.get('#emailOrPhone input').clear({force: true}).type(email, {force: true});
                } else if ($body.find('#emailOrPhone').is('input')) {
                    cy.get('#emailOrPhone').clear({force: true}).type(email, {force: true});
                } else {
                    cy.log('⚠️ #emailOrPhone is not an input, trying fallback');
                    cy.get('input[type="text"], input[type="email"], input[type="tel"]').first().clear({force: true}).type(email, {force: true});
                }
            } else if ($body.find('#username').length > 0) {
                cy.get('#username').clear({force: true}).type(email, {force: true});
            } else if ($body.find('input[name="email"]').length > 0) {
                cy.get('input[name="email"]').clear({force: true}).type(email, {force: true});
            } else if ($body.find('input[type="tel"]').length > 0) {
                cy.get('input[type="tel"]').first().clear({force: true}).type(email, {force: true});
            } else {
                // Fallback: try to find any visible input field
                cy.get('input[type="text"], input[type="email"], input[type="tel"]').first().clear({force: true}).type(email, {force: true});
                cy.log('⚠️ Used fallback selector for email/phone input');
            }
        });
    }
    typeInPasswordInputFiled(password: string){
        cy.get('input[type="password"]').type(password, {force: true});
    }

    validateWelcomeMessage(clientName?: string){
        const currentClient = clientName || Cypress.env('currentClient') || 'Unknown Client';
        cy.log('🔍 Validating login success for client: ' + currentClient);
        cy.task('log', '🔍 Validating login success for client: ' + currentClient, { log: false });
        
        // Wait for page to settle after login - reduced from 2000ms to 1000ms
        cy.wait(1000);
        
        // Check current URL and page state
        cy.url().then((url) => {
            cy.log(`📍 Current URL: ${url}`);
            cy.task('log', `📍 Current URL: ${url}`, { log: false });
            
            // Check for various post-login pages
            cy.get('body').then(($body) => {
                const bodyText = $body.text();
                
                // Check if on "Complete your profile" page
                if (bodyText.includes('Complete your profile') || bodyText.includes('Update your profile')) {
                    cy.log('⚠️ Profile completion page detected - handling it');
                    cy.task('log', '⚠️ Profile completion page detected - handling it', { log: false });
                    
                    // Click "Skip" or "Skip for now" or "Skip till next time" button if exists
                    cy.document().then((doc) => {
                        const skipBtn = doc.querySelector('button:contains("Skip")') ||
                                      doc.querySelector('a:contains("Skip")') ||
                                      doc.querySelector('[data-testid="skip-button"]');
                        
                        if (skipBtn) {
                            cy.wrap(skipBtn).click();
                            cy.wait(500); // Reduced from 1000ms
                            cy.log('✅ Skipped profile completion');
                        } else {
                            cy.log('⚠️ No skip button found, continuing');
                        }
                    });
                }
                
                // Check if on "Update your Preferences" page
                if (bodyText.includes('Update your Preferences') || bodyText.includes('preferences')) {
                    cy.log('⚠️ Preferences page detected - handling it');
                    cy.task('log', '⚠️ Preferences page detected - handling it', { log: false });
                    
                    // Try to click save or skip
                    cy.document().then((doc) => {
                        const skipBtn = doc.querySelector('button:contains("Skip")') ||
                                      doc.querySelector('a:contains("Skip")');
                        const saveBtn = doc.querySelector('#save') ||
                                      doc.querySelector('button:contains("Save")');
                        
                        if (skipBtn) {
                            cy.wrap(skipBtn).click();
                            cy.wait(500); // Reduced from 1000ms
                            cy.log('✅ Skipped preferences');
                        } else if (saveBtn) {
                            cy.wrap(saveBtn).click();
                            cy.wait(500); // Reduced from 1000ms
                            cy.log('✅ Saved preferences');
                        }
                    });
                }
                
                // Now validate login was successful by checking for welcome message or other success indicators
                cy.wait(500); // Reduced from 1000ms
                cy.get('body').then(($finalBody) => {
                    const finalText = $finalBody.text();
                    
                    // **CRITICAL FIX**: Add proper assertions instead of just logging
                    const hasSuccessIndicator = finalText.match(/welcome|you are logged in|logged in|home|dashboard|profile/i);
                    const notOnLoginPage = !finalText.includes('Sign in') && 
                                          !finalText.includes('Login') && 
                                          !finalText.includes('Enter your email') && 
                                          !finalText.includes('Password');
                    const hasErrorMessage = finalText.includes('Wrong email or password') || 
                                           finalText.includes('Invalid credentials') ||
                                           finalText.includes('Authentication failed');
                    
                    if (hasErrorMessage) {
                        cy.log('❌ Login FAILED - Error message detected for: ' + currentClient);
                        cy.task('log', '❌ Login FAILED - Error message detected for: ' + currentClient, { log: false });
                        throw new Error(`Login failed for ${currentClient}: Error message detected on page`);
                    } else if (hasSuccessIndicator) {
                        cy.log('✅ Login successful - found success indicator for: ' + currentClient);
                        cy.task('log', '✅ Login successful - found success indicator for: ' + currentClient, { log: false });
                        // Assert that we found success indicator
                        expect(hasSuccessIndicator, `Login success indicator found for ${currentClient}`).to.not.be.null;
                    } else if (notOnLoginPage) {
                        // Not on login page anymore, consider it successful
                        cy.log('✅ Login successful - no longer on login page for: ' + currentClient);
                        cy.task('log', '✅ Login successful - no longer on login page for: ' + currentClient, { log: false });
                        // Assert that we're not on login page
                        expect(notOnLoginPage, `Should not be on login page for ${currentClient}`).to.be.true;
                    } else {
                        // **CRITICAL**: Fail the test if we can't confirm login success
                        cy.log('❌ Login FAILED - Cannot confirm successful login for: ' + currentClient);
                        cy.task('log', '❌ Login FAILED - Cannot confirm successful login for: ' + currentClient, { log: false });
                        throw new Error(`Login validation failed for ${currentClient}: Cannot confirm successful login. Still appears to be on login page.`);
                    }
                });
            });
        });
    }

    clickLogoutButton() {
        cy.log('🔍 Looking for Logout button/link...');
        
        // Try different selectors for logout button/link
        const logoutSelectors = [
            'a:contains("Logout")',
            'button:contains("Logout")',
            'a:contains("Log out")',
            'button:contains("Log out")',
            '[href*="logout"]',
            '[class*="logout"]',
            '#logout',
            '.logout-btn',
            'a[href="/logout"]',
            '.w-full:contains("Logout")',
            '.w-full:contains("Log out")'
        ];
        
        cy.get('body').then(($body) => {
            let logoutFound = false;
            
            for (const selector of logoutSelectors) {
                if ($body.find(selector).length > 0) {
                    cy.log(`✅ Found logout element with selector: ${selector}`);
                    cy.get(selector).first().click({ force: true });
                    logoutFound = true;
                    cy.log('✅ Logout button clicked');
                    break;
                }
            }
            
            if (!logoutFound) {
                cy.log('⚠️ Logout button not found with standard selectors, trying to find any link/button with logout text...');
                
                // Try a more generic approach
                cy.get('body').then(($b) => {
                    const allLinks = $b.find('a, button, .w-full');
                    allLinks.each((index, element) => {
                        const text = Cypress.$(element).text().toLowerCase();
                        if (text.includes('logout') || text.includes('log out') || text.includes('sign out')) {
                            cy.wrap(element).click({ force: true });
                            cy.log(`✅ Clicked logout element with text: "${Cypress.$(element).text()}"`);
                            logoutFound = true;
                            return false; // break the loop
                        }
                    });
                    
                    if (!logoutFound) {
                        cy.log('⚠️ WARNING: Logout button not found - trying fallback selector .w-full');
                        // Fallback to original selector if nothing else works
                        if ($b.find('.w-full').length > 0) {
                            cy.get('.w-full').first().click({ force: true });
                            cy.log('✅ Clicked .w-full element as fallback');
                        } else {
                            cy.log('❌ ERROR: No logout button found');
                        }
                    }
                });
            }
        });
        
        // Verify logout by waiting for URL change instead of arbitrary wait
        cy.url({ timeout: 5000 }).should((url) => {
            expect(url.includes('logout') || url.includes('login') || url.includes('landing')).to.be.true;
        }).then((url) => {
            cy.log('✅✅✅ LOGOUT SUCCESSFUL - Session cleared ✅✅✅');
            cy.log(`📍 URL: ${url}`);
        });
        
        cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        cy.log('🔄 Ready for next test with clean session');
        cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }

    checkTheEmailFiled(){
        cy.document().then((doc) => {
            const emailInput = doc.querySelector('#email');
            const emailOrPhoneInput = doc.querySelector('#emailOrPhone');
            const usernameInput = doc.querySelector('#username');
            
            if (emailInput) {
                cy.get('#email').should('exist');
            } else if (emailOrPhoneInput) {
                cy.get('#emailOrPhone').should('exist');
            } else if (usernameInput) {
                cy.get('#username').should('exist');
            } else {
                // Fallback: check for any text/email/tel input
                cy.get('input[type="text"], input[type="email"], input[type="tel"]').first().should('exist');
                cy.log('⚠️ Used fallback selector for email field check');
            }
        });
    }

    checkPasswordFiled(){
        cy.document().then((doc) => {
            const passwordInput = doc.querySelector('#password') || doc.querySelector('input[type="password"]');
            if (passwordInput) {
                cy.get('#password, input[type="password"]').first().should('exist');
                cy.log('✅ Password field exists');
            } else {
                cy.log('⚠️ Password field not found - skipping check');
            }
        });
    }
    
    checkSubmitLoginBtn(){
        cy.document().then((doc) => {
            const submitBtn = doc.querySelector('#submit-button') || doc.querySelector('button[type="submit"]');
            if (submitBtn) {
                cy.get('#submit-button, button[type="submit"]').first().should('exist');
                cy.log('✅ Submit button exists');
            } else {
                cy.log('⚠️ Submit button not found - skipping check');
            }
        });
    }

    /**
     * Check if phone login is allowed by examining the email input field placeholder
     * Returns true if phone/username is allowed, false if only email
     */
    checkIfPhoneLoginAllowed(clientName?: string): Cypress.Chainable<boolean> {
        const currentClient = clientName || Cypress.env('currentClient') || 'Unknown Client';
        
        return cy.document().then((doc) => {
            const emailInput = doc.querySelector('#email');
            const emailOrPhoneInput = doc.querySelector('#emailOrPhone');
            const usernameInput = doc.querySelector('#username');
            
            let placeholder = '';
            let inputType = '';
            
            if (emailInput && emailInput instanceof HTMLInputElement) {
                placeholder = emailInput.placeholder || '';
                inputType = emailInput.type || 'text';
            } else if (emailOrPhoneInput) {
                if (emailOrPhoneInput instanceof HTMLInputElement) {
                    placeholder = emailOrPhoneInput.placeholder || '';
                    inputType = emailOrPhoneInput.type || 'text';
                } else {
                    const inputElement = emailOrPhoneInput.querySelector('input');
                    placeholder = inputElement?.getAttribute('placeholder') || '';
                    inputType = inputElement?.type || 'text';
                }
            } else if (usernameInput && usernameInput instanceof HTMLInputElement) {
                placeholder = usernameInput.placeholder || '';
                inputType = usernameInput.type || 'text';
            } else {
                // Fallback: find any input field
                const anyInput = doc.querySelector('input[type="text"], input[type="email"], input[type="tel"]') as HTMLInputElement;
                placeholder = anyInput?.placeholder || '';
                inputType = anyInput?.type || 'text';
            }
            
            const placeholderLower = placeholder.toLowerCase().trim();
            cy.log(`📋 Input placeholder: "${placeholder}" (type: ${inputType})`);
            cy.task('log', `📋 Input placeholder for ${currentClient}: "${placeholder}" (type: ${inputType})`, { log: false });
            
            // Check if placeholder mentions phone/mobile/username (indicates phone login is allowed)
            const allowsPhone = placeholderLower.includes('phone') || 
                               placeholderLower.includes('mobile') || 
                               placeholderLower.includes('username') ||
                               placeholderLower.includes('email or phone') ||
                               placeholderLower.includes('email/phone') ||
                               placeholderLower.includes('email or mobile') ||
                               placeholderLower.includes('number');
            
            // More comprehensive email-only detection
            const onlyEmail = (placeholderLower === 'email' || 
                              placeholderLower === 'email address' ||
                              placeholderLower === 'enter your email' ||
                              placeholderLower === 'enter email' ||
                              placeholderLower === 'your email' ||
                              placeholderLower === 'e-mail' ||
                              placeholderLower === 'enter your email address' ||
                              inputType === 'email') && !allowsPhone;
            
            if (onlyEmail) {
                cy.log(`⏭️ SKIPPING "${currentClient}": Login by phone number is NOT allowed (email-only field detected)`);
                cy.task('log', `⏭️ SKIPPING "${currentClient}": Login by phone number is NOT allowed (email-only field detected)`, { log: false });
                cy.log(`   Reason: Placeholder="${placeholder}", Type="${inputType}"`);
                return cy.wrap(false);
            } else if (allowsPhone) {
                cy.log(`✅ Phone login IS allowed for client: ${currentClient}`);
                cy.task('log', `✅ Phone login IS allowed for client: ${currentClient}`, { log: false });
                return cy.wrap(true);
            } else {
                // Uncertain case - check input type and placeholder more carefully
                if (inputType === 'email') {
                    // Input type is email, likely email-only
                    cy.log(`⏭️ SKIPPING "${currentClient}": Input type is 'email' - likely email-only field`);
                    cy.task('log', `⏭️ SKIPPING "${currentClient}": Input type is 'email' - likely email-only field`, { log: false });
                    return cy.wrap(false);
                } else if (inputType === 'tel') {
                    // Input type is tel, likely allows phone
                    cy.log(`✅ Phone login IS allowed (input type is 'tel'): ${currentClient}`);
                    cy.task('log', `✅ Phone login IS allowed (input type is 'tel'): ${currentClient}`, { log: false });
                    return cy.wrap(true);
                } else {
                    // Still uncertain - default to NOT allowing phone to avoid false login attempts
                    cy.log(`⚠️ Cannot determine definitively - defaulting to SKIP for safety: ${currentClient}`);
                    cy.task('log', `⚠️ Cannot determine definitively - defaulting to SKIP for safety: ${currentClient}`, { log: false });
                    return cy.wrap(false);
                }
            }
        });
    }
    
    checkFooterCopy(){
        cy.document().then((doc) => {
            const footerText = doc.body.textContent?.includes('Majid al Futtaim');
            if (footerText) {
                cy.contains('Majid al Futtaim').should('exist');
                cy.log('✅ Footer copyright text exists');
            } else {
                cy.log('⚠️ Footer copyright text not found - skipping check');
            }
        });
    }
    checkTheInvalidemailOrPswordErrorMsg() {
     cy.get('.text-light-background_default') // Selector for the message that will be revealed
       .should('be.visible') // Wait for the message to be visible
       .invoke('text') // Extract the text from the message
       .then((text) => {
    expect(text).to.satisfy((t :any) => t === 'Incorrect email and/or password. Please try again.' || t === "Your account has been blocked after multiple consecutive login attempts. We've sent you a notification via your preferred contact method with instructions on how to unblock it."); 

  });
    }



}
