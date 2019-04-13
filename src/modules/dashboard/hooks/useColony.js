/* @flow */

import type { Address, ENSName } from '~types';
import type { ColonyType } from '~immutable';

import { useDataFetcher } from '~utils/hooks';
import { colonyFetcher, colonyAddressFetcher } from '../fetchers';

export const useColonyWithAddress = (colonyAddress: ?Address) =>
  useDataFetcher<ColonyType>(colonyFetcher, [colonyAddress], [colonyAddress]);

export const useColonyWithName = (colonyName: ?ENSName) => {
  const { data: address } = useDataFetcher<Address>(
    colonyAddressFetcher,
    [colonyName],
    [colonyName],
  );
  const args = [address || undefined];
  return useDataFetcher<ColonyType>(colonyFetcher, args, args);
};
