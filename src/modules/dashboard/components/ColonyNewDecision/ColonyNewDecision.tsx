import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import { useSelector } from 'react-redux';

import Button from '~core/Button';
import { useDialog } from '~core/Dialog';
import DecisionDialog from '~dashboard/Dialogs/DecisionDialog';
import { SpinnerLoader } from '~core/Preloaders';
import RemoveDraftCreateNewDecision from '~dashboard/Dialogs/RemoveDraftDecisionDialog';

import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';
import { Colony, useLoggedInUser, useNetworkContracts } from '~data/index';
import { checkIfNetworkIsAllowed } from '~utils/networks';
import { colonyMustBeUpgraded } from '~modules/dashboard/checks';
import { DecisionDetails } from '~types/index';

const displayName = 'dashboard.ColonyHomeCreateActionsButton';

const MSG = defineMessages({
  newDecision: {
    id: 'dashboard.ColonyNewDecision.newDecision',
    defaultMessage: 'New Decision',
  },
});

interface Props {
  colony: Colony;
  ethDomainId: number;
  draftDecision?: DecisionDetails;
  removeDraftDecision: () => void;
}

interface RootState {
  users: {
    wallet: {
      isUserConnected: boolean;
    };
  };
}

const ColonyNewDecision = ({
  colony,
  ethDomainId,
  draftDecision,
  removeDraftDecision,
}: Props) => {
  const { networkId, username, ethereal } = useLoggedInUser();
  const { version: networkVersion } = useNetworkContracts();

  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(!ethereal);

  const {
    isVotingExtensionEnabled,
    isLoadingExtensions,
  } = useEnabledExtensions({
    colonyAddress: colony.colonyAddress,
  });

  useSelector((state: RootState) => {
    const { isUserConnected } = state.users.wallet;
    if (!ethereal && isUserConnected && isLoadingUser) {
      setIsLoadingUser(false);
    } else if (ethereal && isUserConnected && !isLoadingUser) {
      setIsLoadingUser(true);
    }
  });

  const openDecisionDialog = useDialog(DecisionDialog);
  const openDeleteDraftDialog = useDialog(RemoveDraftCreateNewDecision);

  const openNewDecisionDialog = () => {
    openDecisionDialog({ colony, ethDomainId });
    removeDraftDecision();
  };

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
          text={MSG.newDecision}
          onClick={() =>
            draftDecision === undefined
              ? openNewDecisionDialog()
              : openDeleteDraftDialog({ colony, openNewDecisionDialog })
          }
          disabled={
            mustUpgrade ||
            !isNetworkAllowed ||
            !hasRegisteredProfile ||
            !colony?.isDeploymentFinished ||
            !isVotingExtensionEnabled
          }
          data-test="newDecisionButton"
        />
      )}
    </>
  );
};

export default ColonyNewDecision;

ColonyNewDecision.displayName = displayName;
