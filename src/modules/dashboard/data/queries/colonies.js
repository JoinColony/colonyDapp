/* @flow */

import type { Address, ENSName } from '~types';

import type {
  ColonyClientContext,
  ContextWithMetadata,
  DDBContext,
  Event,
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
  colonyENSName: string | ENSName,
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
  {| ...ColonyClientContext, ...DDBContext |},
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
  metadata: { colonyENSName },
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
        blocksBack: 400000, // TODO use a more meaningful value for blocksBack
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
            colonyENSName,
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
  metadata: { colonyAddress, colonyENSName },
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
    // TODO use a more meaningful value for blocksBack
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
          colonyENSName,
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
        blocksBack: 400000, // TODO use a more meaningful value for blocksBack
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

export const getColony: ColonyQuery<void, ColonyType> = ({
  ddb,
  colonyClient,
  wallet,
  metadata: { colonyAddress, colonyENSName },
}) => ({
  async execute() {
    const colonyStore = await getColonyStore(colonyClient, ddb, wallet)({
      colonyAddress,
      colonyENSName,
    });

    const { inRecoveryMode } = await colonyClient.isInRecoveryMode.call();

    return colonyStore
      .all()
      .filter(({ type: eventType }) => COLONY_EVENT_TYPES[eventType])
      .reduce(
        colonyReducer,
        // TODO: Add the right defaults here using a data model or something like that
        {
          colonyAddress,
          avatarHash: undefined,
          ensName: colonyENSName,
          inRecoveryMode,
          name: '',
          tokens: {},
        },
      );
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
> = ({
  ddb,
  colonyClient,
  wallet,
  metadata: { colonyAddress, colonyENSName },
}) => ({
  async execute() {
    const colonyStore = await getColonyStore(colonyClient, ddb, wallet)({
      colonyAddress,
      colonyENSName,
    });
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
      .map(({ payload: { domainId, name } }: Event<typeof DOMAIN_CREATED>) => ({
        id: domainId,
        name,
      }));
  },
});
