import {
  COLONY_ROLE_ADMINISTRATION,
  COLONY_ROLES,
} from '@colony/colony-js-client';
import flatten from 'lodash/flatten';
import BigNumber from 'bn.js';

import { Address } from '~types/index';
import {
  ColonyClient,
  ColonyManager,
  ENSCache,
  NetworkClient,
  Query,
} from '~data/types';
import { ContractTransactionType } from '~immutable/index';
import { normalizeTransactionLog } from '~data/normalizers';
import ENS from '~lib/ENS';
import { Context } from '~context/index';
import {
  formatFilterTopic,
  getDecoratedEvents,
  getEventLogs,
  mapTopics,
  parseUserTransferEvent,
} from '~utils/web3/eventLogs';
import { decorateColonyEventPayload, getExtensionAddresses } from './utils';

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
