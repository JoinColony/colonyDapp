// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { Extension } from '@colony/colony-js';
import Decimal from 'decimal.js';

import { splitAddress } from '~utils/strings';

import { buildUser } from './generate';

Cypress.Commands.add('login', () => {
  cy.visit('/landing');
  cy.findByText(/connect wallet/i).click();
  cy.contains(/ganache/i).click();
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.findByText(/continue/i)
    .click()
    .wait(3000);
});

Cypress.Commands.add('assertHome', () => {
  cy.url().should('eq', `${Cypress.config().baseUrl}/landing`);
});

Cypress.Commands.add('getBySel', (selector, ...args) => {
  return cy.get(`[data-test=${selector}]`, ...args);
});

Cypress.Commands.add('stakeMax', (buttonSlector) => {
  const currentValue = 0;
  const targetValue = 100;
  const increment = 1;
  const steps = (targetValue - currentValue) / increment;
  const arrows = '{rightarrow}'.repeat(steps);

  cy.get('.rc-slider-handle')
    .last()
    .should('have.attr', 'aria-valuenow', currentValue)
    .type(arrows);

  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.getBySel(buttonSlector).click().wait(10000);
});

Cypress.Commands.add('claimNewUserName', (numberFromList) => {
  const user = buildUser();

  cy.visit('/')
    .contains(/connect wallet/i)
    .click();

  cy.contains(/ganache/i)
    .click()
    // click on drowpdown with accounts
    .getBySel('ganacheAccountSelect')
    .click()
    /*
      This will once for each address from the dropdown as the username will be already created.
    */
    .get(
      `#privateKey-listbox-entry-${numberFromList} > .SelectOption_value_1zTMGGfo`,
    )
    .click();
  // click continue
  cy.findByText(/continue/i).click();
  // click on Avatar
  cy.getBySel('avatar').click();
  // click get started to be redirected to claim username page
  cy.findByText(/get started/i).click();

  // I don't think it's worth to add selector to the Input component as it is used multiple times on the page
  cy.get('input').click().type(user.username);

  cy.findByText(/continue/i).click();
});

Cypress.Commands.add('createColony', (colony, useNewToken) => {
  cy.visit('/landing');
  cy.getBySel('createColony').click();

  cy.get('input').first().click().type(colony.name);
  cy.get('input').last().click().type(colony.name);
  cy.getBySel('claimColonyNameConfirm').click();

  cy.getBySel(useNewToken ? 'createNewToken' : 'useExistingToken').click();

  if (useNewToken) {
    cy.get('input').first().click().type(colony.nativeToken);
    cy.get('input').last().click().type(colony.nativeToken);
  } else {
    cy.get('@existingTokenAddress').then((address) => {
      cy.get('input').click().type(address);
    });
  }

  cy.getBySel('definedTokenConfirm').click();

  cy.getBySel('userInputConfirm').click();
});

Cypress.Commands.add('getColonyTokenAddress', (colonyName) => {
  cy.visit(`/colony/${colonyName}`);
  cy.getBySel('colonyMenu', { timeout: 60000 }).click();
  cy.getBySel('nativeTokenAddress').invoke('text').as('existingTokenAddress');
});

Cypress.Commands.add('checkUrlAfterAction', (colonyName) => {
  cy.url().should(
    'contains',
    `${Cypress.config().baseUrl}/colony/${colonyName}/tx/0x`,
    { timeout: 30000 },
  );
});

Cypress.Commands.add('checkColonyName', (colonyName) => {
  cy.getBySel('colonyTitle', { timeout: 60000 }).then((name) => {
    expect(name.text()).to.equal(colonyName);
  });
});

Cypress.Commands.add('changeColonyname', (colonyName, newName) => {
  cy.getBySel('newActionButton', { timeout: 60000 }).click();
  cy.getBySel('advancedDialogIndexItem').click();
  cy.getBySel('updateColonyDialogIndexItem').click();
  cy.get('input').last().click().clear().type(newName);
});

