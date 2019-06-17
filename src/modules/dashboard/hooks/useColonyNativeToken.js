/* @flow */

// $FlowFixMe until hooks flow types
import { useCallback } from 'react';
import { useMappedState } from 'redux-react-hook';

import type { ColonyType, TokenReferenceType } from '~immutable';
import type { Address } from '~types';

import { useDataFetcher } from '~utils/hooks';

import { colonyFetcher } from '../fetchers';
import { colonyNativeTokenSelector } from '../selectors';

// eslint-disable-next-line import/prefer-default-export
export const useColonyNativeToken = (
  colonyAddress: ?Address,
): ?TokenReferenceType => {
  const { data: fetchedColony } = useDataFetcher<ColonyType>(
    colonyFetcher,
    [colonyAddress],
    [colonyAddress],
  );
  const { colonyAddress: fetchedColonyAddress } = fetchedColony || {};

  // get the native token info from reference
  const mapColonyNativeToken = useCallback(
    state => colonyNativeTokenSelector(state, fetchedColonyAddress),
    [fetchedColonyAddress],
  );
  return useMappedState(mapColonyNativeToken);
};
