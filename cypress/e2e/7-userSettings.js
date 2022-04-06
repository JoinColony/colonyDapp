describe('Colony user can update their settings', () => {
  const userSettingsName = 'ColonyFan';
  const userSettingsBio = 'I really like Colony';
  const userSettingsWebsite = 'http://colony.io';
  const userSettingsLocation = 'Earth';
  const profilePicturePath = 'src/img/favicon.png';

  beforeEach(() => {
    cy.login();
  });

  it('User can update their own profile fields', () => {
    cy.getBySel('avatarDropdown', { timeout: 40000 }).click();
    cy.getBySel('userProfileSettings').click();
    // Add all fields and save
    cy.getBySel('userSettingsName', { timeout: 40000 })
      .click()
      .clear()
      .type(userSettingsName);
    cy.getBySel('userSettingsBio').click().clear().type(userSettingsBio);
    cy.getBySel('userSettingsWebsite')
      .click()
      .clear()
      .type(userSettingsWebsite);
    cy.getBySel('userSettingsLocation')
      .click()
      .clear()
      .type(userSettingsLocation);
    cy.getBySel('userSettingsSubmit').click();

    // Reload the profile page
    cy.reload();
    cy.getBySel('avatarDropdown').click();
    cy.getBySel('userProfileSettings').click();

    // Check all the fields saved
    cy.getBySel('userSettingsName', { timeout: 40000 }).should(
      'have.value',
      userSettingsName,
    );
    cy.getBySel('userSettingsBio').should('have.value', userSettingsBio);
    cy.getBySel('userSettingsWebsite').should(
      'have.value',
      userSettingsWebsite,
    );
    cy.getBySel('userSettingsLocation').should(
      'have.value',
      userSettingsLocation,
    );
  });

  it('User can upload and remove their own profile picture', () => {
    cy.getBySel('avatarDropdown').click();
    cy.getBySel('userProfileSettings').click();
    // Upload the avatar image
    cy.getBySel('avatarUploaderDrop', { timeout: 40000 })
      .get('input[type="file"]')
      .selectFile(profilePicturePath, { force: true })
      .then(() => {
        // Remove the avatar image
        cy.getBySel('avatarUploaderRemove', { timeout: 40000 }).click();
      });
  });

  // This requires that the native token is not already added
  it('User can add token type to their wallet', () => {
    cy.visit(`/colony/${Cypress.config().colony.name}`);
    // Get the colony's native token
    cy.getBySel('colonyMenuPopover', { timeout: 40000 }).click();
    cy.getBySel('nativeTokenAddress')
      .invoke('attr', 'title')
      .as('colonyTokenAddress');
    cy.getBySel('gasStationPopover').click();
    cy.getBySel('userWallet').click();
    // Get the number of tokens
    cy.getBySel('userTokenCards')
      .find(`[data-test="tokenCardItem"]`)
      .then((elm) => elm.length)
      .as('tokenCardCount');
    cy.getBySel('editUserTokens').click();
    // Add the new token
    cy.get('@colonyTokenAddress').then((colonyTokenAddress) => {
      cy.getBySel('tokenSelectorInput')
        .click()
        .clear()
        .type(colonyTokenAddress);
    });
    cy.getBySel('tokenEditSubmit').click();
    // Check the number of tokens has increased by one
    cy.get('@tokenCardCount').then((tokenCardCount) => {
      cy.getBySel('userTokenCards')
        .find(`[data-test="tokenCardItem"]`)
        .should('have.length', tokenCardCount + 1);
    });
  });

  it('User can remove token type from their wallet', () => {
    cy.getBySel('gasStationPopover', { timeout: 40000 }).click();
    cy.getBySel('userWallet').click();
    cy.getBySel('userTokenCards')
      .find(`[data-test="tokenCardItem"]`)
      .then((elm) => elm.length)
      .as('tokenCardCount');
    cy.getBySel('editUserTokens').click();
    cy.get('@tokenCardCount').then((tokenCardCount) => {
      cy.getBySel('tokenEditItem')
        .eq(tokenCardCount - 1)
        .find('label')
        .click();
    });
    cy.getBySel('tokenEditSubmit').click();
    cy.get('@tokenCardCount').then((tokenCardCount) => {
      cy.getBySel('userTokenCards')
        .find(`[data-test="tokenCardItem"]`)
        .should('have.length', tokenCardCount - 1);
    });
  });
});