Cypress.Commands.add('checkMotion', () => {
  cy.getBySel('stakeRequiredBanner').should('exist');
  cy.getBySel('motionStatusTag').should('have.text', 'Staking');
  cy.getBySel('stakingWidget').should('exist');
  cy.getBySel('countDownTimer').should('include.text', 'Time left to stake');
  cy.getBySel('actionsEventText').should('include.text', 'created a Motion');
});

Cypress.Commands.add('installExtension', () => {
  cy.getBySel('installExtensionButton').click();
  cy.getBySel('disabledStatusTag', { timeout: 30000 }).should('exist');
});

Cypress.Commands.add('enableExtension', (extensionId) => {
  cy.getBySel('closeGasStationButton').click();
  cy.getBySel('enableExtensionButton').click();
  if (extensionId === Extension.Whitelist) {
    cy.getBySel('policySelector').eq(1).click({ force: true });
  }
  cy.getBySel('setupExtensionConfirmButton').click();
  cy.getBySel('enabledStatusTag', { timeout: 30000 }).should('exist');
});

Cypress.Commands.add('deprecateExtension', () => {
  cy.getBySel('deprecateExtensionButton').click();
  cy.getBySel('confirmButton').click();
  cy.getBySel('deprecatedStatusTag', { timeout: 30000 }).should('exist');
});

Cypress.Commands.add('uninstallExtension', () => {
  cy.getBySel('deprecateExtensionButton').click();
  cy.getBySel('confirmButton').click();
  cy.getBySel('uninstallExtensionButton', { timeout: 20000 }).click();
  cy.getBySel('uninstallWarningInput').click().type('I UNDERSTAND');
  cy.getBySel('uninstallConfirmButton').click();
  cy.getBySel('notInstalledStatusTag', { timeout: 30000 }).should('exist');
});

Cypress.Commands.add('mintTokens', (amountToMint, isMotion) => {
  const annotationText = isMotion
    ? 'Test motion annotation'
    : 'Test annotation';

  cy.login();

  cy.visit(`/colony/${Cypress.config().colony.name}`);

  cy.getBySel('colonyTotalFunds', { timeout: 60000 })
    .invoke('text')
    .as('totalFunds');

  cy.getBySel('newActionButton', { timeout: 90000 }).click();
  cy.getBySel('fundsDialogIndexItem').click();
  cy.getBySel('mintTokensDialogItem').click();

  cy.get('input').last().click().type(amountToMint);

  if (isMotion !== undefined) {
    cy.get('textarea').click().type(annotationText);
  }

  cy.getBySel('mintConfirmButton').click();

  cy.getBySel('actionHeading', { timeout: 60000 }).should(
    'have.text',
    `Mint ${amountToMint} ${Cypress.config().colony.nativeToken}`,
  );

  if (isMotion !== undefined) {
    cy.getBySel('comment').should('have.text', annotationText);
  }

  cy.url().should(
    'contains',
    `${Cypress.config().baseUrl}/colony/${Cypress.config().colony.name}/tx/0x`,
  );
});

