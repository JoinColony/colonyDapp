import React from 'react';
import { defineMessages } from 'react-intl';

import Button from '~core/Button';
import ColonyActionsDialog from '~dashboard/ColonyActionsDialog';
import ExpendituresDialog from '~dashboard/ExpendituresDialog';
import CreateEditDomainDialog from '~dashboard/CreateEditDomainDialog';
import CreatePaymentDialog from '~dashboard/CreatePaymentDialog';
import ManageDomainsDialog from '~dashboard/ManageDomainsDialog';
import ManageFundsDialog from '~dashboard/ManageFundsDialog';
import TransferFundsDialog from '~dashboard/TransferFundsDialog';
import AdvancedDialog from '~dashboard/AdvancedDialog';
import RecoveryModeDialog from '~dashboard/RecoveryModeDialog';
import TokenMintDialog from '~dashboard/TokenMintDialog';

import { useNaiveBranchingDialogWizard } from '~utils/hooks';
import { Colony } from '~data/index';

const displayName = 'dashboard.ColonyHomeCreateActionsButton';

const MSG = defineMessages({
  newAction: {
    id: 'dashboard.ColonyHomeActions.newAction',
    defaultMessage: 'New Action',
  },
});

interface Props {
  colony: Colony;
}

const ColonyHomeActions = ({ colony }: Props) => {
  const startWizardFlow = useNaiveBranchingDialogWizard([
    {
      component: ColonyActionsDialog,
      props: {
        nextStepExpenditure: 'dashboard.ExpendituresDialog',
        nextStepManageFunds: 'dashboard.ManageFundsDialog',
        nextStepManageDomains: 'dashboard.ManageDomainsDialog',
        nextStepAdvanced: 'dashboard.AdvancedDialog',
      },
    },
    {
      component: ExpendituresDialog,
      props: {
        nextStep: 'dashboard.CreatePaymentDialog',
        prevStep: 'dashboard.ColonyActionsDialog',
        colony,
      },
    },
    {
      component: CreatePaymentDialog,
      props: {
        colony,
        prevStep: 'dashboard.ExpendituresDialog',
      },
    },
    {
      component: ManageFundsDialog,
      props: {
        nextStep: 'dashboard.TransferFundsDialog',
        nextStepMintTokens: 'dashboard.TokenMintDialog',
        prevStep: 'dashboard.ColonyActionsDialog',
        colony,
      },
    },
    {
      component: TransferFundsDialog,
      props: {
        prevStep: 'dashboard.ManageFundsDialog',
        colony,
      },
    },
    {
      component: ManageDomainsDialog,
      props: {
        prevStep: 'dashboard.ColonyActionsDialog',
        nextStep: 'dashboard.CreateEditDomainDialog',
        colony,
      },
    },
    {
      component: CreateEditDomainDialog,
      props: {
        prevStep: 'dashboard.ManageDomainsDialog',
        colony,
      },
    },
    {
      component: AdvancedDialog,
      props: {
        prevStep: 'dashboard.ColonyActionsDialog',
        nextStepRecovery: 'dashboard.RecoveryModeDialog',
        colony,
      },
    },
    {
      component: RecoveryModeDialog,
      props: {
        prevStep: 'dashboard.AdvancedDialog',
        colony,
      },
    },
    {
      component: TokenMintDialog,
      props: {
        prevStep: 'dashboard.ManageFundsDialog',
        colony,
      },
    },
  ]);

  return (
    <Button
      appearance={{ theme: 'primary', size: 'large' }}
      text={MSG.newAction}
      onClick={() => startWizardFlow('dashboard.ColonyActionsDialog')}
    />
  );
};

ColonyHomeActions.displayName = displayName;

export default ColonyHomeActions;
