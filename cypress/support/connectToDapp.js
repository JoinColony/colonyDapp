/*
 * Connect to the dApp
 */
const connectToDapp = before(() => {
  cy.log('Connected to the dApp');
  cy.visit('/connect');
});

export default connectToDapp;