Cypress.Commands.add(
  'makePayment',
  (amountToPay, address, isMotion, isSubdomain) => {
    const annotationText = isMotion
      ? 'Test motion annotation'
      : 'Test annotation';

    const cutAddress = splitAddress(address);
    const paidAmount = isMotion
      ? amountToPay
      : new Decimal(amountToPay).sub(
          new Decimal(1.0001).div(100).mul(amountToPay),
        );

    cy.login();

    cy.visit(`/colony/${Cypress.config().colony.name}`);

    cy.getBySel('colonyTotalFunds', { timeout: 60000 })
      .invoke('text')
      .as('totalFunds');

    cy.getBySel('newActionButton', { timeout: 60000 }).click();
    cy.getBySel('expenditureDialogIndexItem').click();
    cy.getBySel('paymentDialogIndexItem').click();

    if (isSubdomain) {
      cy.getBySel('domainIdSelector').click();
      cy.getBySel('domainIdItem').last().click();
    }

    cy.getBySel('paymentRecipientPicker').click().type(address);
    cy.getBySel('paymentRecipientItem').first().click();

    cy.getBySel('paymentAmountInput').click().type(amountToPay);

    cy.getBySel('paymentAnnotation').click().type(annotationText);
    cy.getBySel('paymentConfirmButton').click();

    cy.getBySel('actionHeading', { timeout: 80000 }).should(
      'have.text',
      `Pay ${cutAddress.header}${cutAddress.start}...${
        cutAddress.end
      } ${paidAmount.toString()} ${Cypress.config().colony.nativeToken}`,
    );
    cy.getBySel('comment').should('have.text', annotationText);

    cy.url().should(
      'contains',
      `${Cypress.config().baseUrl}/colony/${
        Cypress.config().colony.name
      }/tx/0x`,
    );
  },
);

Cypress.Commands.add('createTeam', (domainName, domainPurpose, isMotion) => {
  const annotationText = isMotion
    ? 'Test motion annotation'
    : 'Test annotation';

  cy.login();

  cy.visit(`/colony/${Cypress.config().colony.name}`);

  cy.getBySel('newActionButton', { timeout: 60000 }).click();
  cy.getBySel('domainsDialogIndexItem').click();
  cy.getBySel('createDomainDialogIndexItem').click();

  cy.getBySel('domainNameInput').click().type(domainName);
  cy.getBySel('domainPurposeInput').click().type(domainPurpose);
  cy.getBySel('createDomainAnnotation').click().type(annotationText);

  cy.getBySel('createDomainConfirmButton').click();

  cy.getBySel('actionHeading', { timeout: 70000 }).should(
    'have.text',
    `New team: ${domainName}`,
  );

  cy.url().should(
    'contains',
    `${Cypress.config().baseUrl}/colony/${Cypress.config().colony.name}/tx/0x`,
  );

  cy.getBySel('comment').should('have.text', annotationText);
});

Cypress.Commands.add('editTeam', (domainName, domainPurpose, isMotion) => {
  const annotationText = isMotion
    ? 'Test motion annotation'
    : 'Test annotation';

  cy.login();

  cy.visit(`/colony/${Cypress.config().colony.name}`);

  cy.getBySel('newActionButton', { timeout: 90000 }).click();
  cy.getBySel('domainsDialogIndexItem').click();
  cy.getBySel('editDomainDialogIndexItem').click();

  cy.getBySel('domainIdSelector').click();
  cy.getBySel('domainIdItem').last().click();
  cy.getBySel('domainNameInput').invoke('val').as('domaniName');

  cy.getBySel('domainNameInput').clear();
  cy.getBySel('domainNameInput').click().type(domainName);
  cy.getBySel('domainPurposeInput').clear();
  cy.getBySel('domainPurposeInput').click().type(domainPurpose);
  cy.getBySel('editDomainAnnotation').click().type(annotationText);

  cy.getBySel('editDomainConfirmButton').click();

  cy.get('@domaniName').then((oldName) => {
    cy.getBySel('actionHeading', { timeout: 100000 }).should(
      'have.text',
      isMotion
        ? `Edit ${oldName} team details`
        : `${domainName} team details edited`,
    );
  });

  cy.url().should(
    'contains',
    `${Cypress.config().baseUrl}/colony/${Cypress.config().colony.name}/tx/0x`,
  );

  cy.getBySel('comment').should('have.text', annotationText);
});

