import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import { Extension } from '@colony/colony-js';
import { useSelector } from 'react-redux';

import Button from '~core/Button';
import { SpinnerLoader } from '~core/Preloaders';
import ColonyActionsDialog from '~dialogs/ColonyActionsDialog';
import ExpendituresDialog from '~dialogs/ExpendituresDialog';
import CreateDomainDialog from '~dialogs/CreateDomainDialog';
import EditDomainDialog from '~dialogs/EditDomainDialog';
import CreatePaymentDialog from '~dialogs/CreatePaymentDialog';
import ManageDomainsDialog from '~dialogs/ManageDomainsDialog';
import ManageFundsDialog from '~dialogs/ManageFundsDialog';
import UnlockTokenDialog from '~dialogs/UnlockTokenDialog';
import TransferFundsDialog from '~dialogs/TransferFundsDialog';
import AdvancedDialog from '~dialogs/AdvancedDialog';
import PermissionManagementDialog from '~dialogs/PermissionManagementDialog';
import RecoveryModeDialog from '~dialogs/RecoveryModeDialog';
import TokenMintDialog from '~dialogs/TokenMintDialog';
import NetworkContractUpgradeDialog from '~dialogs/NetworkContractUpgradeDialog';
import EditColonyDetailsDialog from '~dialogs/EditColonyDetailsDialog';
import ManageReputationDialog from '~dialogs/ManageReputationDialog';
import ColonyTokenManagementDialog from '~dialogs/ColonyTokenManagementDialog';
import { SmiteDialog, AwardDialog } from '~dialogs/AwardAndSmiteDialogs';
import ManageGnosisSafeDialog from '~dialogs/ManageGnosisSafeDialog';
import GnosisControlSafeDialog from '~dialogs/GnosisControlSafeDialog';
import RemoveSafeDialog from '~dialogs/RemoveSafeDialog';
import AddExistingSafeDialog from '~dialogs/AddExistingSafeDialog';

import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';

import { useNaiveBranchingDialogWizard } from '~utils/hooks';
import {
  Colony,
  useLoggedInUser,
  useNetworkContracts,
  useColonyExtensionsQuery,
} from '~data/index';
import { checkIfNetworkIsAllowed } from '~utils/networks';
import {
  colonyMustBeUpgraded,
  oneTxMustBeUpgraded,
} from '~modules/dashboard/checks';

const displayName = 'dashboard.ColonyHomeCreateActionsButton';

const MSG = defineMessages({
  newAction: {
    id: 'dashboard.ColonyHomeActions.newAction',
    defaultMessage: 'New Action',
  },
});

interface Props {
  colony: Colony;
  ethDomainId?: number;
}

interface RootState {
  users: {
    wallet: {
      isUserConnected: boolean;
    };
  };
}

