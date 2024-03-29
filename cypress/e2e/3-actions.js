import Decimal from 'decimal.js';

describe('User can create actions via UAC', () => {
  const {
    colony: { name: colonyName },
    baseUrl,
    skipInitTests,
  } = Cypress.config();

  it('Can mint native tokens', () => {
    const amountToMint = 400;
    cy.mintTokens(amountToMint, false);

    cy.getBySel('backButton').click();

    cy.get('@totalFunds').then(($totalFunds) => {
      const totalFunds = new Decimal($totalFunds.split(',').join(''))
        .add(amountToMint)
        .toString();

      cy.getBySel('colonyTotalFunds', { timeout: 15000 }).then(($text) => {
        const text = $text.text().split(',').join('');
        expect(text).to.eq(totalFunds);
      });
    });
  });

  it('Can make payment', () => {
    const amountToPay = 10;
    const paidAmount = new Decimal(amountToPay).add(
      new Decimal(1.0101).div(100).mul(amountToPay),
    );

    cy.makePayment(amountToPay, undefined, false);

    cy.getBySel('backButton').click();

    cy.get('@totalFunds').then(($totalFunds) => {
      const totalFunds = new Decimal($totalFunds.split(',').join(''))
        .sub(paidAmount)
        .toDecimalPlaces(3)
        .toString();

      cy.getBySel('colonyTotalFunds', { timeout: 15000 }).then(($text) => {
        const text = $text.text().split(',').join('');
        expect(text).to.eq(totalFunds);
      });
    });
  });

  it('Can create teams', () => {
    const domainName = 'Cats';
    const domainPurpose = 'Only cats allowed';

    cy.createTeam(domainName, domainPurpose, false);

    cy.getBySel('backButton').click();

    cy.getBySel('colonyDomainSelector', { timeout: 15000 }).click();
    cy.getBySel('domainDropdownItemName')
      .last()
      .should('have.text', domainName);
    cy.getBySel('domainDropdownItemPurpose')
      .last()
      .should('have.text', domainPurpose);
  });

  it('Can edit teams', () => {
    const domainName = 'Dolphins';
    const domainPurpose = 'This team has been taken over by dolphins';

    cy.editTeam(domainName, domainPurpose, false);

    cy.getBySel('backButton').click();

    cy.getBySel('colonyDomainSelector', { timeout: 15000 }).click();
    cy.getBySel('domainDropdownItemName')
      .last()
      .should('have.text', domainName);
    cy.getBySel('domainDropdownItemPurpose')
      .last()
      .should('have.text', domainPurpose);
  });

  it('Can transfer funds', () => {
    const amountToTransfer = 100;

    cy.transferFunds(amountToTransfer, false);

    cy.getBySel('backButton').click();

    cy.getBySel('colonyDomainSelector', { timeout: 15000 }).click();
    cy.getBySel('colonyDomainSelectorItem').last().click();

    cy.get('@teamFunds').then(($teamFunds) => {
      const teamFunds = new Decimal($teamFunds.split(',').join(''))
        .add(amountToTransfer)
        .toString();

      cy.getBySel('colonyFundingNativeTokenValue', { timeout: 15000 }).then(
        ($text) => {
          const text = $text.text().split(',').join('');
          expect(text).to.eq(teamFunds);
        },
      );
    });
  });

  /* needs to only work once */
  if (!skipInitTests) {
    it('Can unlock the native token', () => {
      const colony = { name: 'sirius', nativeToken: 'SIRS' };

      cy.login();
      cy.createColony(colony, true);
      cy.url().should('eq', `${baseUrl}/colony/${colony.name}`, {
        timeout: 90000,
      });

      cy.unlockToken(colony);

      cy.getBySel('backButton').click();

      cy.getBySel('lockIconTooltip', { timeout: 15000 }).should('not.exist');
    });
  }

  it('Can manage permissions', () => {
    cy.managePermissions();
  });

  it('Can award users', () => {
    const amountToAward = 100;
    cy.awardRep(amountToAward, false);
  });

  it('Can smite users', () => {
    const amountToSmite = 10;

    cy.smiteUser(amountToSmite, false);
  });

  it('Can enable recovery mode', () => {
    const storageSlot = '0x05';
    const storageSlotValue =
      '0x0000000000000000000000000000000000000000000000000000000000000002';
    const annotationText = 'We have to recover what we have lost';

    cy.login();
    cy.visit(`/colony/${colonyName}`);

    cy.getBySel('newActionButton', { timeout: 70000 }).click();
    cy.getBySel('advancedDialogIndexItem').click();
    cy.getBySel('recoveryDialogIndexItem').click();

    cy.getBySel('recoveryAnnotation').click().type(annotationText);

    cy.getBySel('recoveryConfirmButton').click();

    cy.getBySel('actionHeading', { timeout: 100000 }).contains(
      'Recovery mode activated by',
    );

    cy.url().should('contains', `${baseUrl}/colony/${colonyName}/tx/0x`);

    cy.getBySel('comment').should('have.text', annotationText);

    cy.getBySel('storageSlotInput').click().type(storageSlot);
    cy.getBySel('storageSlotValueInput').click().type(storageSlotValue);
    cy.getBySel('storageSlotSubmitButton').click();

    cy.getBySel('newSlotValueEvent', { timeout: 40000 }).should(
      'have.text',
      storageSlotValue,
    );

    cy.getBySel('approveExitButton').click();

    cy.getBySel('closeGasStationButton').click();

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.getBySel('reactivateColonyButton', { timeout: 40000 })
      .click()
      .wait(20000)
      .should('not.exist');
  });

  it('Make payment from a subdomain', () => {
    const amountToPay = 10;

    cy.makePayment(amountToPay, undefined, false, true);
  });
});
