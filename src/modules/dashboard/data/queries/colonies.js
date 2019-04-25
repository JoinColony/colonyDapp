/* @flow */

import BigNumber from 'bn.js';

import type { Address } from '~types';

import type {
  ColonyClientContext,
  ContextWithMetadata,
  DDBContext,
  Event,
  NetworkClientContext,
  Query,
  WalletContext,
} from '~data/types';

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

import type {
  ColonyType,
  ContractTransactionType,
  DomainType,
} from '~immutable';

import { colonyReducer, colonyTasksReducer } from '../reducers';
import { reduceToLastState, getLast } from '~utils/reducers';

import { getColonyStore } from '~data/stores';
import { COLONY_EVENT_TYPES } from '~data/constants';

const {
  DOMAIN_CREATED,
  TASK_STORE_REGISTERED,
  TASK_STORE_UNREGISTERED,
} = COLONY_EVENT_TYPES;

type ColonyMetadata = {|
  colonyAddress: Address,
|};

export type ColonyQueryContext = ContextWithMetadata<
  ColonyMetadata,
  ColonyClientContext & DDBContext & WalletContext,
>;

export type ColonyContractEventQuery<I: *, R: *> = Query<
  ColonyClientContext,
  I,
  R,
>;

export type ColonyContractTransactionsEventQuery<I: *, R: *> = Query<
  ContextWithMetadata<ColonyMetadata, ColonyClientContext>,
  I,
  R,
>;

export type ColonyContractRolesEventQuery<I: *, R: *> = Query<
  { ...ColonyClientContext, ...DDBContext },
  I,
  R,
>;

export type ColonyTokenBalanceQuery<I: *, R: *> = Query<
  ContextWithMetadata<ColonyMetadata, NetworkClientContext>,
  I,
  R,
>;

export type ColonyQuery<I: *, R: *> = Query<ColonyQueryContext, I, R>;

const EVENT_PARSERS = {
  ColonyFundsClaimed: parseColonyFundsClaimedEvent,
  // eslint-disable-next-line max-len
  ColonyFundsMovedBetweenFundingPots: parseColonyFundsMovedBetweenFundingPotsEvent,
  TaskPayoutClaimed: parseTaskPayoutClaimedEvent,
};

export const getColonyTransactions: ColonyContractTransactionsEventQuery<
  void,
  ContractTransactionType[],
> = ({
  metadata: { colonyAddress },
  colonyClient: {
    events: {
      ColonyFundsClaimed,
      ColonyFundsMovedBetweenFundingPots,
      TaskPayoutClaimed,
    },
  },
  colonyClient,
}) => ({
  async execute() {
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
});

export const getColonyUnclaimedTransactions: ColonyContractTransactionsEventQuery<
  void,
  ContractTransactionType[],
> = ({
  metadata: { colonyAddress },
  colonyClient: {
    events: { ColonyFundsClaimed },
    tokenClient: {
      events: { Transfer },
    },
    tokenClient,
  },
  colonyClient,
}) => ({
  async execute() {
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
});

export const getColonyRoles: ColonyContractRolesEventQuery<
  void,
  { admins: string[], founder: string },
> = context => ({
  async execute() {
    const { colonyClient } = context;
    const events = await getEvents(
      colonyClient,
      {},
      {
        blocksBack: 400000,
        events: [
          colonyClient.events.ColonyAdminRoleRemoved,
          colonyClient.events.ColonyAdminRoleSet,
          colonyClient.events.ColonyFounderRoleSet,
        ],
      },
    );
    const { eventName: ADMIN_ADDED } = colonyClient.events.ColonyAdminRoleSet;
    const { eventName: FOUNDER_SET } = colonyClient.events.ColonyFounderRoleSet;

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
});

/**
 * @todo Get the right defaults for data reducers based on the redux data
 */
export const getColony: ColonyQuery<void, ColonyType> = ({
  ddb,
  colonyClient,
  wallet,
  metadata: { colonyAddress },
  metadata,
}) => ({
  async execute() {
    const colonyStore = await getColonyStore(colonyClient, ddb, wallet)(
      metadata,
    );

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
});

// @NOTE: This is a separate query so we can, later on, cache the query result
export const getColonyTasks: ColonyQuery<
  void,
  {
    [draftId: string]: {|
      commentsStoreAddress: string,
      taskStoreAddress: string,
    |},
  },
> = ({ ddb, colonyClient, wallet, metadata }) => ({
  async execute() {
    const colonyStore = await getColonyStore(colonyClient, ddb, wallet)(
      metadata,
    );
    return colonyStore
      .all()
      .filter(
        ({ type }) =>
          type === TASK_STORE_REGISTERED || type === TASK_STORE_UNREGISTERED,
      )
      .reduce(colonyTasksReducer, {});
  },
});

export const getColonyDomains: ColonyQuery<void, DomainType[]> = ({
  ddb,
  colonyClient,
  wallet,
  metadata,
}) => ({
  async execute() {
    const colonyStore = await getColonyStore(colonyClient, ddb, wallet)(
      metadata,
    );

    return colonyStore
      .all()
      .filter(({ type }) => type === DOMAIN_CREATED)
      .map(({ payload }: Event<typeof DOMAIN_CREATED>) => payload);
  },
});

export const getColonyTokenBalance: ColonyTokenBalanceQuery<
  Address,
  BigNumber,
> = ({
  networkClient,
  networkClient: {
    adapter: { provider },
  },
  metadata: { colonyAddress },
}) => ({
  async execute(tokenAddress) {
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
});
