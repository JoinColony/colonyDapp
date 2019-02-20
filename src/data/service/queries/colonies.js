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
import type { DomainCreatedEvent, TaskStoreCreatedEvent } from '../events';

import { getColonyStore } from '../../stores';
import { COLONY_EVENT_TYPES } from '../../constants';

const {
  AVATAR_REMOVED,
  AVATAR_UPLOADED,
  DOMAIN_CREATED,
  PROFILE_UPDATED,
  PROFILE_CREATED,
  TASK_STORE_CREATED,
  TOKEN_INFO_ADDED,
} = COLONY_EVENT_TYPES;

export type ColonyQueryContext = Context<
  {|
    colonyENSName: string | ENSName,
    colonyAddress: Address,
  |},
  ColonyClientContext & DDBContext & WalletContext,
>;

export type ColonyQuery<I: *, R: *> = Query<ColonyQueryContext, I, R>;

// @TODO Add typing for query results
export const getColony: ColonyQuery<*, *> = ({
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
            case TOKEN_INFO_ADDED: {
              return {
                ...colony,
                token: payload,
              };
            }
            case AVATAR_UPLOADED: {
              const { ipfsHash, avatar } = payload;
              return {
                ...colony,
                avatar: {
                  ipfsHash,
                  avatar,
                },
              };
            }
            case AVATAR_REMOVED: {
              const { avatar } = colony;
              const { ipfsHash } = payload;
              return {
                ...colony,
                avatar: avatar && avatar.ipfsHash === ipfsHash ? null : avatar,
              };
            }
            case PROFILE_CREATED: {
              return {
                ...colony,
                profile: payload,
              };
            }
            case PROFILE_UPDATED: {
              const { profile } = colony;
              return {
                ...colony,
                profile: Object.assign({}, profile, payload),
              };
            }

            default:
              return colony;
          }
        },
        { avatar: null, profile: {}, token: {} },
      );
  },
});

export const getColonyAvatar: ColonyQuery<*, *> = ({
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
            case AVATAR_REMOVED: {
              return null;
            }

            default:
              return colony;
          }
        },
        null,
      );
  },
});

// @NOTE: This is a separate query so we can, later on, cache the query result
export const getColonyTasks: ColonyQuery<*, *> = ({
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
      .filter(({ type: eventType }) => eventType === TASK_STORE_CREATED)
      .reduce(
        (
          domainTasks,
          {
            payload: { domainId, draftId, taskStoreAddress },
          }: TaskStoreCreatedEvent,
        ) =>
          Object.assign({}, domainTasks, {
            [domainId]: Object.assign({}, domainTasks[domainId], {
              [draftId]: taskStoreAddress,
            }),
          }),
        {},
      );
  },
});

export const getColonyDomains: ColonyQuery<*, *> = ({
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
      .filter(({ type: eventType }) => eventType === DOMAIN_CREATED)
      .reduce(
        (domains, { payload: { domainId, name } }: DomainCreatedEvent) =>
          Object.assign({}, domains, {
            [domainId]: { domainId, name },
          }),
        {},
      );
  },
});