const ColonyHomeActions = ({ colony, ethDomainId }: Props) => {
  const { networkId, username, ethereal } = useLoggedInUser();
  const { version: networkVersion } = useNetworkContracts();

  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(!ethereal);

  const {
    isVotingExtensionEnabled,
    isLoadingExtensions,
  } = useEnabledExtensions({
    colonyAddress: colony.colonyAddress,
  });

  const { data } = useColonyExtensionsQuery({
    variables: { address: colony.colonyAddress },
  });

  useSelector((state: RootState) => {
    const { isUserConnected } = state.users.wallet;
    if (!ethereal && isUserConnected && isLoadingUser) {
      setIsLoadingUser(false);
    } else if (ethereal && isUserConnected && !isLoadingUser) {
      setIsLoadingUser(true);
    }
  });

  const startWizardFlow = useNaiveBranchingDialogWizard([
    {
      component: ColonyActionsDialog,
      props: {
        nextStepExpenditure: 'dashboard.ExpendituresDialog',
        nextStepManageFunds: 'dashboard.ManageFundsDialog',
        nextStepManageDomains: 'dashboard.ManageDomainsDialog',
        nextStepAdvanced: 'dashboard.AdvancedDialog',
        nextStepManageReputation: 'dashboard.ManageReputationDialog',
      },
    },
    {
      component: ExpendituresDialog,
      props: {
        nextStep: 'dashboard.CreatePaymentDialog',
        prevStep: 'dashboard.ColonyActionsDialog',
        colony,
        isVotingExtensionEnabled,
      },
    },
    {
      component: CreatePaymentDialog,
      props: {
        colony,
        prevStep: 'dashboard.ExpendituresDialog',
        isVotingExtensionEnabled,
        ethDomainId,
      },
    },
    {
      component: ManageFundsDialog,
      props: {
        nextStepTransferFunds: 'dashboard.TransferFundsDialog',
        nextStepMintTokens: 'dashboard.TokenMintDialog',
        nextStepManageTokens: 'dashboard.ColonyTokenManagementDialog',
        nextStepUnlockToken: 'dashboard.UnlockTokenDialog',
        prevStep: 'dashboard.ColonyActionsDialog',
        colony,
        isVotingExtensionEnabled,
      },
    },
    {
      component: TransferFundsDialog,
      props: {
        prevStep: 'dashboard.ManageFundsDialog',
        colony,
        isVotingExtensionEnabled,
        ethDomainId,
      },
    },
    {
      component: UnlockTokenDialog,
      props: {
        prevStep: 'dashboard.ManageFundsDialog',
        colony,
        isVotingExtensionEnabled,
      },
    },
    {
      component: ManageDomainsDialog,
      props: {
        prevStep: 'dashboard.ColonyActionsDialog',
        nextStep: 'dashboard.CreateDomainDialog',
        nextStepEdit: 'dashboard.EditDomainDialog',
        colony,
        isVotingExtensionEnabled,
      },
    },
    {
      component: CreateDomainDialog,
      props: {
        prevStep: 'dashboard.ManageDomainsDialog',
        colony,
        isVotingExtensionEnabled,
      },
    },
    {
      component: EditDomainDialog,
      props: {
        prevStep: 'dashboard.ManageDomainsDialog',
        colony,
        isVotingExtensionEnabled,
        ethDomainId,
      },
    },
    {
      component: ManageReputationDialog,
      props: {
        nextStepAwardReputation: 'dashboard.AwardDialog',
        nextStepSmiteReputation: 'dashboard.SmiteDialog',
        prevStep: 'dashboard.ColonyActionsDialog',
        colony,
        isVotingExtensionEnabled,
      },
    },
    {
      component: AwardDialog,
      props: {
        prevStep: 'dashboard.ManageReputationDialog',
        colony,
        isVotingExtensionEnabled,
        ethDomainId,
      },
    },
    {
      component: SmiteDialog,
      props: {
        prevStep: 'dashboard.ManageReputationDialog',
        colony,
        isVotingExtensionEnabled,
        ethDomainId,
      },
    },
    {
      component: AdvancedDialog,
      props: {
        prevStep: 'dashboard.ColonyActionsDialog',
        nextStepPermissionManagement: 'dashboard.PermissionManagementDialog',
        nextStepRecovery: 'dashboard.RecoveryModeDialog',
        nextStepEditDetails: 'dashboard.EditColonyDetailsDialog',
        nextStepVersionUpgrade: 'dashboard.NetworkContractUpgradeDialog',
        nextStepManageGnosisSafe: 'dashboard.ManageGnosisSafeDialog',
        colony,
        isVotingExtensionEnabled,
      },
    },

    {
      component: ManageGnosisSafeDialog,
      props: {
        nextStepAddExistingSafe: 'dashboard.AddExistingSafeDialog',
        nextStepRemoveSafe: 'dashboard.RemoveSafeDialog',
        nextStepControlSafe: 'dashboard.GnosisControlSafeDialog',
        prevStep: 'dashboard.AdvancedDialog',
        colony,
      },
    },
    // @todo - ready to be implemented in another PR.
    {
      component: AddExistingSafeDialog,
      props: {
        prevStep: 'dashboard.ManageGnosisSafeDialog',
        colony,
      },
    },
    // {
    //   component: RemoveSafeDialog,
    //   props: {
    //     prevStep: 'dashboard.RemoveSafeDialog',
    //     colony,
    //     isVotingExtensionEnabled,
    //     ethDomainId,
    //   },
    // },
    {
      component: GnosisControlSafeDialog,
      props: {
        prevStep: 'dashboard.ManageGnosisSafeDialog',
        colony,
        isVotingExtensionEnabled,
      },
    },
    {
      component: RemoveSafeDialog,
      props: {
        prevStep: 'dashboard.ManageGnosisSafeDialog',
        colony,
      },
    },
    // {
    //   component: ControlSafeDialog,
    //   props: {
    //     prevStep: 'dashboard.ManageGnosisSafeDialog',
    //     colony,
    //     isVotingExtensionEnabled,
    //     ethDomainId,
    //   },
    // },

    {
      component: PermissionManagementDialog,
      props: {
        prevStep: 'dashboard.AdvancedDialog',
        colony,
        isVotingExtensionEnabled,
        ethDomainId,
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
        isVotingExtensionEnabled,
      },
    },
    {
      component: EditColonyDetailsDialog,
      props: {
        prevStep: 'dashboard.AdvancedDialog',
        colony,
        isVotingExtensionEnabled,
      },
    },
    {
      component: TokenMintDialog,
      props: {
        prevStep: 'dashboard.ManageFundsDialog',
        colony,
        isVotingExtensionEnabled,
      },
    },
    {
      component: ColonyTokenManagementDialog,
      props: {
        prevStep: 'dashboard.ManageFundsDialog',
        colony,
        isVotingExtensionEnabled,
      },
    },
  ]);

  const oneTxPaymentExtension = data?.processedColony?.installedExtensions.find(
    ({ details, extensionId: extensionName }) =>
      details?.initialized &&
      !details?.missingPermissions.length &&
      extensionName === Extension.OneTxPayment,
  );
  const mustUpgradeOneTx = oneTxMustBeUpgraded(oneTxPaymentExtension);
  const hasRegisteredProfile = !!username && !ethereal;
  const isNetworkAllowed = checkIfNetworkIsAllowed(networkId);
  const mustUpgrade = colonyMustBeUpgraded(colony, networkVersion as string);
  const isLoadingData = isLoadingExtensions || isLoadingUser;

  return (
    <>
      {isLoadingData && <SpinnerLoader appearance={{ size: 'medium' }} />}
      {!isLoadingData && (
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          text={MSG.newAction}
          onClick={() => startWizardFlow('dashboard.ColonyActionsDialog')}
          disabled={
            mustUpgrade ||
            !isNetworkAllowed ||
            !hasRegisteredProfile ||
            !colony?.isDeploymentFinished ||
            mustUpgradeOneTx
          }
          data-test="newActionButton"
        />
      )}
    </>
  );
};

export default ColonyHomeActions;

ColonyHomeActions.displayName = displayName;