Cypress.Commands.add('transferFunds', (amountToTransfer, isMotion) => {
  const annotationText = isMotion
    ? 'Test motion annotation'
    : 'Test annotation';

  cy.login();

  cy.visit(`/colony/${Cypress.config().colony.name}`);

  cy.getBySel('colonyDomainSelector', { timeout: 60000 }).click();
  cy.getBySel('colonyDomainSelectorItem').last().click();

  cy.getBySel('colonyFundingNativeTokenValue', { timeout: 60000 })
    .invoke('text')
    .as('teamFunds');

  cy.getBySel('newActionButton', { timeout: 60000 }).click();
  cy.getBySel('fundsDialogIndexItem').click();
  cy.getBySel('transferFundsDialogIndexItem').click();

  cy.getBySel('domainIdSelector').first().click();
  cy.getBySel('domainIdItem').first().click();

  cy.getBySel('domainIdSelector').last().click();
  cy.getBySel('domainIdItem').last().click();

  cy.getBySel('transferAmountInput').click().type(amountToTransfer);

  cy.getBySel('transferFundsAnnotation').click().type(annotationText);

  cy.getBySel('transferFundsConfirmButton').click();

  cy.getBySel('actionHeading', { timeout: 100000 }).should(
    'include.text',
    `Move ${amountToTransfer} ${
      Cypress.config().colony.nativeToken
    } from Root to `,
  );

  cy.url().should(
    'contains',
    `${Cypress.config().baseUrl}/colony/${Cypress.config().colony.name}/tx/0x`,
  );

  cy.getBySel('comment').should('have.text', annotationText);
});

Cypress.Commands.add('awardRep', (amountToAward, isMotion) => {
  const annotationText = isMotion
    ? 'Test motion annotation'
    : 'Test annotation';

  let rewardedUser;

  cy.login();

  cy.visit(`/colony/${Cypress.config().colony.name}`);

  cy.getBySel('newActionButton', { timeout: 90000 }).click();
  cy.getBySel('reputationDialogIndexItem').click();
  cy.getBySel('awardReputationDialogIndexItem').click();

  cy.getBySel('reputationRecipientSelector').click({ force: true });
  cy.getBySel('reputationRecipientSelectorItem').last().click();

  cy.getBySel('reputationRecipientName').invoke('val').as('userName');
  cy.getBySel('reputationRecipientName').then(($value) => {
    rewardedUser = $value.text();
  });
  cy.getBySel('reputationAmountInput').click().type(amountToAward);

  cy.getBySel('reputationAnnotation').click().type(annotationText);

  cy.getBySel('reputationConfirmButton').click();

  cy.getBySel('actionHeading', { timeout: 100000 }).then(($value) => {
    expect($value.text()).to.eq(
      `Award ${rewardedUser} with a ${amountToAward} pts reputation reward`,
    );
  });

  cy.url().should(
    'contains',
    `${Cypress.config().baseUrl}/colony/${Cypress.config().colony.name}/tx/0x`,
  );

  cy.getBySel('comment').should('have.text', annotationText);
});

Cypress.Commands.add('smiteUser', (amountToSmite, isMotion) => {
  const annotationText = isMotion
    ? 'Test motion annotation'
    : 'Test annotation';

  let smoteUser;

  cy.login();

  cy.visit(`/colony/${Cypress.config().colony.name}`);

  cy.getBySel('newActionButton', { timeout: 90000 }).click();
  cy.getBySel('reputationDialogIndexItem').click();
  cy.getBySel('smiteReputationDialogIndexItem').click();

  cy.getBySel('reputationRecipientSelector').click({ force: true });
  cy.getBySel('reputationRecipientSelectorItem').last().click();
  cy.getBySel('reputationRecipientName').then(($value) => {
    smoteUser = $value.text();
  });
  cy.getBySel('reputationAmountInput').click().type(amountToSmite);

  cy.getBySel('reputationAnnotation').click().type(annotationText);

  cy.getBySel('reputationConfirmButton').click();

  cy.getBySel('actionHeading', { timeout: 100000 }).then(($value) => {
    expect($value.text()).to.eq(
      `Smite ${smoteUser} with a ${amountToSmite} pts reputation penalty`,
    );
  });

  cy.url().should(
    'contains',
    `${Cypress.config().baseUrl}/colony/${Cypress.config().colony.name}/tx/0x`,
  );

  cy.getBySel('comment').should('have.text', annotationText);
});

