/* @flow */

import type { Address, ENSName } from '~types';
import type { ColonyType } from '~immutable';

import { useDataFetcher } from '~utils/hooks';
import { colonyFetcher, colonyAddressFetcher } from '../fetchers';

export const useColonyWithAddress = (colonyAddress: ?Address) =>
  useDataFetcher<ColonyType>(colonyFetcher, [colonyAddress], [colonyAddress]);

export const useColonyWithName = (colonyName: ?ENSName) => {
  const { error: addressError, data: address } = useDataFetcher<Address>(
    colonyAddressFetcher,
    [colonyName],
    [colonyName],
  );

  const args = [address || undefined];
  const { error: colonyError, ...colonyData } = useDataFetcher<ColonyType>(
    colonyFetcher,
    args,
    args,
  );

  return {
    ...colonyData,
    error: addressError || colonyError,
  };
};
