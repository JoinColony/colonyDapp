import { Address } from '~types/index';
import {
  ColonyClient,
  ColonyManager,
  ENSCache,
  NetworkClient,
  Query,
} from '~data/types';
import { ContractTransactionType } from '~immutable/index';
import ENS from '~lib/ENS';
import { Context } from '~context/index';
import { getEventLogs, parseUserTransferEvent } from '~utils/web3/eventLogs';

const prepareMetaColonyClientQuery = async ({
  colonyManager,
}: {
  colonyManager: ColonyManager;
}) => colonyManager.getMetaColonyClient();

export const getUsername: Query<
  { ens: ENSCache; networkClient: NetworkClient },
  void,
  { walletAddress: Address },
  string | null
> = {
  name: 'getUsername',
  context: [Context.COLONY_MANAGER, Context.ENS_INSTANCE],
  async prepare({
    colonyManager: { networkClient },
    ens,
  }: {
    colonyManager: ColonyManager;
    ens: ENSCache;
  }) {
    return { ens, networkClient };
  },
  async execute({ ens, networkClient }, { walletAddress }) {
    try {
      const domain = await ens.getDomain(walletAddress, networkClient);
      return ENS.stripDomainParts('user', domain);
    } catch (e) {
      return null;
    }
  },
};

/**
 * This query gets all tokens sent from or received to this wallet since a certain block time
 */
export const getUserColonyTransactions: Query<
  ColonyClient,
  void,
  {
    userColonyAddresses: Address[];
    walletAddress: string;
  },
  ContractTransactionType[]
> = {
  name: 'getUserColonyTransactions',
  context: [Context.COLONY_MANAGER],
  prepare: prepareMetaColonyClientQuery,
  async execute(metaColonyClient, { walletAddress, userColonyAddresses }) {
    const { tokenClient } = metaColonyClient;
    const {
      events: { Transfer },
    } = tokenClient;
    const logFilterOptions = {
      events: [Transfer],
    };

    const transferToEventLogs = await getEventLogs(
      tokenClient,
      { fromBlock: 1 },
      {
        ...logFilterOptions,
        to: walletAddress,
      },
    );

    const transferFromEventLogs = await getEventLogs(
      tokenClient,
      { fromBlock: 1 },
      {
        ...logFilterOptions,
        from: walletAddress,
      },
    );

    // Combine and sort logs by blockNumber, then parse events from thihs
    const logs = [...transferToEventLogs, ...transferFromEventLogs].sort(
      (a, b) => a.blockNumber - b.blockNumber,
    );
    const transferEvents = await tokenClient.parseLogs(logs);

    return Promise.all(
      transferEvents.map((event, i) =>
        parseUserTransferEvent({
          event,
          log: logs[i],
          tokenClient,
          userColonyAddresses,
          walletAddress,
        }),
      ),
    );
  },
};
