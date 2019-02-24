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

import { getFilterFromPartial } from '~utils/web3/eventLogs';

import type { ColonyType, DomainType } from '~immutable';

import type {
  DomainCreatedEvent,
  TaskStoreRegistered,
  TaskStoreUnregistered,
} from '../events';

import { getColonyStore } from '../../stores';
import { COLONY_EVENT_TYPES } from '../../constants';

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

export type ColonyQueryContext = Context<
  {|
    colonyENSName: string | ENSName,
    colonyAddress: Address,
  |},
  ColonyClientContext & DDBContext & WalletContext,
>;

export type ColonyContractEventQuery<I: *, R: *> = Query<
  ColonyClientContext,
  I,
  R,
>;

export type ColonyQuery<I: *, R: *> = Query<ColonyQueryContext, I, R>;

export const getColonyAdmins: ColonyContractEventQuery<
  void,
  $PropertyType<ColonyType, 'admins'>,
> = ({ colonyClient }) => ({
  async execute() {
    const {
      // $FlowFixMe will be fixed in next colonyJS version
      ColonyAdminRoleSet: { eventName: COLONY_ADMIN_SET_EVENT },
      ColonyAdminRoleRemoved: { eventName: COLONY_ADMIN_REMOVED_EVENT },
    } = colonyClient.events;
    const eventNames = [COLONY_ADMIN_SET_EVENT, COLONY_ADMIN_REMOVED_EVENT];

    // Will contain to/from block and event name topics
    const baseLog = await getFilterFromPartial(
      // TODO use a more meaningful value for blocksBack
      { eventNames, blocksBack: 400000 },
      colonyClient,
    );

    // Get logs + events for role assignment
    const removedAdminLogs = await colonyClient.getLogs({
      ...baseLog,
      // [eventNames, from, to]
      topics: [[COLONY_ADMIN_REMOVED_EVENT]],
    });
    const setAdminLogs = await colonyClient.getLogs({
      ...baseLog,
      // [eventNames, from, to]
      topics: [[COLONY_ADMIN_SET_EVENT]],
    });

    const removedAdmins = Array.from(
      new Set(...(removedAdminLogs.map(({ user }) => user) || [])),
    );
    return setAdminLogs
      .map(({ user }) => user)
      .filter(user => !removedAdmins.includes(user))
      .reduce(
        (users, user) => ({
          ...users,
          [user]: {
            // TODO get these values, ideally with another query
            displayName: '',
            profileStore: '',
            state: 'pending',
            username: '',
            walletAddress: user,
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
    const {
      // $FlowFixMe will be fixed in next colonyJS version
      ColonyAdminRoleSet: { eventName: COLONY_FOUNDER_SET_EVENT },
    } = colonyClient.events;
    const eventNames = [COLONY_FOUNDER_SET_EVENT];

    // Will contain to/from block and event name topics
    const baseLog = await getFilterFromPartial(
      // TODO use a more meaningful value for blocksBack
      { eventNames, blocksBack: 400000 },
      colonyClient,
    );

    // Get logs + events for founder role assignment
    const founderChangedLogs = await colonyClient.getLogs({
      ...baseLog,
      // [eventNames, from, to]
      topics: [[COLONY_FOUNDER_SET_EVENT]],
    });

    const [head] = founderChangedLogs
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

    const getAdminsQuery = getColonyAdmins({ colonyClient });
    const admins = await getAdminsQuery.execute();
    // @TODO: Include `founder` to ColonyType
    // const getFounderQuery = getColonyFounder({ colonyClient });
    // const founder = await getFounderQuery.execute();

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
          ensName: colonyENSName,
          address: colonyAddress,
          name: '',
          avatar: undefined,
          admins,
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
