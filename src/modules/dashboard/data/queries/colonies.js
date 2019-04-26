/* @flow */

import type { Address } from '~types';

import type {
  ColonyManager,
  ColonyClient,
  ColonyStore,
  DDB,
  Event,
  NetworkClient,
  Query,
  Wallet,
} from '~data/types';

import type {
  ColonyType,
  ContractTransactionType,
  DomainType,
} from '~immutable';

import BigNumber from 'bn.js';
import { CONTEXT } from '~context';
import { COLONY_EVENT_TYPES } from '~data/constants';

import { reduceToLastState, getLast } from '~utils/reducers';
import { getColonyStore } from '~data/stores';
import {
  getEvents,
  getLogsAndEvents,
  parseColonyFundsClaimedEvent,
  parseColonyFundsMovedBetweenFundingPotsEvent,
  parseTaskPayoutClaimedEvent,
  parseUnclaimedTransferEvent,
} from '~utils/web3/eventLogs';
import { ZERO_ADDRESS } from '~utils/web3/constants';
import { getTokenClient } from '~utils/web3/contracts';
import { addressEquals } from '~utils/strings';

import { colonyReducer, colonyTasksReducer } from '../reducers';

const {
  DOMAIN_CREATED,
  TASK_STORE_REGISTERED,
  TASK_STORE_UNREGISTERED,
} = COLONY_EVENT_TYPES;

type ColonyStoreMetadata = {|
  colonyAddress: Address,
|};
type ContractEventQuery<A, R> = Query<ColonyClient, ColonyStoreMetadata, A, R>;

const EVENT_PARSERS = {
  ColonyFundsClaimed: parseColonyFundsClaimedEvent,
  // eslint-disable-next-line max-len
  ColonyFundsMovedBetweenFundingPots: parseColonyFundsMovedBetweenFundingPotsEvent,
  TaskPayoutClaimed: parseTaskPayoutClaimedEvent,
};

const context = [CONTEXT.COLONY_MANAGER];
const colonyContext = [
  CONTEXT.COLONY_MANAGER,
  CONTEXT.DDB_INSTANCE,
  CONTEXT.WALLET,
];

export const prepareColonyClientQuery = async (
  {
    colonyManager,
  }: {|
    colonyManager: ColonyManager,
  |},
  { colonyAddress }: ColonyStoreMetadata,
) => {
  if (!colonyAddress)
    throw new Error('Cannot prepare query. Metadata is invalid');
  return colonyManager.getColonyClient(colonyAddress);
};

const prepareColonyStoreQuery = async (
  {
    colonyManager,
    ddb,
    wallet,
  }: {|
    colonyManager: ColonyManager,
    ddb: DDB,
    wallet: Wallet,
  |},
  metadata: ColonyStoreMetadata,
) => {
  const { colonyAddress } = metadata;
  const colonyClient = await colonyManager.getColonyClient(colonyAddress);
  return getColonyStore(colonyClient, ddb, wallet)(metadata);
};

export const getColonyTransactions: ContractEventQuery<
  void,
  ContractTransactionType[],
> = {
  context,
  prepare: prepareColonyClientQuery,
  async execute(colonyClient) {
    const {
      contract: { address: colonyAddress },
      events: {
        ColonyFundsClaimed,
        ColonyFundsMovedBetweenFundingPots,
        TaskPayoutClaimed,
      },
    } = colonyClient;
    const { events, logs } = await getLogsAndEvents(
      colonyClient,
      {},
      {
        blocksBack: 400000,
        events: [
          ColonyFundsClaimed,
          ColonyFundsMovedBetweenFundingPots,
          TaskPayoutClaimed,
        ],
      },
    );
    return Promise.all(
      events
        .map((event, i) =>
          EVENT_PARSERS[event.eventName]({
            event,
            log: logs[i],
            colonyClient,
            colonyAddress,
          }),
        )
        .filter(Boolean),
    );
  },
};

export const getColonyUnclaimedTransactions: ContractEventQuery<
  void,
  ContractTransactionType[],
> = {
  context,
  prepare: prepareColonyClientQuery,
  async execute(colonyClient) {
    const {
      contract: { address: colonyAddress },
      events: { ColonyFundsClaimed },
      tokenClient,
    } = colonyClient;
    const {
      events: { Transfer },
    } = tokenClient;
    const blocksBack = 400000;

    // Get logs & events for token transfer to this colony
    const {
      logs: transferLogs,
      events: transferEvents,
    } = await getLogsAndEvents(
      tokenClient,
      {},
      { blocksBack, events: [Transfer], to: colonyAddress },
    );

    // Get logs & events for token claims by this colony
    const { logs: claimLogs, events: claimEvents } = await getLogsAndEvents(
      colonyClient,
      {},
      { blocksBack, events: [ColonyFundsClaimed] },
    );

    const unclaimedTransfers = await Promise.all(
      transferEvents.map((transferEvent, i) =>
        parseUnclaimedTransferEvent({
          claimEvents,
          claimLogs,
          colonyClient,
          colonyAddress,
          transferEvent,
          transferLog: transferLogs[i],
        }),
      ),
    );

    return unclaimedTransfers.filter(Boolean);
  },
};

