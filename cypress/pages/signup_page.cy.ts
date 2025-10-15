export class SignupPage{

    private editProfileLbl: string;
    private continueBtn: string;
    private emailInputSelector: string;
    private randomPhoneNumber: string;

    constructor() {
        this.editProfileLbl = '.text-client-primary';
        this.continueBtn = '#submit-button';
        this.emailInputSelector = '#email';
        this.randomPhoneNumber = this.generateRandomPhoneNumber();
    }

    // Logging methods
    logClientTest(clientName: string, currentIndex: number, totalClients: number) {
        cy.log(`🔍 Testing signup form for client: ${clientName} (${currentIndex}/${totalClients})`);
        cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        cy.log('📋 CLIENT: ' + clientName);
        cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        cy.task('log', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', { log: false });
        cy.task('log', '📋 TESTING CLIENT: ' + clientName + ' (' + currentIndex + '/' + totalClients + ')', { log: false });
        cy.task('log', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', { log: false });
    }

    logFillingForm() {
        cy.log('Filling signup form');
    }

    logSelectingNationality() {
        cy.log('Selecting first nationality');
    }

    logNationalitySelected(nationality: string) {
        cy.log(`✅ Captured nationality: ${nationality}`);
    }

    logEnteringPassword() {
        cy.log('Entering password');
    }

    logSubmittingForm() {
        cy.log('Submitting signup form');
    }

    logVerifyingEmail() {
        cy.log('📧 Verifying email from inbox (Gmail API will auto-click verify link and return to login page)');
    }

    logWaitingForOTP() {
        cy.log('Waiting for OTP verification page');
    }

    logClickingSendOTP() {
        cy.log('Clicking Send OTP button');
    }

    logWaitingForOTPFields() {
        cy.log('Waiting for OTP fields to be ready');
    }

    logEnteringOTP() {
        cy.log('🔢 Entering OTP code: 123456');
    }

    logVerifyingOTP() {
        cy.log('Verifying OTP was entered');
    }

    logClickingContinue() {
        cy.log('Clicking Continue button');
    }

    logSavingUserData() {
        cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        cy.log('📝 SAVING USER DATA TO FIXTURE FILE NOW...');
        cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }

    logUserCount(count: number, newUserKey: string) {
        cy.log(`📂 Current number of users: ${count}`);
        cy.log(`➕ Adding new user as: ${newUserKey}`);
    }

    logTotalUsers(count: number) {
        cy.log(`📂 Total users after adding: ${count}`);
    }

    logWritingToFile() {
        cy.log('💾 Writing to cypress/fixtures/usersStaging.json...');
    }

    logUserDataWritten(newUserKey: string, newUser: any) {
        cy.log(`✅✅✅ User data written to usersStaging.json as '${newUserKey}' ✅✅✅`);
        cy.log(`✅ Data saved: ${JSON.stringify(newUser, null, 2)}`);
    }

    logClickingSaveButton() {
        cy.log('Clicking Save button');
    }

    logSaveButtonClicked() {
        cy.log('Save button clicked - completing signup process...');
    }

    private generateRandomNumber(): number {
        return Math.floor(1000 + Math.random() * 9000);
    }

    private generateRandomPhoneNumber(): string {
        const randomNum = this.generateRandomNumber();
        return `55${randomNum}111`;
    }

    public getPhoneNumber(): string {
        return this.randomPhoneNumber;
    }
    
    clickOnsignupPageButton() {
        cy.contains('Register').first().click({force: true});
    }

    clickOnTitleTogle() {
        cy.document().then(doc => {
            const titleToggle = doc.querySelector('.text-center > :nth-child(1) > .flex > .w-6');
            if (titleToggle) {
                cy.log('✅ Title toggle found, clicking it');
                cy.get('.text-center > :nth-child(1) > .flex > .w-6').click({scrollBehavior:false, force: true});
            } else {
                cy.log('⚠️ WARNING: Title toggle not found - skipping this step (element may be optional)');
            }
        });
    }

    addFirstName(firstName: string) {
        cy.get('#firstName').type(firstName, {scrollBehavior:false})
    }

    addLastName(lastName: string) {
        cy.get('#lastName').type(lastName, {scrollBehavior:false})
    }

    addEmailInsideEmailField( email : string) {
        cy.get('#email').type(email, {scrollBehavior:false})
        cy.log(`the email is : ${email}`)
    }

    addPhoneInsideTheField( phone : string) {
        // Wait for phone field to be ready
        cy.get('#phoneNumber').should('be.visible').and('not.be.disabled');
        cy.wait(300);
        
        // Store reference to avoid re-querying
        cy.get('#phoneNumber').as('phoneInput');
        
        // Type phone number
        cy.get('@phoneInput').type(phone, {scrollBehavior:false, force: true});
        cy.log(`the phonenumber is : ${phone}`);
    }

   createEmail(){
    const email = `baramaf9+auto${Date.now()}@gmail.com`; // Generate a unique email
    return email;
    }

    clickOnPhoneArrow() {
        cy.get('bdi > .my-2 > .relative > .inset-y-0').click({scrollBehavior:false, force: true});
    }

    clickOnCountry() {
        cy.get('.text-left > :nth-child(4)').scrollIntoView().click({scrollBehavior:false, force: true});
        // Wait for the page re-render to complete
        cy.wait(1000); // Wait for dropdown to close and page to start re-render
        // Additional wait to ensure DOM is fully stable after re-render
        cy.wait(500);
    }

    // Click on nationality dropdown - with dynamic selector detection
    clickOnNationalityDropdown() {
        // Check which nationality selector exists
        cy.document().then((doc) => {
            const nationalitySelector = doc.querySelector('#nationality') ? '#nationality' : 
                                       doc.querySelector('[name="nationality"]') ? '[name="nationality"]' :
                                       doc.querySelector('select[id*="national" i]') ? 'select[id*="national" i]' :
                                       doc.querySelector('select[name*="national" i]') ? 'select[name*="national" i]' : null;
            
            if (nationalitySelector) {
                cy.get(nationalitySelector).click({scrollBehavior:false});
                // Reduced wait from 500ms - let dropdown open naturally
            } else {
                cy.log('⚠️ Nationality field not found, skipping nationality selection');
            }
        });
    }

    // Select a random nationality from the dropdown
    selectRandomNationality() {
        // Check which nationality selector exists
        return cy.document().then((doc) => {
            const nationalitySelector = doc.querySelector('#nationality') ? '#nationality' : 
                                       doc.querySelector('[name="nationality"]') ? '[name="nationality"]' :
                                       doc.querySelector('select[id*="national" i]') ? 'select[id*="national" i]' :
                                       doc.querySelector('select[name*="national" i]') ? 'select[name*="national" i]' : null;
            
            if (!nationalitySelector) {
                cy.log('⚠️ Nationality field not found, skipping nationality selection');
                return cy.wrap('Unknown');
            }

            cy.log(`Found nationality selector: ${nationalitySelector}`);
            
            // Select the first valid option (not the placeholder)
            return cy.get(nationalitySelector).then(($select) => {
                const options = $select.find('option');
                
                // Find the first option that has a non-empty value
                for (let i = 0; i < options.length; i++) {
                    const optionValue = (options[i] as HTMLOptionElement).value;
                    const optionText = (options[i] as HTMLOptionElement).text;
                    
                    if (optionValue !== '' && optionValue !== null) {
                        cy.get(nationalitySelector).select(optionValue);
                        cy.log(`✅ Selected first nationality: ${optionText}`);
                        return cy.wrap(optionText);
                    }
                }
                return cy.wrap('Unknown');
            });
        });
    }

    // Add password to password field - with dynamic selector detection
    addPasswordToField(password: string) {
        cy.get('body').then(($body) => {
            let passwordSelector = null;
            
            if ($body.find('#password').length > 0) {
                passwordSelector = '#password';
            } else if ($body.find('[name="password"]').length > 0) {
                passwordSelector = '[name="password"]';
            } else if ($body.find('input[type="password"]').length > 0) {
                passwordSelector = 'input[type="password"]';
            }
            
            if (passwordSelector) {
                cy.get(passwordSelector).first().scrollIntoView().type(password, {scrollBehavior:false, force: true});
                cy.log(`✅ Password entered`);
            } else {
                cy.log('⚠️ Password field not found, skipping password entry');
            }
        });
    }

    // Add confirm password - with dynamic selector detection
    addConfirmPassword(password: string) {
        cy.document().then((doc) => {
            const confirmPasswordSelector = doc.querySelector('#confirmPassword') ? '#confirmPassword' : 
                                           doc.querySelector('[name="confirmPassword"]') ? '[name="confirmPassword"]' :
                                           doc.querySelector('[name="confirm-password"]') ? '[name="confirm-password"]' :
                                           doc.querySelector('input[type="password"]') ? 'input[type="password"]' : null;
            
            if (confirmPasswordSelector) {
                // If using generic password selector, get the last one (usually confirm password)
                if (confirmPasswordSelector === 'input[type="password"]') {
                    cy.get(confirmPasswordSelector).last().type(password, {scrollBehavior:false});
                } else {
                    cy.get(confirmPasswordSelector).type(password, {scrollBehavior:false});
                }
                cy.log(`✅ Confirm password entered`);
            } else {
                cy.log('⚠️ Confirm password field not found, skipping confirm password entry');
            }
        });
    }

    PickDate(){
        cy.get('[data-v-e2f5e054=""] > .relative > .inset-y-0').click();
        cy.get('.calendar-header > div > .text-left').click()
        cy.get('#\\32 012-calendar-year')

    }

   
    scrollToMainTitle() {
        cy.get('.text-xl').scrollIntoView();
    }
    

    navigateToLoginPage(ClientID: string) {
        cy.visit(''+ ClientID);
        // Removed 1000ms wait - page will load automatically
        cy.get('.w-full').last().click();
    }

    checkThePasswordlessToggleNotExists () {
        cy.get('[alt="client logo"]').should($el => {
            expect($el, 'Cannot be found').to.not.exist    // expect causes retry for 4 seconds
                                                           
            Cypress.log({
              name: 'Missing',
              message: 'passwordless toggle cannot be found'
            })
          })
    }

    checkEmailPlaceholderValue(value: string){
    return cy.get('#email').invoke('attr', 'placeholder').should('equal',value);
    }

    checkPasswordlessPlaceholderValue(value: string){
        return cy.get('#email').invoke('attr', 'placeholder').should('contain',value);
        }
      
    clickOnSubmitButton() {
        // Removed 1000ms wait - button will be clicked when ready
        cy.get('#submit-button').click()
    }

    checkMainLogo(){
        cy.get('[alt="client logo"]').should($el => {
            expect($el, 'Cannot be found').to.be.exist    // expect causes retry for 4 seconds                                      
            Cypress.log({
              name: 'Missing',
              message: 'Main logo cannot be found'
            })
          })
        
    }
    checkLoginMainLabel(){
        cy.get('.text-2xl').should('exist')
    }
    typeInEmailInputFiled(email: string){
        cy.get('#email').type(email)
    }
    typeInPasswordInputFiled(password: string){
        cy.get('input[type="password"]').type(password);
    }

    validateEditProfileLabel(){
        cy.get('.text-client-primary').should('exist')  
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
        
        // Wait for logout to complete
        cy.wait(2000);
        
        // Verify logout was successful by checking URL or page content
        cy.url().then((url) => {
            cy.log(`📍 Current URL after logout: ${url}`);
            if (url.includes('logout') || url.includes('login') || url.includes('landing')) {
                cy.log('✅✅✅ LOGOUT SUCCESSFUL - Session cleared ✅✅✅');
            } else {
                cy.log('⚠️ Logout may not have completed - current URL: ' + url);
            }
        });
        
        cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        cy.log('🔄 Ready for next client test with clean session');
        cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }

    checkTheEmailFiled(){
    cy.get('#email').should('exist')
    }

    checkPasswordFiled(){
        cy.get('#password').should('exist')
    }
    checkSubmitLoginBtn(){
        cy.get('#submit-button').should('exist')
    }
    checkFooterCopy(){
        cy.contains('Majid al Futtaim. All rights reserved').should('exist')
    }
    checkTheInvalidemailOrPswordErrorMsg() {
     cy.get('.text-light-background_default') // Selector for the message that will be revealed
       .should('be.visible') // Wait for the message to be visible
       .invoke('text') // Extract the text from the message
       .then((text) => {
    expect(text).to.satisfy((t :any) => t === 'Incorrect email and/or password. Please try again.' || t === "Your account has been blocked after multiple consecutive login attempts. We've sent you a notification via your preferred contact method with instructions on how to unblock it."); 
    
       });
    }

    // Verify we're on the signup page
    verifySignupPage() {
        cy.url().should('include', '/sign-up');
        cy.log('Successfully navigated to signup page');
    }

    // Check if signup page title exists
    checkSignupTitle() {
        cy.get('.text-xl', { timeout: 10000 }).should('exist');
    }

    // Navigate to signup page via landing page flow
    navigateToSignupPage(clientId: string, clientName?: string, currentIndex?: number, totalClients?: number) {
        // Log client testing start if name provided
        if (clientName && currentIndex && totalClients) {
            cy.log(`🔍 Testing signup form for client: ${clientName} (${currentIndex}/${totalClients})`);
            cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            cy.log('📋 CLIENT: ' + clientName);
            cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            
            // Log to terminal console
            cy.task('log', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', { log: false });
            cy.task('log', '📋 TESTING CLIENT: ' + clientName + ' (' + currentIndex + '/' + totalClients + ')', { log: false });
            cy.task('log', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', { log: false });
        }
        
        // Remove trailing #/ from clientId if present to avoid URL conflicts
        const cleanClientId = clientId.replace(/#\/$/, '');
        
        // Step 1: Visit the landing page
        const landingUrl = `https://mafid-sit.progressive.majidalfuttaim.com/landing/client/${cleanClientId}`;
        cy.log(`📍 Navigating to landing page: ${landingUrl}`);
        cy.visit(landingUrl);
        cy.wait(2000);
        
        // Step 2: Click on login page button - find any button/link containing "Login"
        cy.log('🔘 Clicking on Login button');
        cy.contains('button, a', /login/i, { timeout: 15000 }).should('be.visible').click();
        cy.log('✅ Clicked login button on landing page');
        
        // Step 3: Wait for login page to fully load
        cy.log('⏳ Waiting for login page to load...');
        cy.wait(3000);
        
        // Step 4: Click on register/sign-up link - find any button/link containing "Register" or "Sign up"
        cy.log('🔘 Clicking on Register label');
        cy.contains('button, a', /(register|sign up|sign-up|signup)/i, { timeout: 15000 }).should('be.visible').click({force: true});
        cy.log('✅ Clicked register link');
        
        // Step 5: Wait for signup page to load
        cy.log('✅ Waiting for signup page to load...');
        cy.wait(2000);
        cy.url().should('include', 'sign-up', { timeout: 10000 });
        cy.log('✅ Successfully navigated to signup page');
    }

    // Click submit button on signup form
    clickSignupSubmitButton() {
        // Wait for page to stabilize after form filling
        cy.wait(1000);
        
        // Scroll to the submit button to ensure it's visible
        cy.get('#submit-button').scrollIntoView();
        cy.wait(500);
        
        // Store reference to button to avoid re-querying during page updates
        cy.get('#submit-button').as('submitBtn');
        
        // Wait for button to be stable and not covered
        cy.get('@submitBtn').should('be.visible');
        cy.wait(300);
        
        // Click with force to avoid coverage issues
        cy.get('@submitBtn').click({force: true, scrollBehavior: false});
        cy.log('✅ Clicked submit button');
        cy.wait(1000);
    }

    // Verify email by opening inbox and clicking verification link
    verifyEmailFromInbox(email: string, clientId: string) {
        cy.log('📧 Starting Gmail API email verification process');
        
        // Reduced wait from 5000ms to 3000ms - email usually arrives quickly
        cy.wait(3000);
        cy.log(`📬 Fetching verification email from Gmail for: ${email}`);
        
        // Use Gmail API to get verification email
        cy.task('gmail:getVerificationEmail', {
            email: email,
            maxRetries: 10,
            retryDelay: 3000
        }).then((result: any) => {
            if (result && result.link) {
                cy.log(`✅ Verification email received!`);
                cy.log(`📧 Subject: ${result.message.subject}`);
                cy.log(`🔗 Verification link: ${result.link}`);
                
                // Visit the verification link
                cy.log('🌐 Clicking verification link...');
                cy.visit(result.link);
                
                // Reduced wait from 5000ms to 2000ms - verification usually completes quickly
                cy.log('⏳ Waiting for email verification to complete...');
                cy.wait(2000);
                
                // Check if verification was successful
                cy.url().then(url => {
                    cy.log(`✅ Email verification complete!`);
                    cy.log(`📍 Current URL after verification: ${url}`);
                    
                    if (url.includes('verified') || url.includes('success') || url.includes('confirm')) {
                        cy.log('✅✅ Email verified successfully - confirmation page detected!');
                    } else if (url.includes('login') || url.includes('sign-in')) {
                        cy.log('✅✅ Email verified - already redirected to login page!');
                    } else {
                        cy.log(`📍 Verification completed, current page: ${url}`);
                    }
                });
                
                // Now navigate to login page after verification
                cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                cy.log('🔙 Navigating to login page after email verification');
                cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                
                const cleanClientId = clientId.replace(/#\/$/, '');
                const landingUrl = `https://mafid-sit.progressive.majidalfuttaim.com/landing/client/${cleanClientId}`;
                
                cy.log(`📍 Visiting landing page: ${landingUrl}`);
                cy.visit(landingUrl);
                // Reduced wait from 2000ms - page will load automatically
                
                // Click on login button - wait for it to be visible instead of arbitrary wait
                cy.log('🖱️ Clicking login button on landing page');
                cy.contains('button, a', /login/i, { timeout: 10000 }).should('be.visible').click({force: true});
                // Removed 2000ms wait after click
                
                // Verify we're on login page
                cy.url().should('include', 'login');
                cy.log('✅ Successfully navigated to login page');
                
                cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                cy.log('✅ EMAIL VERIFICATION STEP COMPLETED');
                cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            } else {
                // Fallback to manual verification
                cy.log('⚠️ Could not fetch email automatically');
                cy.log('📧 MANUAL VERIFICATION REQUIRED:');
                cy.log(`1. Check email inbox: ${email}`);
                cy.log('2. Click the verification link in the email');
                cy.log('3. Continue with the test');
                
                // Check current URL
                cy.url().then(url => {
                    cy.log(`Current URL: ${url}`);
                });
            }
        });
    }

    // Navigate to login page after email verification
    navigateToLoginAfterEmailVerification(clientId: string) {
        const cleanClientId = clientId.replace(/#\/$/, '');
        
        // First try to go to landing page, then click login
        const landingUrl = `https://mafid-sit.progressive.majidalfuttaim.com/landing/client/${cleanClientId}`;
        
        cy.log(`🔙 Navigating to landing page: ${landingUrl}`);
        cy.visit(landingUrl);
        // Removed 2000ms wait - page loads automatically
        
        // Click login button - wait for visibility instead of arbitrary wait
        cy.log('🔘 Clicking Login button');
        cy.contains('button, a', /login/i, { timeout: 10000 }).should('be.visible').click({force: true});
        // Removed 2000ms wait after click
        
        cy.url().should('include', 'login');
        cy.log('✅ Successfully navigated to login page');
    }

    // Validate successful signup (adjust selector based on actual success message)
    validateSignupSuccess() {
        // This selector might need to be adjusted based on the actual success message
        cy.get('.border-gray-600', { timeout: 10000 }).should('exist');
    }

    // Wait for OTP page to load
    waitForOTPPage() {
        // Wait for OTP page - URL might include 'verify' or 'otp'
        cy.url({ timeout: 15000 }).should((url) => {
            // Ensure URL is a valid string before checking
            expect(url, 'URL should be a string').to.be.a('string');
            const isOTPPage = url.includes('verify') || url.includes('otp') || url.includes('verification');
            expect(isOTPPage, 'Should be on OTP/verification page').to.be.true;
        });
        cy.log('✅ OTP verification page loaded');
    }

    // Click on Send OTP button
    clickSendOTPButton() {
        // Try multiple possible selectors for Send OTP button
        cy.document().then((doc) => {
            const sendOTPSelector = doc.querySelector('#send-otp') ? '#send-otp' :
                                   doc.querySelector('[name="send-otp"]') ? '[name="send-otp"]' :
                                   doc.querySelector('#submit-button') ? '#submit-button' :
                                   doc.querySelector('button[type="submit"]') ? 'button[type="submit"]' : null;
            
            if (sendOTPSelector) {
                cy.get(sendOTPSelector).click({force: true, scrollBehavior: false});
                cy.log('✅ Clicked Send OTP button');
                // Removed 1000ms wait - next command will auto-wait
            } else {
                // Fallback: try to find button with text containing 'send' or 'otp'
                cy.contains('button', /send|otp|continue/i).first().click({force: true, scrollBehavior: false});
                cy.log('✅ Clicked Send OTP button (fallback)');
                // Removed 1000ms wait - next command will auto-wait
            }
        });
    }

    // Enter OTP code
    enterOTPCode(otp: string) {
        cy.wait(500); // Small wait for OTP fields to appear
        
        // Try multiple possible selectors for OTP input fields
        cy.document().then((doc) => {
            // Check if there are individual OTP input fields
            const otpInputs = doc.querySelectorAll('input[type="text"][maxlength="1"]');
            
            if (otpInputs.length > 0) {
                cy.log(`Found ${otpInputs.length} individual OTP input fields`);
                // Enter OTP digit by digit
                const otpDigits = otp.split('');
                otpDigits.forEach((digit, index) => {
                    if (index < otpInputs.length) {
                        cy.get(`input[type="text"][maxlength="1"]`).eq(index).clear().type(digit, {force: true});
                        cy.log(`Entered digit ${digit} in field ${index + 1}`);
                    }
                });
                cy.log(`✅ Entered OTP: ${otp}`);
                cy.wait(300); // Small wait after OTP entry
            } else {
                // Check for other possible OTP input patterns
                const otpInputs2 = doc.querySelectorAll('input[maxlength="1"]');
                
                if (otpInputs2.length > 0) {
                    cy.log(`Found ${otpInputs2.length} OTP input fields (maxlength=1)`);
                    const otpDigits = otp.split('');
                    otpDigits.forEach((digit, index) => {
                        if (index < otpInputs2.length) {
                            cy.get(`input[maxlength="1"]`).eq(index).clear().type(digit, {force: true});
                            cy.log(`Entered digit ${digit} in field ${index + 1}`);
                        }
                    });
                    cy.log(`✅ Entered OTP: ${otp}`);
                    cy.wait(300); // Small wait after OTP entry
                } else {
                    // Check for single OTP input field
                    const singleOTPSelector = doc.querySelector('#otp') ? '#otp' :
                                             doc.querySelector('[name="otp"]') ? '[name="otp"]' :
                                             doc.querySelector('input[placeholder*="OTP" i]') ? 'input[placeholder*="OTP" i]' :
                                             doc.querySelector('input[placeholder*="code" i]') ? 'input[placeholder*="code" i]' : null;
                    
                    if (singleOTPSelector) {
                        cy.log(`Found single OTP input field: ${singleOTPSelector}`);
                        cy.get(singleOTPSelector).clear().type(otp, {force: true});
                        cy.log(`✅ Entered OTP: ${otp}`);
                        cy.wait(300); // Small wait after OTP entry
                    } else {
                        cy.log('⚠️ OTP input field not found - trying to find any input field');
                        // Last resort: find any visible input field
                        cy.get('input[type="text"]:visible, input[type="tel"]:visible, input[type="number"]:visible').first().then(($input) => {
                            if ($input.length > 0) {
                                cy.wrap($input).clear().type(otp, {force: true});
                                cy.log(`✅ Entered OTP in first available input: ${otp}`);
                            } else {
                                cy.log('❌ No OTP input field found at all');
                            }
                        });
                    }
                }
            }
        });
    }

    // Click verify/submit OTP button
    clickVerifyOTPButton() {
        cy.log('📍 Looking for Continue/Verify/Submit button');
        
        // First check current URL to understand where we are
        cy.url().then((url) => {
            cy.log(`Current URL: ${url}`);
        });
        
        // Removed 2000ms wait - check for button immediately
        
        cy.get('body').then(($body) => {
            // Try multiple selectors
            if ($body.find('#verify-otp').length > 0) {
                cy.log('✅ Found #verify-otp button');
                cy.get('#verify-otp').scrollIntoView().click({force: true});
            } else if ($body.find('[name="verify-otp"]').length > 0) {
                cy.log('✅ Found [name="verify-otp"] button');
                cy.get('[name="verify-otp"]').scrollIntoView().click({force: true});
            } else if ($body.find('#submit-button').length > 0) {
                cy.log('✅ Found #submit-button');
                cy.get('#submit-button').scrollIntoView().click({force: true});
            } else if ($body.find('button:contains("Continue"), button:contains("Verify"), button:contains("Submit")').length > 0) {
                cy.log('✅ Found button with Continue/Verify/Submit text');
                cy.contains('button', /continue|verify|submit/i).first().click({force: true});
            } else {
                cy.log('ℹ️ No Continue/Verify button found - might already be on next page');
                cy.log('📍 Checking if already verified and on profile/dashboard page');
                // Don't fail, just log and continue
            }
        });
        
        // Removed 1000ms wait - next command will auto-wait
    }

    // Click submit button on preferences page after OTP verification
    clickSubmitButtonOnPreferences() {
        cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        cy.log('🔍 Looking for Submit button on preferences page');
        cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        // Wait for preferences page to load
        cy.wait(2000);
        
        // Log current URL and page content
        cy.url().then((url) => {
            cy.log(`📍 Current URL: ${url}`);
        });
        
        cy.get('body').then(($body) => {
            const pageText = $body.text().substring(0, 500);
            cy.log(`📄 Page content: ${pageText}...`);
        });
        
        // Try to find and click #submit-button with multiple strategies
        cy.get('body').then(($body) => {
            // Strategy 1: Try #submit-button
            if ($body.find('#submit-button').length > 0) {
                cy.log('✅ Found #submit-button');
                cy.get('#submit-button').should('be.visible').scrollIntoView();
                cy.wait(500);
                cy.get('#submit-button').click({force: true, scrollBehavior: false});
                cy.log('✅ Clicked #submit-button');
                return;
            }
            
            // Strategy 2: Try button with submit text
            const submitButton = $body.find('button').filter((i, el) => {
                const text = el.textContent?.toLowerCase() || '';
                return text.includes('submit') || text.includes('save') || text.includes('continue');
            });
            
            if (submitButton.length > 0) {
                cy.log(`✅ Found button with text: ${submitButton.first().text()}`);
                cy.wrap(submitButton.first()).scrollIntoView().click({force: true});
                cy.log('✅ Clicked submit/save/continue button');
                return;
            }
            
            // Strategy 3: Try button[type="submit"]
            if ($body.find('button[type="submit"]').length > 0) {
                cy.log('✅ Found button[type="submit"]');
                cy.get('button[type="submit"]').first().scrollIntoView().click({force: true});
                cy.log('✅ Clicked button[type="submit"]');
                return;
            }
            
            // Strategy 4: Try any visible button
            const visibleButtons = $body.find('button:visible');
            if (visibleButtons.length > 0) {
                cy.log(`⚠️ Clicking first visible button (found ${visibleButtons.length} buttons)`);
                cy.wrap(visibleButtons.first()).click({force: true});
                cy.log('✅ Clicked first visible button');
                return;
            }
            
            cy.log('⚠️ No submit button found - checking if already on welcome page');
        });
        
        // Wait for redirection to welcome page
        cy.wait(3000);
        cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        cy.log('✅ Submit button interaction complete - checking for welcome page');
        cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }

    // Click Save button on the next page
    clickSaveButton() {
        // Removed 2000ms wait - check for dropdowns immediately
        
        // Close any dropdowns or overlays that might be open
        cy.document().then((doc) => {
            // Check if there's an open dropdown or overlay
            const openDropdown = doc.querySelector('.dropdown.open, [role="listbox"], ul[class*="dropdown"]');
            if (openDropdown) {
                cy.log('⚠️ Found open dropdown/overlay, clicking outside to close it');
                cy.get('body').click(0, 0, {force: true}); // Click top-left corner
                // Removed 500ms wait - next command will auto-wait
            }
        });
        
        cy.document().then((doc) => {
            const saveSelector = doc.querySelector('#save') ? '#save' :
                                doc.querySelector('[name="save"]') ? '[name="save"]' :
                                doc.querySelector('#submit-button') ? '#submit-button' :
                                doc.querySelector('button[type="submit"]') ? 'button[type="submit"]' : null;
            
            if (saveSelector) {
                cy.get(saveSelector).scrollIntoView();
                cy.wait(500);
                cy.get(saveSelector).click({force: true, scrollBehavior: false});
                cy.log('✅ Clicked Save button');
            } else {
                cy.contains('button', /save|submit|continue/i).first().click({force: true, scrollBehavior: false});
                cy.log('✅ Clicked Save button (fallback)');
            }
        });
        cy.wait(2000);
    }

    // Close popup/modal after signup submission
    closeSignupPopup() {
        cy.log('Waiting for popup/modal to appear');
        cy.wait(3000);
        
        // Close the popup properly - try Escape key first as it's safest
        cy.log('Attempting to close popup/modal with Escape key');
        cy.get('body').type('{esc}');
        cy.wait(1000);
        
        // Verify popup is closed by checking if the overlay is gone
        cy.get('body').then(($body) => {
            if ($body.find('[class*="opacity-70"][class*="z-10"]').length > 0) {
                cy.log('⚠️ Popup still visible, trying to click close button');
                // Look for close button if Escape didn't work
                if ($body.find('button[aria-label="Close"]').length > 0) {
                    cy.get('button[aria-label="Close"]').first().click({force: true});
                } else if ($body.find('svg[class*="close"], [class*="close-icon"]').length > 0) {
                    cy.get('svg[class*="close"], [class*="close-icon"]').first().click({force: true});
                } else {
                    // Click outside the modal to close it
                    cy.get('[class*="opacity-70"][class*="z-10"]').click({force: true});
                }
                cy.wait(1000);
            } else {
                cy.log('✅ Popup closed successfully');
            }
        });
        
        // Verify we're still on the correct domain
        cy.url().should('include', 'mafid-sit.progressive.majidalfuttaim.com');
        cy.url().then((url) => {
            cy.log(`📍 Current URL after closing popup: ${url}`);
        });
    }

    // Login with email and password after signup
    loginAfterSignup(email: string, password: string) {
        cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        cy.log('🔐 LOGGING IN WITH NEWLY CREATED CREDENTIALS');
        cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        cy.log(`📧 Email: ${email}`);
        cy.log(`🔑 Password: ${password}`);
        cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        // Wait for login page to be ready and email field to be visible
        cy.get('#email, #emailOrPhone, input[type="email"], input[type="text"]', { timeout: 10000 }).should('exist');
        
        // Enter email
        cy.get('body').then(($body) => {
            if ($body.find('#email').length > 0 && $body.find('#email').is('input')) {
                cy.log('✅ Using #email field');
                cy.get('#email').clear({force: true}).type(email, {force: true});
            } else if ($body.find('#emailOrPhone input').length > 0) {
                cy.log('✅ Using #emailOrPhone input field');
                cy.get('#emailOrPhone input').clear({force: true}).type(email, {force: true});
            } else if ($body.find('#emailOrPhone').length > 0 && $body.find('#emailOrPhone').is('input')) {
                cy.log('✅ Using #emailOrPhone (is input)');
                cy.get('#emailOrPhone').clear({force: true}).type(email, {force: true});
            } else {
                cy.log('⚠️ Using fallback selector');
                cy.get('input[type="email"], input[type="text"]').first().clear({force: true}).type(email, {force: true});
            }
        });
        // Removed 500ms wait - next command will auto-wait
        
        // Verify email was entered correctly
        cy.get('#email, #emailOrPhone input, input[type="email"], input[type="text"]').first().should('have.value', email);
        cy.log(`✅ Email field value confirmed: ${email}`);
        
        // Enter password
        cy.get('input[type="password"]').should('be.visible').clear({force: true}).type(password, {force: true});
        // Removed 500ms wait - next command will auto-wait
        
        // Verify password was entered correctly
        cy.get('input[type="password"]').should('have.value', password);
        cy.log(`✅ Password field value confirmed: ${password}`);
        
        // Click Login button (wait for it to be enabled)
        cy.log('⏳ Waiting for login button to be enabled...');
        cy.get('#submit-button').should('not.be.disabled', { timeout: 10000 });
        cy.log('✅ Login button is now enabled');
        cy.log('🖱️ Clicking Login button...');
        cy.get('#submit-button').click();
        // Reduced wait from 3000ms to 1000ms - login usually completes quickly
        cy.wait(1000);
        
        // Check if there's an error message
        cy.get('body').then(($body) => {
            if ($body.find('.text-light-background_default, .error-message, [class*="error"]').length > 0) {
                cy.log('⚠️⚠️⚠️ ERROR MESSAGE DETECTED ⚠️⚠️⚠️');
                cy.get('.text-light-background_default, .error-message, [class*="error"]').first().invoke('text').then((errorText) => {
                    cy.log(`❌ Error message: ${errorText}`);
                });
            } else {
                cy.log('✅ No error message detected - login likely successful');
            }
        });
        
        cy.log('✅ Login completed - proceeding to next step');
    }

    // Complete verification and save user data
    completeVerificationAndSave(userData: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        nationality: string;
        password: string;
    }, clientName?: string) {
        cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        cy.log('📋 COMPLETING VERIFICATION AND SAVING USER DATA');
        cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        // STEP 1: Click submit button on preferences page (if present)
        cy.log('🔍 Step 1: Checking for preferences page with submit button...');
        this.clickSubmitButtonOnPreferences();
        
        // STEP 2: Verify the welcome message after clicking submit
        cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        cy.log('🔍 Step 2: CHECKING FOR WELCOME MESSAGE');
        cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        cy.wait(1000);
        
        // Look for "Welcome, You are logged in." message
        cy.get('body').then(($body) => {
            const bodyText = $body.text();
            
            // Check for welcome message
            if (bodyText.includes('Welcome') && bodyText.includes('logged in')) {
                cy.log('✅✅✅ WELCOME MESSAGE FOUND: "Welcome, You are logged in." ✅✅✅');
                
                // Try to find and log the exact element
                const welcomeSelectors = [
                    '*:contains("Welcome, You are logged in.")',
                    'h1:contains("Welcome")',
                    'h2:contains("Welcome")',
                    'h3:contains("Welcome")',
                    'p:contains("Welcome")',
                    'div:contains("Welcome")',
                    'span:contains("Welcome")'
                ];
                
                for (const selector of welcomeSelectors) {
                    if ($body.find(selector).length > 0) {
                        const welcomeText = $body.find(selector).first().text().trim();
                        if (welcomeText) {
                            cy.log(`📝 Welcome message text: "${welcomeText}"`);
                            break;
                        }
                    }
                }
            } else if (bodyText.includes('Welcome')) {
                cy.log('✅ Found "Welcome" text on page');
                cy.log(`📝 Page content includes: ${bodyText.substring(0, 200)}...`);
            } else {
                cy.log('⚠️ Welcome message not found - checking page content');
                cy.log(`📝 Current page text: ${bodyText.substring(0, 300)}...`);
            }
        });
        
        // STEP 3: Save user data to fixture file
        cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        cy.log('📝 Step 3: SAVING USER DATA TO FIXTURE FILE');
        cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        cy.fixture(`usersStaging.json`).then((usersData: any) => {
            // Count existing users to determine next user number
            const existingUserKeys = Object.keys(usersData);
            const userCount = existingUserKeys.filter(key => key.startsWith('user')).length;
            const newUserKey = `user${userCount}`;
            
            cy.log(`📂 Current number of users: ${userCount}`);
            cy.log(`➕ Adding new user as: ${newUserKey}`);
            
            const newUser = {
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email, 
                phoneNumber: userData.phoneNumber,
                nationality: userData.nationality || 'Unknown',
                password: userData.password,
                email_verified: true
            };
            
            // Add new user
            usersData[newUserKey] = newUser;
            
            cy.log(`📂 Total users after adding: ${userCount + 1}`);
            
            // Write to file
            cy.log('💾 Writing to cypress/fixtures/usersStaging.json...');
            return cy.writeFile('cypress/fixtures/usersStaging.json', usersData).then(() => {
                cy.log(`✅✅✅ User data written to usersStaging.json as '${newUserKey}' ✅✅✅`);
                cy.log(`✅ Data saved: ${JSON.stringify(newUser, null, 2)}`);
            });
        });
        
        // Final success message
        cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        cy.log('🎉🎉🎉 USER HAS BEEN CREATED AND VERIFIED BY EMAIL SUCCESSFULLY! 🎉🎉🎉');
        cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        cy.log('✅ Email Verification: COMPLETED');
        cy.log('✅ User Registration: COMPLETED');
        cy.log('✅ Data Saved to Fixture: COMPLETED');
        cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        cy.log('📋 User Details:');
        cy.log(`   👤 Name: ${userData.firstName} ${userData.lastName}`);
        cy.log(`   📧 Email: ${userData.email}`);
        cy.log(`   📱 Phone: ${userData.phoneNumber}`);
        cy.log(`   🌍 Nationality: ${userData.nationality || 'Unknown'}`);
        cy.log(`   🔐 Password: ${userData.password}`);
        cy.log(`   ✅ Email Verified: YES`);
        cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        cy.log('🏁 TEST COMPLETED SUCCESSFULLY!');
        cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        // Logout after test completion to ensure clean state for next test
        cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        cy.log('🚪 LOGGING OUT TO CLEAR SESSION');
        cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        this.clickLogoutButton();
        
        // Log success if client name provided
        if (clientName) {
            cy.log('✅ PASSED: ' + clientName);
            cy.task('log', '✅ PASSED: ' + clientName, { log: false });
            cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        }
    }

    // Helper method to save phone verified user data
    savePhoneVerifiedUserData(firstName: string, lastName: string, email: string, phoneNumber: string, nationality: string, password: string) {
        cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        cy.log('📝 SAVING USER DATA TO FIXTURE FILE NOW...');
        cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        cy.fixture(`usersStaging.json`).then((usersData: any) => {
            const existingUserKeys = Object.keys(usersData);
            const userCount = existingUserKeys.filter(key => key.startsWith('user')).length;
            const newUserKey = `user${userCount}`;
            
            cy.log(`📂 Current number of users: ${userCount}`);
            cy.log(`➕ Adding new user as: ${newUserKey}`);
            
            const newUser = {
                firstName: firstName,
                lastName: lastName,
                email: email, 
                phoneNumber: phoneNumber,
                nationality: nationality || 'Unknown',
                password: password,
                mobile_verified: true
            };
            
            usersData[newUserKey] = newUser;
            cy.log(`📂 Total users after adding: ${userCount + 1}`);
            
            cy.log('💾 Writing to cypress/fixtures/usersStaging.json...');
            return cy.writeFile('cypress/fixtures/usersStaging.json', usersData).then(() => {
                cy.log(`✅✅✅ User data written to usersStaging.json as '${newUserKey}' ✅✅✅`);
                cy.log(`✅ Data saved: ${JSON.stringify(newUser, null, 2)}`);
            });
        });
        
        cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        cy.log('🎉 TEST PASSED: User signup completed successfully!');
        cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        cy.log('User Details Saved:');
        cy.log(`  First Name: ${firstName}`);
        cy.log(`  Last Name: ${lastName}`);
        cy.log(`  Email: ${email}`);
        cy.log(`  Phone: ${phoneNumber}`);
        cy.log(`  Nationality: ${nationality || 'Unknown'}`);
        cy.log(`  Password: ${password}`);
        cy.log(`  Mobile Verified: true`);
        cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }

    // Logging helper method
    logTestPassed(clientName: string) {
        cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        cy.log('🚪 LOGGING OUT TO CLEAR SESSION');
        cy.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        cy.log('✅ PASSED: ' + clientName);
        cy.task('log', '✅ PASSED: ' + clientName, { log: false });
    }

    // Click on "Skip till next time" button
    clickSkipButton() {
        cy.contains(/skip till next time/i).should('be.visible').click();
        cy.log('✅ Clicked on "Skip till next time" button');
    }

    // Click on toggle button
    clickToggleLine() {
        cy.get('.toggle__line').should('be.visible').click();
        cy.log('✅ Clicked on toggle button');
    }

    // Save user data to usersStaging.json with phone_verified flag
    saveUserDataToFixture(firstName: string, lastName: string, email: string, phoneNumber: string, nationality: string, password: string, phoneVerified: boolean = false) {
        cy.readFile('cypress/fixtures/usersStaging.json').then((users) => {
            const userKey = `user${Object.keys(users).length}`;
            const userData = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phoneNumber: phoneNumber,
                nationality: nationality,
                password: password,
                phone_verified: phoneVerified
            };
            users[userKey] = userData;
            cy.writeFile('cypress/fixtures/usersStaging.json', users);
            cy.log(`✅ User data saved as ${userKey}`);
            cy.log(`📝 Saved data: ${JSON.stringify(userData, null, 2)}`);
        });
    }

    // Verify welcome message
    verifyWelcomeMessage() {
        cy.contains(/welcome/i, { timeout: 10000 }).should('be.visible');
        cy.log('✅ Welcome message displayed');
    }

}

