/* @flow */

import type { Address, OrbitDBAddress } from '~types';
import type {
  ColonyClient,
  ColonyManager,
  DDB,
  ENSCache,
  NetworkClient,
  Query,
  UserProfileStore,
  UserInboxStore,
  UserMetadataStore,
} from '~data/types';

import type {
  ContractTransactionType,
  UserProfileType,
  UserPermissionsType,
} from '~immutable';

import {
  COLONY_ROLE_ADMINISTRATION,
  COLONY_ROLE_ROOT,
  COLONY_ROLE_RECOVERY,
} from '@colony/colony-js-client';
import BigNumber from 'bn.js';
import { formatEther } from 'ethers/utils';

import { CONTEXT } from '~context';
import { USER_EVENT_TYPES } from '~data/constants';
import { ZERO_ADDRESS } from '~utils/web3/constants';
import { reduceToLastState } from '~utils/reducers';
import { getTokenClient } from '~utils/web3/contracts';
import {
  getEventLogs,
  parseUserTransferEvent,
  getLogsAndEvents,
  getLogDate,
} from '~utils/web3/eventLogs';
import {
  getUserProfileStore,
  getUserInboxStore,
  getUserMetadataStore,
} from '~data/stores';
import { getUserTasksReducer, getUserProfileReducer } from './reducers';
import {
  getUserTokenAddresses,
  transformNotificationEventNames,
} from './utils';

const {
  SUBSCRIBED_TO_COLONY,
  SUBSCRIBED_TO_TASK,
  UNSUBSCRIBED_FROM_COLONY,
  UNSUBSCRIBED_FROM_TASK,
} = USER_EVENT_TYPES;

type UserProfileStoreMetadata = {|
  walletAddress: Address,
|};

type UserMetadataStoreMetadata = {|
  metadataStoreAddress: string | OrbitDBAddress,
  walletAddress: Address,
|};

const prepareColonyClientQuery = async (
  {
    colonyManager,
  }: {|
    colonyManager: ColonyManager,
  |},
  { colonyAddress }: {| colonyAddress: Address |},
) => colonyManager.getColonyClient(colonyAddress);

const prepareMetaColonyClientQuery = async ({
  colonyManager,
}: {|
  colonyManager: ColonyManager,
|}) => colonyManager.getMetaColonyClient();

const prepareProfileStoreQuery = async (
  { ddb }: {| ddb: DDB |},
  metadata: UserProfileStoreMetadata,
) => getUserProfileStore(ddb)(metadata);

const prepareMetadataStoreQuery = async (
  { ddb }: { ddb: DDB },
  metadata: UserMetadataStoreMetadata,
) =>
  metadata.metadataStoreAddress ? getUserMetadataStore(ddb)(metadata) : null;

export const getUserProfile: Query<
  UserProfileStore,
  UserProfileStoreMetadata,
  void,
  UserProfileType,
> = {
  name: 'getUserProfile',
  context: [CONTEXT.DDB_INSTANCE],
  prepare: prepareProfileStoreQuery,
  async execute(profileStore) {
    return profileStore.all().reduce(getUserProfileReducer, {
      /*
       * We can be pretty sure that `walletAddress` will be in the first
       * event for this store, but flow doesn't know that.
       */
      walletAddress: '',
      inboxStoreAddress: '',
      metadataStoreAddress: '',
    });
  },
};

export const getUserTasks: Query<
  ?UserMetadataStore,
  UserMetadataStoreMetadata,
  void,
  *,
> = {
  name: 'getUserTasks',
  context: [CONTEXT.DDB_INSTANCE],
  prepare: prepareMetadataStoreQuery,
  async execute(metadataStore) {
    /*
     * If the user has no metadata store set, we will assume that the
     * user is newly-created (and we can't get their subscribed tasks yet).
     */
    return metadataStore
      ? metadataStore
          .all()
          .filter(
            ({ type }) =>
              type === SUBSCRIBED_TO_TASK || type === UNSUBSCRIBED_FROM_TASK,
          )
          .reduce(getUserTasksReducer, [])
      : [];
  },
};

