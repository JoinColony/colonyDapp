/* @flow */

import type { Address, ENSName } from '~types';
import type { ColonyType } from '~immutable';

import { useDataFetcher, useDataSubscriber } from '~utils/hooks';
import { colonyAddressFetcher } from '../fetchers';
import { colonySubscriber } from '../subscribers';

export const useColonyWithAddress = (colonyAddress: ?Address) =>
  useDataSubscriber<ColonyType>(
    colonySubscriber,
    [colonyAddress],
    [colonyAddress],
  );

export const useColonyWithName = (colonyName: ?ENSName) => {
  const { error: addressError, data: address } = useDataFetcher<Address>(
    colonyAddressFetcher,
    [colonyName],
    [colonyName],
  );

  const args = [address || undefined];
  const { error: colonyError, ...colonyData } = useDataSubscriber<ColonyType>(
    colonySubscriber,
    args,
    args,
  );

  return {
    ...colonyData,
    error: addressError || colonyError,
  };
};
