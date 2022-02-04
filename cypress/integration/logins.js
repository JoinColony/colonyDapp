describe('Colony dapp landing simple login', () => {
  it('logins to the existing account', () => {
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.visit('/landing')
      .get('.UserNavigation_connectWalletButton_3agv3_Lz')
      .click()
      .get('[data-test="hubOptions"] > :nth-child(2)')
      .click()
      .get('.Button_themePrimary_3aiuKGRF')
      .click()
      /* add proper condition to wait for */
      .wait(3000)
      .get('.UserNavigation_connectWalletButton_3agv3_Lz')
      .should('not.exist');
  });
});

describe('Claim new user name', () => {
  it('logs in new user', () => {
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.visit('/')
      // Click connect wallet button
      .get('.UserNavigation_connectWalletButton_3agv3_Lz')
      .click()
      // select Ganache account
      .get('[data-test="hubOptions"] > :nth-child(2)')
      .click()
      // click on drowpdown with accounts
      .get('.Select_activeOption_1sMcrZHH > span')
      .click()
      // select last account
      /*
        This will work only the first time as the username will be already created.
        Other option to test it confitionally?
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
      .type('user')
      .get('[data-test="claimUsernameConfirm"]')
      .click()
      .wait(4000);

    cy.url().should('be.equal', 'http://localhost:9090/landing');
  });
});
