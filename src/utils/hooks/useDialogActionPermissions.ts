import { Address } from '~types/index';

import { useColonyReputation } from './useColonyReputation';

export const useDialogActionPermissions = (
  colonyAddress: Address,
  canPerformAction: boolean,
  isVotingExtensionEnabled: boolean,
  forceAction: boolean,
  domainId?: number,
) => {
  const hasReputation = useColonyReputation(colonyAddress, domainId);

  const onlyForceAction =
    isVotingExtensionEnabled && !hasReputation && !forceAction;

  const userHasPermission =
    canPerformAction || (isVotingExtensionEnabled && hasReputation);

  return [userHasPermission, onlyForceAction];
};
