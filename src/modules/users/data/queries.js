/* @flow */

import type { Address } from '~types';
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
  getUserProfileStoreAddress,
} from '~data/stores';
import { getUserTasksReducer, getUserProfileReducer } from './reducers';
import {
  getUserTokenAddresses,
  transformNotificationEventNames,
} from './utils';

const {
  READ_UNTIL,
  SUBSCRIBED_TO_COLONY,
  SUBSCRIBED_TO_TASK,
  UNSUBSCRIBED_FROM_COLONY,
  UNSUBSCRIBED_FROM_TASK,
} = USER_EVENT_TYPES;

type UserProfileStoreMetadata = {|
  walletAddress: Address,
|};

type UserMetadataStoreMetadata = {|
  metadataStoreAddress: string,
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
  {| walletAddress: Address, metadataStoreAddress: string |},
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
    return ens.isENSNameAvailable('user', username, networkClient);
  },
};

export const getUserInboxActivity: Query<
  {|
    userInboxStore: UserInboxStore,
    colonyClient: ColonyClient,
    walletAddress: Address,
  |},
  {|
    colonyAddress: Address,
    inboxStoreAddress: string,
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
      inboxStoreAddress: string,
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
      walletAddress,
    };
  },
  async execute({ userInboxStore, colonyClient, walletAddress }) {
    const {
      adapter: { provider },
      contract: { address: colonyAddress },
      events: { ColonyRoleSet, ColonyLabelRegistered, DomainAdded },
      tokenClient,
      tokenClient: {
        events: { Mint, Transfer },
        contract: { address: tokenAddress },
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
      {
        address: colonyAddress,
      },
      {
        blocksBack: 400000,
        events: [ColonyRoleSet, ColonyLabelRegistered, DomainAdded],
      },
    );
    /*
     * @note These are "fake" colony client event names, only used for easier
     * separation of events.
     *
     * As it stands in the contracts, we only have the `ColonyRoleSet`
     * event, the deciding factors being the `role` and `setTo` props
     *
     * We're changing this to make it easier to do 1-to-1 transformation of event names
     */
    let cleanedEvents = events
      .map(({ eventName, setTo, role, ...restOfEvent }) => {
        let modifiedEventName = eventName;
        if (
          eventName === 'ColonyRoleSet' &&
          role === COLONY_ROLE_ADMINISTRATION
        ) {
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
     * Fetch the Colony's RAW Token Mint Logs and Events
     */
    const { logs: mintLogs, events: mintEvents } = await getLogsAndEvents(
      tokenClient,
      {
        address: tokenAddress,
      },
      {
        blocksBack: 400000,
        events: [Mint],
      },
    );
    /*
     * Fetch the Colony's RAW Token Mint Logs and Events
     */
    const {
      logs: transferLogs,
      events: transferEvents,
    } = await getLogsAndEvents(
      tokenClient,
      {},
      {
        blocksBack: 400000,
        events: [Transfer],
        to: walletAddress,
      },
    );
    /*
     * @note We need to filter both the transaction logs and events to only
     * match the new current colony (based on the address)
     */
    const cleanedMintEvents = mintEvents.filter(
      ({ address }) => address === colonyAddress,
    );
    let cleanedMintLogs = await Promise.all(
      mintLogs.map(async mintLog => {
        /*
         * @note in order to filter the transaction logs, we need to fetch the
         * full transaction, and extract the the destination address, "to"
         *
         * For newly minted tokens, this will match the current colony's address
         */
        const { to } = await provider.getTransaction(mintLog.transactionHash);
        return {
          ...mintLog,
          to,
        };
      }),
    );
    /*
     * @note Now that we have destination address in the transaction log, we
     * can filter out the un-needed logs
     */
    cleanedMintLogs = cleanedMintLogs.filter(({ to }) => to === colonyAddress);
    /*
     * @note Since we're using the events array based on it's index, we need to
     * merge the colony events with the transaction events before transforming
     * the actual logs
     */
    cleanedEvents = cleanedEvents
      .concat(cleanedMintEvents)
      .concat(transferEvents);
    const transformedEvents = (await Promise.all(
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
        .concat(cleanedMintLogs)
        .concat(transferLogs)
        .map(async (log, index) => {
          const {
            domainId,
            address: targetUserAddress,
            amount,
            value,
            eventName,
            from,
          } = cleanedEvents[index] || {};
          const timestamp = await getLogDate(provider, log);
          let sourceUserAddress = from;
          if (eventName !== 'Transfer') {
            const { from: transactionSource } = await provider.getTransaction(
              log.transactionHash,
            );
            sourceUserAddress = transactionSource;
          }
          const transformedEvent = {
            id: log.transactionHash,
            event: transformNotificationEventNames(eventName),
            timestamp: new Date(timestamp).getTime() * 1000,
            sourceUserAddress,
            colonyAddress,
            domainId,
            targetUserAddress,
            amount: amount || value,
            tokenAddress,
          };
          return transformedEvent;
        }),
    )).filter(({ event }) => !!event);
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

export const getProfileStoreAddress: Query<
  {| ddb: DDB, metadata: {| walletAddress: Address |} |},
  {| walletAddress: Address |},
  void,
  string,
> = {
  name: 'getProfileStoreAddress',
  context: [CONTEXT.DDB_INSTANCE],
  async prepare({ ddb }, metadata) {
    return { ddb, metadata };
  },
  async execute({ ddb, metadata }) {
    const orbitAddress = await getUserProfileStoreAddress(ddb)(metadata);
    return orbitAddress.toString();
  },
};

export const getUserNotificationMetadata: Query<
  ?UserMetadataStore,
  UserMetadataStoreMetadata,
  void,
  {| readUntil: number, exceptFor: string[] |},
> = {
  name: 'getUserNotificationMetadata',
  context: [CONTEXT.DDB_INSTANCE],
  prepare: prepareMetadataStoreQuery,
  async execute(metadataStore) {
    /*
     * The user has no metadata store set, assuming there's no metadata
     */
    const [{ payload: { readUntil, exceptFor } = {} } = {}] = metadataStore
      ? metadataStore
          .all()
          .filter(({ type }) => type === READ_UNTIL)
          .sort((a, b) => b.meta.timestamp - a.meta.timestamp)
      : [];

    return {
      readUntil,
      exceptFor,
    };
  },
};