export const getColonyRoles: ContractEventQuery<
  void,
  { admins: string[], founder: string },
> = {
  context,
  prepare: prepareColonyClientQuery,
  async execute(colonyClient) {
    const {
      events: {
        ColonyAdminRoleRemoved,
        ColonyAdminRoleSet,
        ColonyFounderRoleSet,
      },
    } = colonyClient;
    const events = await getEvents(
      colonyClient,
      {},
      {
        blocksBack: 400000,
        events: [
          ColonyAdminRoleRemoved,
          ColonyAdminRoleSet,
          ColonyFounderRoleSet,
        ],
      },
    );
    const { eventName: ADMIN_ADDED } = ColonyAdminRoleSet;
    const { eventName: FOUNDER_SET } = ColonyFounderRoleSet;

    const getKey = event => event.user;
    const getValue = event => event.eventName;

    const admins = reduceToLastState(events, getKey, getValue)
      .filter(([, eventName]) => eventName === ADMIN_ADDED)
      .map(([user]) => user);

    const founderEvent = getLast(
      events,
      ({ eventName }) => eventName === FOUNDER_SET,
    );

    return {
      admins,
      founder: founderEvent && founderEvent.newFounder,
    };
  },
};

/**
 * @todo Get the right defaults for data reducers based on the redux data.
 */
export const getColony: Query<
  {| colonyClient: ColonyClient, colonyStore: ColonyStore |},
  ColonyStoreMetadata,
  {| colonyAddress: Address |},
  ColonyType,
> = {
  context: colonyContext,
  async prepare(
    {
      colonyManager,
      ddb,
      wallet,
    }: {|
      colonyManager: ColonyManager,
      ddb: DDB,
      wallet: Wallet,
    |},
    metadata: ColonyStoreMetadata,
  ) {
    const { colonyAddress } = metadata;
    const colonyClient = await colonyManager.getColonyClient(colonyAddress);
    const colonyStore = await getColonyStore(colonyClient, ddb, wallet)(
      metadata,
    );
    return {
      colonyClient,
      colonyStore,
    };
  },
  async execute({ colonyStore, colonyClient }, { colonyAddress }) {
    const { inRecoveryMode } = await colonyClient.isInRecoveryMode.call();
    return colonyStore
      .all()
      .filter(({ type: eventType }) => COLONY_EVENT_TYPES[eventType])
      .reduce(colonyReducer, {
        avatarHash: undefined,
        colonyAddress,
        colonyName: '',
        displayName: '',
        inRecoveryMode,
        tokens: {
          // also include Ether
          [ZERO_ADDRESS]: {
            address: ZERO_ADDRESS,
          },
        },
      });
  },
};

// @NOTE: This is a separate query so we can, later on, cache the query result
export const getColonyTasks: Query<
  ColonyStore,
  ColonyStoreMetadata,
  void,
  {
    [draftId: string]: {|
      commentsStoreAddress: string,
      taskStoreAddress: string,
    |},
  },
> = {
  context: colonyContext,
  prepare: prepareColonyStoreQuery,
  async execute(colonyStore) {
    return colonyStore
      .all()
      .filter(
        ({ type }) =>
          type === TASK_STORE_REGISTERED || type === TASK_STORE_UNREGISTERED,
      )
      .reduce(colonyTasksReducer, {});
  },
};

export const getColonyDomains: Query<
  ColonyStore,
  ColonyStoreMetadata,
  void,
  DomainType[],
> = {
  context: colonyContext,
  prepare: prepareColonyStoreQuery,
  async execute(colonyStore) {
    return colonyStore
      .all()
      .filter(({ type }) => type === DOMAIN_CREATED)
      .map(({ payload: { domainId, name } }: Event<typeof DOMAIN_CREATED>) => ({
        id: domainId,
        name,
      }));
  },
};

export const getColonyTokenBalance: Query<
  NetworkClient,
  void,
  {| colonyAddress: Address, tokenAddress: Address |},
  BigNumber,
> = {
  context: colonyContext,
  prepare: async ({
    colonyManager: { networkClient },
  }: {|
    colonyManager: ColonyManager,
  |}) => networkClient,
  async execute(networkClient, { colonyAddress, tokenAddress }) {
    const {
      adapter: { provider },
    } = networkClient;
    // if ether, handle differently
    if (addressEquals(tokenAddress, ZERO_ADDRESS)) {
      const etherBalance = await provider.getBalance(colonyAddress);

      // convert from Ethers BN
      return new BigNumber(etherBalance.toString());
    }

    // otherwise handle as ERC 20
    const tokenClient = await getTokenClient(tokenAddress, networkClient);
    const { amount } = await tokenClient.getBalanceOf.call({
      sourceAddress: colonyAddress,
    });

    // convert from Ethers BN
    return new BigNumber(amount.toString());
  },
};
