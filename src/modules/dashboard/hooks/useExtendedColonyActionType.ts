import { useMemo } from 'react';

import { Colony } from '~data/index';
import { ColonyActionQuery } from '~data/generated';
import { ColonyActions, ColonyExtendedActions } from '~types/index';
import { ColonyMetadata } from '~utils/colonyActions';

import useColonyMetadataChecks from './useColonyMetadataChecks';

const useExtendedColonyActionType = (
  actionType: string,
  colony: Colony,
  transactionHash: string,
  colonyAction: ColonyActionQuery['colonyAction'] | ColonyMetadata,
) => {
  const {
    verifiedAddressesChanged,
    tokensChanged,
    removedSafes,
  } = useColonyMetadataChecks(
    actionType,
    colony,
    transactionHash,
    colonyAction,
  );

  return useMemo(() => {
    if (actionType === ColonyActions.ColonyEdit) {
      if (verifiedAddressesChanged) {
        return ColonyExtendedActions.AddressBookUpdated;
      }

      if (tokensChanged) {
        return ColonyExtendedActions.TokensUpdated;
      }

      if ((removedSafes || []).length > 0) {
        return ColonyExtendedActions.SafeRemoved;
      }
    }
    return actionType;
  }, [actionType, verifiedAddressesChanged, tokensChanged, removedSafes]);
};

export default useExtendedColonyActionType;