export const getUserColonies: Query<
  ?UserMetadataStore,
  UserMetadataStoreMetadata,
  void,
  *,
> = {
  name: 'getUserColonies',
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  prepare: prepareMetadataStoreQuery,
  async execute(metadataStore) {
    /*
     * If the user has no metadata store set, we will assume that the
     * user is newly-created (and we can't get their subscribed tasks yet).
     */
    return metadataStore
      ? reduceToLastState(
          metadataStore
            .all()
            .filter(
              ({ type }) =>
                type === SUBSCRIBED_TO_COLONY ||
                type === UNSUBSCRIBED_FROM_COLONY,
            ),
          ({ payload: { colonyAddress } }) => colonyAddress,
          ({ type }) => type,
        )
          .filter(([, type]) => type === SUBSCRIBED_TO_COLONY)
          .map(([colonyAddress]) => colonyAddress)
      : [];
  },
};

export const getUserTokens: Query<
  {| metadataStore: ?UserMetadataStore, networkClient: NetworkClient |},
  {| walletAddress: Address, metadataStoreAddress: string | OrbitDBAddress |},
  {| walletAddress: Address |},
  *,
> = {
  name: 'getUserTokens',
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE, CONTEXT.WALLET],
  async prepare(
    {
      colonyManager: { networkClient },
      ddb,
    }: {|
      colonyManager: ColonyManager,
      ddb: DDB,
    |},
    metadata: UserMetadataStoreMetadata,
  ) {
    const { metadataStoreAddress } = metadata;
    let metadataStore = null;
    if (metadataStoreAddress)
      metadataStore = await getUserMetadataStore(ddb)(metadata);
    return { metadataStore, networkClient };
  },
  async execute({ metadataStore, networkClient }, { walletAddress }) {
    const {
      adapter: { provider },
    } = networkClient;

    // for each address, get balance
    let tokens = [];
    if (metadataStore) {
      tokens = await Promise.all(
        getUserTokenAddresses(metadataStore).map(async address => {
          const tokenClient = await getTokenClient(address, networkClient);
          const { amount } = await tokenClient.getBalanceOf.call({
            sourceAddress: walletAddress,
          });
          // convert from Ethers BN
          const balance = new BigNumber(amount.toString());
          return { address, balance };
        }),
      );
    }

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

export const getUserBalance: Query<
  NetworkClient,
  void,
  {| walletAddress: string |},
  string,
> = {
  name: 'getUserBalance',
  context: [CONTEXT.COLONY_MANAGER],
  prepare: async ({
    colonyManager: { networkClient },
  }: {|
    colonyManager: ColonyManager,
  |}) => networkClient,
  async execute(networkClient, { walletAddress }) {
    const {
      adapter: { provider },
    } = networkClient;
    const balance = await provider.getBalance(walletAddress);
    return formatEther(balance);
  },
};

export const getUserPermissions: Query<
  ColonyClient,
  {| colonyAddress: Address |},
  {| walletAddress: string |},
  UserPermissionsType,
> = {
  name: 'getUserPermissions',
  context: [CONTEXT.COLONY_MANAGER],
  prepare: prepareColonyClientQuery,
  async execute(colonyClient, { walletAddress }) {
    const canEnterRecoveryMode = await colonyClient.hasColonyRole.call({
      address: walletAddress,
      role: COLONY_ROLE_RECOVERY,
      domainId: 1,
    });
    const isAdmin = await colonyClient.hasColonyRole.call({
      address: walletAddress,
      role: COLONY_ROLE_ADMINISTRATION,
      domainId: 1,
    });
    const isFounder = await colonyClient.hasColonyRole.call({
      address: walletAddress,
      role: COLONY_ROLE_ROOT,
      domainId: 1,
    });
    return { canEnterRecoveryMode, isAdmin, isFounder };
  },
};

/**
 * @todo Use a meaningful value for `blocksBack` when getting past transactions.
 */
export const getUserColonyTransactions: Query<
  ColonyClient,
  void,
  {|
    userColonyAddresses: Address[],
    walletAddress: string,
  |},
  ContractTransactionType[],
> = {
  name: 'getUserColonyTransactions',
  context: [CONTEXT.COLONY_MANAGER],
  prepare: prepareMetaColonyClientQuery,
  async execute(metaColonyClient, { walletAddress, userColonyAddresses }) {
    const { tokenClient } = metaColonyClient;
    const {
      events: { Transfer },
    } = tokenClient;
    const logFilterOptions = {
      blocksBack: 400000,
      events: [Transfer],
    };

    const transferToEventLogs = await getEventLogs(
      tokenClient,
      {},
      {
        ...logFilterOptions,
        to: walletAddress,
      },
    );

    const transferFromEventLogs = await getEventLogs(
      tokenClient,
      {},
      {
        ...logFilterOptions,
        from: walletAddress,
      },
    );

    // Combine and sort logs by blockNumber, then parse events from thihs
    const logs = [...transferToEventLogs, ...transferFromEventLogs].sort(
      // $FlowFixMe colonyJS Log should contain blockNumber
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

export const checkUsernameIsAvailable: Query<
  {| ens: ENSCache, networkClient: NetworkClient |},
  void,
  { username: string },
  boolean,
> = {
  name: 'checkUsernameIsAvailable',
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.ENS_INSTANCE],
  async prepare({
    colonyManager: { networkClient },
    ens,
  }: {|
    colonyManager: ColonyManager,
    ens: ENSCache,
  |}) {
    return { ens, networkClient };
  },
  async execute({ ens, networkClient }, { username }) {
    const userAddress = await ens.getAddress(
      ens.constructor.getFullDomain('user', username),
      networkClient,
    );

    if (userAddress)
      throw new Error(`ENS address for user "${username}" already exists`);

    return true;
  },
};

export const getUserInboxActivity: Query<
  {| userInboxStore: UserInboxStore, colonyClient: ColonyClient |},
  {|
    colonyAddress: Address,
    inboxStoreAddress: OrbitDBAddress,
    walletAddress: Address,
  |},
  void,
  *,
> = {
  name: 'getUserInboxActivity',
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.DDB_INSTANCE],
  async prepare(
    {
      colonyManager,
      ddb,
    }: {|
      colonyManager: ColonyManager,
      ddb: DDB,
    |},
    {
      colonyAddress,
      inboxStoreAddress,
      walletAddress,
    }: {|
      colonyAddress: Address,
      inboxStoreAddress: OrbitDBAddress,
      walletAddress: Address,
    |},
  ) {
    const colonyClient = await colonyManager.getColonyClient(colonyAddress);
    const userInboxStore = await getUserInboxStore(ddb)({
      inboxStoreAddress,
      walletAddress,
    });
    return {
      userInboxStore,
      colonyClient,
    };
  },
  async execute({ userInboxStore, colonyClient }) {
    const {
      adapter: { provider },
      contract: { address: colonyAddress },
      events: {
        ColonyAdministrationRoleSet,
        ColonyLabelRegistered,
        DomainAdded,
      },
      tokenClient,
      tokenClient: {
        events: { Mint },
      },
    } = colonyClient;
    /*
     * Fetch the Colony's RAW Transactions Logs and Events
     *
     * @note For some reason Flow is complaining about `events` not existing as
     * a prop on the Promise class.
     * This is very weird, as all other instances of calling this method work.
     * I think it doesn't inffer the actual promise result properly.
     */
    /* $FlowFixMe */
    const { events, logs } = await getLogsAndEvents(
      colonyClient,
      {},
      {
        blocksBack: 400000,
        events: [
          ColonyAdministrationRoleSet,
          ColonyLabelRegistered,
          DomainAdded,
        ],
      },
    );
    /*
     * @note Explain this!
     */
    let cleanedEvents = events
      .map(({ eventName, setTo, ...restOfEvent }) => {
        let modifiedEventName = eventName;
        if (eventName === 'ColonyAdministrationRoleSet') {
          if (setTo) {
            modifiedEventName = 'ColonyAdministrationRoleSetAdded';
          } else {
            modifiedEventName = 'ColonyAdministrationRoleSetRemoved';
          }
        }
        return {
          ...restOfEvent,
          setTo,
          eventName: modifiedEventName,
        };
      })
      .slice(4);
    /*
     * @note Manually set the `ColonyLabelRegistered` event
     *
     * Since that event doesn't show up for some reason, maybe a bug ?
     * But use the event name from the others (eg: DomainAdded, ColonyAdminRoleSet)
     */
    cleanedEvents.unshift({
      eventName: 'ColonyLabelRegistered',
    });
    /*
     * Fetch the Colony's RAW Token Transactions Logs and Events
     */
    const {
      logs: transferLogs,
      events: transferEvents,
    } = await getLogsAndEvents(
      tokenClient,
      {},
      {
        blocksBack: 400000,
        events: [Mint],
      },
    );
    /*
     * @note Explain this filtering
     */
    const cleanedTransferEvents = transferEvents.filter(
      ({ address }) => address === colonyAddress,
    );
    let cleanedTransferLogs = await Promise.all(
      transferLogs.map(async transferLog => {
        const { to } = await provider.getTransaction(
          transferLog.transactionHash,
        );
        return {
          ...transferLog,
          to,
        };
      }),
    );
    cleanedTransferLogs = cleanedTransferLogs.filter(
      ({ to }) => to === colonyAddress,
    );
    // console.log('raw tranfer events', transferEvents);
    console.log('cleaned tranfer events', cleanedTransferEvents);
    // console.log('raw transfer logs', transferLogs);
    console.log('cleaned transfer logs', cleanedTransferLogs);
    /*
     * @note Explain this filtering
     */
    cleanedEvents = cleanedEvents.concat(cleanedTransferEvents);
    const transformedEvents = await Promise.all(
      /*
       * @note Remove the first four log entries.
       *
       * When creating a new colony, the first 5 log events are:
       * - Root colony domain added with id `1`
       * - Colony founder added as an admin
       * - Root colony domain added with id `1` (same as the above, maybe a bug?)
       * - Colony founder added as an admin (again, same as above, buggy bug ?)
       * - Colony ENS name claimed
       *
       * Since we don't notify the user about the root domain creation, or the default admin role, we remove
       * those first four log entries from the array
       */
      logs
        .slice(4)
        .concat(cleanedTransferLogs)
        .map(async (log, index) => {
          const { domainId, address: targetUserAddress } =
            cleanedEvents[index] || {};
          const timestamp = await getLogDate(provider, log);
          const { from: sourceUserAddress } = await provider.getTransaction(
            log.transactionHash,
          );
          const transformedEvent = {
            id: log.transactionHash,
            event: transformNotificationEventNames(
              cleanedEvents[index].eventName,
            ),
            timestamp: new Date(timestamp).getTime() * 1000,
            sourceUserAddress,
            colonyAddress,
            domainId,
            targetUserAddress,
            amount: cleanedEvents[index].amount,
            tokenAddress: log.address,
          };
          return transformedEvent;
        }),
    );
    return userInboxStore
      .all()
      .map(({ meta: { id, timestamp, sourceUserAddress }, payload }) =>
        Object.assign({}, payload, { id, timestamp, sourceUserAddress }),
      )
      .concat(transformedEvents)
      .sort(
        (firstEvent, secondEvent) =>
          firstEvent.timestamp - secondEvent.timestamp,
      );
  },
};
