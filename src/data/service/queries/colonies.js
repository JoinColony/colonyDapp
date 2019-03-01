/* @flow */

import type { Address, ENSName } from '~types';

import type {
  ColonyClientContext,
  Context,
  DDBContext,
  Event,
  Query,
  WalletContext,
} from '../../types';

import {
  getEvents,
  getEventLogs,
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

import type {
  DomainCreatedEvent,
  TaskStoreRegistered,
  TaskStoreUnregistered,
} from '../events';

import { getColonyStore } from '../../stores';
import { COLONY_EVENT_TYPES } from '../../constants';
import { getUserProfile } from './users';

const {
  AVATAR_REMOVED,
  AVATAR_UPLOADED,
  DOMAIN_CREATED,
  PROFILE_UPDATED,
  PROFILE_CREATED,
  TASK_STORE_REGISTERED,
  TASK_STORE_UNREGISTERED,
  TOKEN_INFO_ADDED,
} = COLONY_EVENT_TYPES;

type ColonyMetadata = {|
  colonyENSName: string | ENSName,
  colonyAddress: Address,
|};

export type ColonyQueryContext = Context<
  ColonyMetadata,
  ColonyClientContext & DDBContext & WalletContext,
>;

export type ColonyContractEventQuery<I: *, R: *> = Query<
  ColonyClientContext,
  I,
  R,
>;

export type ColonyContractTransactionsEventQuery<I: *, R: *> = Query<
  Context<ColonyMetadata, ColonyClientContext>,
  I,
  R,
>;

export type ColonyContractAdminEventQuery<I: *, R: *> = Query<
  {| ...ColonyClientContext, ...DDBContext |},
  I,
  R,
>;

export type ColonyQuery<I: *, R: *> = Query<ColonyQueryContext, I, R>;

const getAdminProfiles = async ({ colonyClient, ddb }: *, events: *) => {
  const uniqueRemovedAdmins = [
    ...new Set(
      events
        .filter(
          ({ eventName }) =>
            eventName === colonyClient.events.ColonyAdminRoleRemoved.eventName,
        )
        .map(({ user }) => user),
    ),
  ];
  return Promise.all(
    events
      // TODO rethink this logic so that we can handle the case of an admin being set,
      // removed and later set again
      .filter(
        ({ eventName, user }) =>
          eventName === colonyClient.events.ColonyAdminRoleSet.eventName &&
          !uniqueRemovedAdmins.includes(user),
      )
      .map(({ user: walletAddress }) =>
        getUserProfile({ ddb, metadata: { walletAddress } }).execute(),
      ),
  );
};

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

export const getColonyAdmins: ColonyContractAdminEventQuery<
  void,
  $PropertyType<ColonyType, 'admins'>,
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
        ],
      },
    );

    const adminProfiles = await getAdminProfiles(context, events);

    return adminProfiles.reduce(
      (admins, admin) => ({
        ...admins,
        [admin.username || admin.walletAddress]: {
          ...admin,
          state: 'pending', // TODO get admin user state
        },
      }),
      {},
    );
  },
});

export const getColonyFounder: ColonyContractEventQuery<void, ?string> = ({
  colonyClient,
}) => ({
  async execute() {
    const founderRoleSetLogs = await getEventLogs(
      colonyClient,
      {},
      {
        blocksBack: 400000, // TODO use a more meaningful value for blocksBack
        events: [colonyClient.events.ColonyFounderRoleSet],
      },
    );

    // TODO colonyJS should support sorting
    const [head] = founderRoleSetLogs
      .sort((a, b) => a.blockNumber - b.blockNumber)
      .reverse();

    return head && head.newFounder;
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

    const getAdminsQuery = getColonyAdmins({ colonyClient, ddb });
    const admins = await getAdminsQuery.execute();
    // @TODO: Include `founder` to ColonyType
    // const getFounderQuery = getColonyFounder({ colonyClient });
    // const founder = await getFounderQuery.execute();

    const { inRecoveryMode } = await colonyClient.isInRecoveryMode.call();

    return colonyStore
      .all()
      .filter(({ type: eventType }) => COLONY_EVENT_TYPES[eventType])
      .reduce(
        (
          colony,
          { type, payload }: Event<$Values<typeof COLONY_EVENT_TYPES>, *>,
        ) => {
          switch (type) {
            case TOKEN_INFO_ADDED: {
              // @TODO: We should change this to not return the balance, we have to change the ColonyType or make a mapping from the query result to it
              const { address } = payload;
              const { tokens } = colony;
              return {
                ...colony,
                tokens: Object.assign({}, tokens, {
                  [address]: Object.assign({}, payload, { balance: 0 }),
                }),
              };
            }
            case AVATAR_UPLOADED: {
              // @TODO: Make avatar an object so we have the ipfsHash and data
              const { ipfsHash } = payload;
              return {
                ...colony,
                avatar: ipfsHash,
              };
            }
            case AVATAR_REMOVED: {
              const { avatar } = colony;
              const { ipfsHash } = payload;
              return {
                ...colony,
                avatar: avatar && avatar === ipfsHash ? undefined : avatar,
              };
            }
            case PROFILE_CREATED:
            case PROFILE_UPDATED:
              return Object.assign({}, colony, payload);
            default:
              return colony;
          }
        },
        // @TODO: Add the right defaults here using a data model or something like that
        {
          address: colonyAddress,
          admins,
          avatar: undefined,
          ensName: colonyENSName,
          inRecoveryMode,
          name: '',
          tokens: {},
        },
      );
  },
});

export const getColonyAvatar: ColonyQuery<
  *,
  null | {| ipfsHash: string, avatar: string |},
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
      .filter(({ type: eventType }) => COLONY_EVENT_TYPES[eventType])
      .reduce(
        (
          colony,
          { type, payload }: Event<$Values<typeof COLONY_EVENT_TYPES>, *>,
        ) => {
          switch (type) {
            case AVATAR_UPLOADED: {
              const { ipfsHash, avatar } = payload;
              return {
                ipfsHash,
                avatar,
              };
            }
            case AVATAR_REMOVED:
              return null;

            default:
              return colony;
          }
        },
        null,
      );
  },
});

// @NOTE: This is a separate query so we can, later on, cache the query result
export const getColonyTasks: ColonyQuery<
  void,
  { [domainId: string]: { [draftId: string]: string } },
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
        ({ type: eventType }) =>
          eventType === TASK_STORE_REGISTERED ||
          eventType === TASK_STORE_UNREGISTERED,
      )
      .reduce(
        (
          domainTasks,
          {
            type,
            payload: { domainId, taskId, taskStoreAddress },
          }: TaskStoreRegistered | TaskStoreUnregistered,
        ) => {
          switch (type) {
            case TASK_STORE_REGISTERED: {
              return Object.assign({}, domainTasks, {
                [domainId]: Object.assign({}, domainTasks[domainId], {
                  [taskId]: taskStoreAddress,
                }),
              });
            }
            case TASK_STORE_UNREGISTERED: {
              const tasks = Object.assign({}, domainTasks);
              if (tasks && tasks[domainId] && tasks[domainId][taskId]) {
                delete tasks[domainId][taskId];
              }
              return tasks;
            }
            default:
              return domainTasks;
          }
        },
        {},
      );
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
      .filter(({ type: eventType }) => eventType === DOMAIN_CREATED)
      .map(({ payload: { domainId, name } }: DomainCreatedEvent) => ({
        id: domainId,
        name,
      }));
  },
});
