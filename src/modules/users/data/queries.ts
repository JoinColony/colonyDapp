import {
  COLONY_ROLE_ADMINISTRATION,
  COLONY_ROLES,
} from '@colony/colony-js-client';
import flatten from 'lodash/flatten';
import BigNumber from 'bn.js';
import { formatEther } from 'ethers/utils';

import { Address, createAddress } from '~types/index';
import {
  ColonyClient,
  ColonyManager,
  ENSCache,
  NetworkClient,
  Query,
} from '~data/types';
import {
  ContractTransactionType,
  UserTokenReferenceType,
} from '~immutable/index';
import { normalizeTransactionLog } from '~data/normalizers';
import ENS from '~lib/ENS';
import { Context } from '~context/index';
import { ZERO_ADDRESS } from '~utils/web3/constants';
import {
  formatFilterTopic,
  getDecoratedEvents,
  getEventLogs,
  mapTopics,
  parseUserTransferEvent,
} from '~utils/web3/eventLogs';
import {
  decorateColonyEventPayload,
  getExtensionAddresses,
  getUserAddressByUsername,
} from './utils';

interface UserProfileStoreMetadata {
  walletAddress: Address;
}

interface UserMetadataStoreMetadata {
  metadataStoreAddress: string;
  walletAddress: Address;
}

const prepareMetaColonyClientQuery = async ({
  colonyManager,
}: {
  colonyManager: ColonyManager;
}) => colonyManager.getMetaColonyClient();

// FIXME do this in saga, also using apollo data for user tokens
export const getUserTokens: Query<
  {
    colonyManager: ColonyManager;
  },
  { walletAddress: Address },
  { walletAddress: Address },
  any
> = {
  name: 'getUserTokens',
  context: [Context.COLONY_MANAGER, Context.WALLET],
  async prepare({ colonyManager }: { colonyManager: ColonyManager }) {
    return { colonyManager };
  },
  async execute({ colonyManager }, { walletAddress }) {
    const {
      networkClient: {
        adapter: { provider },
      },
    } = colonyManager;

    // FIXME get user tokens from apollo here
    const tokenAddresses = [] as string[];
    const tokens: UserTokenReferenceType[] = await Promise.all(
      tokenAddresses.map(async address => {
        const tokenClient = await colonyManager.getTokenClient(address);
        const { amount } = await tokenClient.getBalanceOf.call({
          sourceAddress: walletAddress,
        });
        // convert from Ethers BN
        const balance = new BigNumber(amount.toString());
        return { address, balance };
      }),
    );

    // also get balance for ether and return in same format
    const etherBalance = await provider.getBalance(walletAddress);
    const etherToken = {
      address: ZERO_ADDRESS,
      // convert from Ethers BN
      balance: new BigNumber(etherBalance.toString()),
    };

    // return combined array
    return [etherToken, ...tokens];
  },
};

// FIXME remove as soon as possible
export const getUserBalance: Query<
  NetworkClient,
  void,
  { walletAddress: string },
  string
> = {
  name: 'getUserBalance',
  context: [Context.COLONY_MANAGER],
  prepare: async ({
    colonyManager: { networkClient },
  }: {
    colonyManager: ColonyManager;
  }) => networkClient,
  async execute(networkClient, { walletAddress }) {
    const {
      adapter: { provider },
    } = networkClient;
    const balance = await provider.getBalance(walletAddress);
    return formatEther(balance);
  },
};

export const getUserAddress: Query<
  { ens: ENSCache; networkClient: NetworkClient },
  void,
  { username: string },
  Address
> = {
  name: 'getUserAddress',
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
  async execute({ ens, networkClient }, { username }) {
    const userAddress = await getUserAddressByUsername(ens, networkClient)(
      username,
    );

    if (!userAddress) {
      throw new Error(`Address not found for username "${username}"`);
    }

    return createAddress(userAddress);
  },
};

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

