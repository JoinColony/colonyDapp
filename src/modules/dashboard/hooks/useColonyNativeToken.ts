import { useCallback } from 'react';
import { useMappedState } from 'redux-react-hook';
import { ColonyTokenReferenceType } from '~immutable/index';
import { Address } from '~types/index';
import { useDataFetcher } from '~utils/hooks';

import { colonyFetcher } from '../fetchers';
import { colonyNativeTokenSelector } from '../selectors';

export const useColonyNativeToken = (
  colonyAddress: Address | null,
): ColonyTokenReferenceType | undefined => {
  const { data: fetchedColony } = useDataFetcher(
    colonyFetcher,
    [colonyAddress as string],
    [colonyAddress],
  );
  const { colonyAddress: fetchedColonyAddress = '' } = fetchedColony || {};

  // get the native token info from reference
  const mapColonyNativeToken = useCallback(
    state => colonyNativeTokenSelector(state, fetchedColonyAddress),
    [fetchedColonyAddress],
  );
  return useMappedState(mapColonyNativeToken);
};
