/* @flow */

// $FlowFixMe until hooks flow types
import { useCallback } from 'react';
import { useMappedState } from 'redux-react-hook';

import type { ColonyType, TokenReferenceType } from '~immutable';
import type { Address } from '~types';

import { useDataSubscriber } from '~utils/hooks';

import { colonySubscriber } from '../subscribers';
import { colonyNativeTokenSelector } from '../selectors';

// eslint-disable-next-line import/prefer-default-export
export const useColonyNativeToken = (
  colonyAddress: ?Address,
): ?TokenReferenceType => {
  const { data: fetchedColony } = useDataSubscriber<ColonyType>(
    colonySubscriber,
    [colonyAddress],
    [colonyAddress],
    { alwaysSubscribe: false },
  );
  const { colonyAddress: fetchedColonyAddress } = fetchedColony || {};

  // get the native token info from reference
  const mapColonyNativeToken = useCallback(
    state => colonyNativeTokenSelector(state, fetchedColonyAddress),
    [fetchedColonyAddress],
  );
  return useMappedState(mapColonyNativeToken);
};