Cypress.Commands.add('editColonyDetails', (newName, isMotion) => {
  const annotationText = isMotion
    ? 'Test motion annotation'
    : 'Test annotation';
  const colonyName = Cypress.config().colony.name;

  cy.login();
  cy.visit(`/colony/${colonyName}`);
  cy.changeColonyname(colonyName, newName);

  const filePath = 'cypress/fixtures/images/jaya-the-beast.png';
  cy.get('input[type="file"]').selectFile(filePath, { force: true });

  cy.get('textarea').click().type(annotationText);
  cy.getBySel('confirmButton').click();

  cy.getBySel('actionHeading', { timeout: 60000 }).should(
    'have.text',
    isMotion ? 'Change colony details' : 'Colony details changed',
  );
  cy.checkUrlAfterAction(colonyName);
});

Cypress.Commands.add(
  'updateTokens',
  (updatedColonyName, tokenProviderColonyName, isMotion) => {
    cy.getColonyTokenAddress(tokenProviderColonyName);

    cy.visit(`/colony/${updatedColonyName}`);

    cy.getBySel('newActionButton', { timeout: 90000 }).click();
    cy.getBySel('fundsDialogIndexItem').click();
    cy.getBySel('manageTokensDialogItem').click();

    cy.get('@existingTokenAddress').then((address) => {
      cy.get('input').last().click().type(address);
    });
    cy.getBySel('confirm').click();

    cy.getBySel('actionHeading', { timeout: 60000 }).should(
      'have.text',
      isMotion ? 'Change colony details' : `Colony details changed`,
    );

    cy.checkUrlAfterAction(updatedColonyName);
  },
);

Cypress.Commands.add('unlockToken', (colony) => {
  cy.getBySel('newActionButton', { timeout: 60000 }).click();
  cy.getBySel('fundsDialogIndexItem').click();
  cy.getBySel('unlockTokenDialogIndexItem').click();

  cy.getBySel('unlockTokenConfirmButton').click();

  cy.getBySel('actionHeading', { timeout: 100000 }).should(
    'include.text',
    `Unlock native token ${colony.nativeToken}`,
  );

  cy.url().should(
    'contains',
    `${Cypress.config().baseUrl}/colony/${colony.name}/tx/0x`,
  );
});

Cypress.Commands.add('managePermissions', (colonyName, isMotion) => {
  const annotationText = 'I am giving you the power to do things';

  cy.login();

  cy.visit(`/colony/${colonyName}`);

  cy.getBySel('newActionButton', { timeout: 60000 }).click();
  cy.getBySel('advancedDialogIndexItem').click();
  cy.getBySel('managePermissionsDialogIndexItem').click();

  if (!isMotion) {
    cy.getBySel('permissionUserSelector').click({ force: true });
    cy.getBySel('permissionUserSelectorItem').last().click();
  }
  cy.getBySel('permission').eq(1).click({ force: true });
  cy.getBySel('permission').eq(2).click({ force: true });
  cy.getBySel('permission').eq(3).click({ force: true });
  cy.getBySel('permissionAnnotation').click().type(annotationText);

  cy.getBySel('permissionConfirmButton').click();

  cy.getBySel('actionHeading', { timeout: 100000 }).contains(
    isMotion
      ? 'Remove the administration, architecture, funding permissions'
      : `Assign the administration, funding, architecture permissions in Root to`,
  );

  cy.url().should(
    'contains',
    `${Cypress.config().baseUrl}/colony/${Cypress.config().colony.name}/tx/0x`,
  );

  cy.getBySel('comment').should('have.text', annotationText);
});
