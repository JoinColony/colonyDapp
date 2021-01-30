import React from 'react';
import { defineMessages } from 'react-intl';
import { ColonyVersion } from '@colony/colony-js';

import Button from '~core/Button';
import ColonyActionsDialog from '~dashboard/ColonyActionsDialog';
import ExpendituresDialog from '~dashboard/ExpendituresDialog';
import CreateDomainDialog from '~dashboard/CreateDomainDialog';
import EditDomainDialog from '~dashboard/EditDomainDialog';
import CreatePaymentDialog from '~dashboard/CreatePaymentDialog';
import ManageDomainsDialog from '~dashboard/ManageDomainsDialog';
import ManageFundsDialog from '~dashboard/ManageFundsDialog';
import TransferFundsDialog from '~dashboard/TransferFundsDialog';
import AdvancedDialog from '~dashboard/AdvancedDialog';
import RecoveryModeDialog from '~dashboard/RecoveryModeDialog';
import TokenMintDialog from '~dashboard/TokenMintDialog';
import NetworkContractUpgradeDialog from '~dashboard/NetworkContractUpgradeDialog';
import EditColonyDetailsDialog from '~dashboard/EditColonyDetailsDialog';
import ColonyTokenManagementDialog from '~dashboard/ColonyTokenManagementDialog';

import { useNaiveBranchingDialogWizard } from '~utils/hooks';
import { Colony, useLoggedInUser } from '~data/index';
import { ALLOWED_NETWORKS } from '~constants';

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
  const { networkId } = useLoggedInUser();

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
        nextStepTransferFunds: 'dashboard.TransferFundsDialog',
        nextStepMintTokens: 'dashboard.TokenMintDialog',
        nextStepManageTokens: 'dashboard.ColonyTokenManagementDialog',
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
        nextStep: 'dashboard.CreateDomainDialog',
        nextStepEdit: 'dashboard.EditDomainDialog',
        colony,
      },
    },
    {
      component: CreateDomainDialog,
      props: {
        prevStep: 'dashboard.ManageDomainsDialog',
        colony,
      },
    },
    {
      component: EditDomainDialog,
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
        nextStepEditDetails: 'dashboard.EditColonyDetailsDialog',
        nextStepVersionUpgrade: 'dashboard.NetworkContractUpgradeDialog',
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
      component: NetworkContractUpgradeDialog,
      props: {
        prevStep: 'dashboard.AdvancedDialog',
        colony,
      },
    },
    {
      component: EditColonyDetailsDialog,
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
    {
      component: ColonyTokenManagementDialog,
      props: {
        prevStep: 'dashboard.ManageFundsDialog',
        colony,
      },
    },
  ]);

  const isSupportedColonyVersion =
    parseInt(colony.version, 10) >= ColonyVersion.CeruleanLightweightSpaceship;
  const isNetworkAllowed = !!ALLOWED_NETWORKS[networkId || 1];

  return (
    <Button
      appearance={{ theme: 'primary', size: 'large' }}
      text={MSG.newAction}
      onClick={() => startWizardFlow('dashboard.ColonyActionsDialog')}
      disabled={!isSupportedColonyVersion || !isNetworkAllowed}
    />
  );
};

export default ColonyHomeActions;

ColonyHomeActions.displayName = displayName;
