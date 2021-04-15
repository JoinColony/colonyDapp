import { Address } from '~types/index';

import { useColonyReputation } from './useColonyReputation';

export const useDialogActionPermissions = (
  colonyAddress: Address,
  canPerformAction: boolean,
  isVotingExtensionEnabled: boolean,
  forceAction: boolean,
) => {
  const { colonyHasReputation } = useColonyReputation(colonyAddress);

  const onlyForceAction =
    isVotingExtensionEnabled && !colonyHasReputation && !forceAction;

  const userHasPermission =
    canPerformAction || (isVotingExtensionEnabled && colonyHasReputation);

  return [userHasPermission, onlyForceAction];
};
