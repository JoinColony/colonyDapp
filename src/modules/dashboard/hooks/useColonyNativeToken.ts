import { useCallback } from 'react';
import { useMappedState } from 'redux-react-hook';
import { ColonyType, TokenReferenceType } from '~immutable/index';
import { Address } from '~types/index';
import { useDataSubscriber } from '~utils/hooks';

import { colonySubscriber } from '../subscribers';
import { colonyNativeTokenSelector } from '../selectors';

export const useColonyNativeToken = (
  colonyAddress: Address | null,
): TokenReferenceType | null => {
  const { data: fetchedColony } = useDataSubscriber<ColonyType>(
    colonySubscriber,
    [colonyAddress],
    [colonyAddress],
  );
  const { colonyAddress: fetchedColonyAddress = undefined } =
    fetchedColony || {};

  // get the native token info from reference
  const mapColonyNativeToken = useCallback(
    state => colonyNativeTokenSelector(state, fetchedColonyAddress),
    [fetchedColonyAddress],
  );
  return useMappedState(mapColonyNativeToken);
};
