import { Address, ENSName } from '~types/index';
import { ColonyType } from '~immutable/index';
import { useDataFetcher, useDataSubscriber } from '~utils/hooks';
import { colonyAddressFetcher } from '../fetchers';
import { colonySubscriber } from '../subscribers';

export const useColonyWithAddress = (colonyAddress: Address | null) =>
  useDataSubscriber<ColonyType>(
    colonySubscriber,
    [colonyAddress],
    [colonyAddress],
  );

export const useColonyWithName = (colonyName: ENSName | null) => {
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
