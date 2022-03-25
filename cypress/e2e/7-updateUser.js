import { invoke } from "lodash";

describe(
  'Colony user can update their settings',
  () => {
    const userSettingsName = 'ColonyFan';
    const userSettingsBio = 'I really like Colony';
    const userSettingsWebsite = 'http://colony.io';
    const userSettingsLocation = 'Earth';
    const profilePicturePath = 'src/img/favicon.png';

    beforeEach(() => {
      cy.login();
    });

    it.only('User can update their own profile fields', () => {
      cy.getBySel('avatarDropdown').click();
      cy.getBySel('userProfileSettings').click();
      // Add all fields and save
      cy.getBySel('userSettingsName', { timeout: 40000 }).click().clear().type(userSettingsName);
      cy.getBySel('userSettingsBio').click().clear().type(userSettingsBio);
      cy.getBySel('userSettingsWebsite').click().clear().type(userSettingsWebsite);
      cy.getBySel('userSettingsLocation').click().clear().type(userSettingsLocation);
      cy.getBySel('userSettingsSubmit').click();

      // Reload the profile page
      cy.reload();
      cy.getBySel('avatarDropdown').click();
      cy.getBySel('userProfileSettings').click();

      // Check all the fields saved
      cy.getBySel('userSettingsName', { timeout: 40000 }).should('have.value', userSettingsName);
      cy.getBySel('userSettingsBio').should('have.value', userSettingsBio);
      cy.getBySel('userSettingsWebsite').should('have.value', userSettingsWebsite);
      cy.getBySel('userSettingsLocation').should('have.value', userSettingsLocation);
    });

    it('User can upload and remove their own profile picture', () => {
      cy.getBySel('avatarDropdown').click();
      cy.getBySel('userProfileSettings').click();
      // Upload the avatar image
      cy.getBySel('avatarUploaderDrop', { timeout: 40000 }).get('input[type="file"]').selectFile(profilePicturePath, { force: true });
      // Remove the avatar image
      cy.getBySel('avatarUploaderRemove', { timeout: 40000 }).click();
    });

    it('User can add token type to their wallet', () => {
      cy.visit(`/colony/${Cypress.config().colony.name}`);
      cy.getBySel('colonyMenuPopover', { timeout: 40000 }).click();
      cy.getBySel('nativeTokenAddress').invoke('attr', 'title').as('colonyTokenAddress');
      cy.getBySel('gasStationPopover').click();
      cy.getBySel('userWallet').click();
      cy.getBySel('editUserTokens').click();
      cy.get('@colonyTokenAddress').then((colonyTokenAddress) => {
        cy.getBySel('tokenSelectorInput').click().clear().type(colonyTokenAddress);
      });
      cy.getBySel('tokenEditSubmit').click();
    });

    it('User can remove token type from their wallet', () => {
      cy.getBySel('gasStationPopover', { timeout: 40000 }).click();
      cy.getBySel('userWallet').click();
      cy.getBySel('editUserTokens').click();
      cy.getBySel('tokenEditItem').eq(1).get('label').get('[type="checkbox"]').uncheck({ force: true });
      cy.getBySel('tokenEditSubmit').click();
    });
  },
);