const getColonyEventsForUserInbox = async (
  colonyClient: ColonyClient,
  walletAddress: Address,
) => {
  const {
    contract: { address: colonyAddress },
    events: { DomainAdded, ColonyRoleSet },
    tokenClient,
    tokenClient: {
      events: { Mint },
      contract: { address: tokenAddress },
    },
    networkClient: {
      contract: { address: colonyNetworkAddress },
      events: { ColonyLabelRegistered },
    },
    networkClient,
  } = colonyClient;

  const extensionAddresses = await getExtensionAddresses(colonyClient);

  const colonyLabelRegisteredEvents = await getDecoratedEvents<
    'ColonyLabelRegistered',
    { colony: string; label: string; tokenAddress: string }
  >(
    networkClient,
    {
      ...mapTopics(ColonyLabelRegistered.interface.topics[0], colonyAddress),
      fromBlock: 1,
    },
    {
      events: [ColonyLabelRegistered],
    },
  );

  const roleAssignmentEvents = await getDecoratedEvents<
    'ColonyRoleSet',
    {
      address: string;
      domainId: number;
      // In the future we might want to use an enum here
      role: string;
      setTo: boolean;
    }
  >(
    colonyClient,
    {
      // @TODO: Allow null values on log topics filter
      ...mapTopics(
        ColonyRoleSet.interface.topics[0],
        null,
        null,
        formatFilterTopic(COLONY_ROLES[COLONY_ROLE_ADMINISTRATION]),
      ),
      address: colonyAddress,
      fromBlock: 1,
    },
    {
      events: [ColonyRoleSet],
    },
  );

  const domainAddedEvents = await getDecoratedEvents<
    'DomainAdded',
    {
      domainId: number;
    }
  >(
    colonyClient,
    {
      address: colonyAddress,
      fromBlock: 1,
    },
    {
      events: [DomainAdded],
    },
  );

  const tokenMintedEvents = await getDecoratedEvents<
    'Mint',
    { address: string; amount: BigNumber }
  >(
    tokenClient,
    {
      address: tokenAddress,
      fromBlock: 1,
    },
    {
      events: [Mint],
    },
  );

  const colonyEvents = [
    ...tokenMintedEvents,
    ...domainAddedEvents.filter(
      // Filter out the root domain added event
      ({ event }) => event.domainId !== 1,
    ),
    ...roleAssignmentEvents.filter(
      (
        { transaction: { from }, event }, // Filter out assignments from/to the same user, and assignments
      ) =>
        // for extension contracts
        from !== event.address && !extensionAddresses.includes(event.address),
    ),
  ].filter(({ transaction: { from } }) => from !== walletAddress);

  const normalized = [
    ...colonyLabelRegisteredEvents.map(event =>
      normalizeTransactionLog(colonyNetworkAddress, event),
    ),
    ...colonyEvents.map(event => normalizeTransactionLog(colonyAddress, event)),
  ];

  return normalized.map(decorateColonyEventPayload).filter(Boolean);
};

const getAllColonyEventsForUserInbox = async (
  colonyClients: ColonyClient[],
  walletAddress: Address,
) => {
  const events = await Promise.all(
    colonyClients.map(colonyClient =>
      getColonyEventsForUserInbox(colonyClient, walletAddress),
    ),
  );
  return flatten(events);
};

export const getUserInboxActivity: Query<
  {
    colonyClients: ColonyClient[];
    walletAddress: Address;
  },
  {
    userColonies: Address[];
    walletAddress: Address;
  },
  void,
  any
> = {
  name: 'getUserInboxActivity',
  context: [Context.COLONY_MANAGER, Context.DDB_INSTANCE],
  async prepare({ colonyManager }, { userColonies, walletAddress }) {
    const colonyClients = await Promise.all(
      userColonies.map(address => colonyManager.getColonyClient(address)),
    );

    return {
      colonyClients,
      walletAddress,
    };
  },
  async execute({ colonyClients, walletAddress }) {
    const colonyEvents = await getAllColonyEventsForUserInbox(
      colonyClients,
      walletAddress,
    );

    // FIXME these need to come from apollo.
    const inboxStoreEvents = [];
    const profileStoreEvents = [];

    // Sort all events in descending date order
    return [...profileStoreEvents, ...inboxStoreEvents, ...colonyEvents].sort(
      (a, b) => b.meta.timestamp - a.meta.timestamp,
    );
  },
};
