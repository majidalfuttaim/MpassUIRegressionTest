// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import 'cypress-mochawesome-reporter/register';

// Handle uncaught exceptions globally
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  // We're ignoring cross-origin errors and other JS errors from the application
  console.log('Caught exception:', err.message);
  return false;
});

export const getFullEnvFolderPath = () => {
    return './cypress/fixtures/' + Cypress.env('fixtureFolder') ;
  }
// Alternatively you can use CommonJS syntax:
// require('./commands')