describe('Colony can mint tokens via aciton', () => {
  it('mint native tokens', () => {
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.visit('/colony/a')
      .wait('.UserNavigation_connectWalletButton_3agv3_Lz')
      .get('.UserNavigation_connectWalletButton_3agv3_Lz')
      .click()
      .get('[data-test="hubOptions"] > :nth-child(2)')
      .click()
      .get('.Button_themePrimary_3aiuKGRF')
      .click()
      /* add proper condition to wait for */
      .wait(3000)
      .get('.Button_themePrimary_3aiuKGRF')
      .click()
      /* add proper condition to wait for */
      .wait(3000);
    // .should('not.exist');
  });
});
