import { buildUser } from '../support/generate';

describe.skip('Colony dapp landing simple login', () => {
  it('logins the existing account', () => {
    cy.login()
      .get('.UserNavigation_connectWalletButton_3agv3_Lz')
      .should('not.exist')
      .assertHome();
  });
});

describe('Claim new user name', () => {
  if (!Cypress.config().skipInitTests) {
    it('logs in new user', { defaultCommandTimeout: 8000 }, () => {
      const user = buildUser();

      cy.visit('/')
        .contains(/connect wallet/i)
        .click();

      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.contains(/ganache/i)
        .click()
        // click on drowpdown with accounts
        .get('.Select_activeOption_1sMcrZHH > span')
        .click()
        // select last account
        /*
        This will work only the first time as the username will be already created.
        Other option to test it conditionally?
      */
        .get('#privateKey-listbox-entry-4 > .SelectOption_value_1zTMGGfo')
        .click()
        // click continue
        .get('.Button_themePrimary_3aiuKGRF')
        .click()
        // click on Avatar
        .get('.Avatar_image_2L3ZJ-0y')
        .click()
        // click get started to be redirected to claim username page
        .get(':nth-child(1) > .DropdownMenuItem_main_1knFOdsz > a')
        .click()
        .get('.Input_container_17sAGJ_F')
        .click()
        .type(user.username)
        .get('[data-test="claimUsernameConfirm"]')
        .click()
        .wait(4000);

      cy.url().should('be.equal', 'http://localhost:9090/landing');
    });
  }
});
