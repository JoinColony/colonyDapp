/* @flow */

import type { Event } from '~data/types';

import { COLONY_EVENT_TYPES } from '~data/constants';
import {
  colonyAvatarReducer,
  colonyReducer,
  colonyTasksReducer,
} from '../reducers';

const {
  DOMAIN_CREATED,
  TASK_STORE_REGISTERED,
  TASK_STORE_UNREGISTERED,
} = COLONY_EVENT_TYPES;

export default class ColonyRepository {
  constructor({ colonyStore }) {
    this.colonyStore = colonyStore;
  }

  async getColony() {
    return this.colonyStore
      .all()
      .filter(({ type: eventType }) => COLONY_EVENT_TYPES[eventType])
      .reduce(
        colonyReducer,
        // TODO: Add the right defaults here using a data model or something like that
        {
          colony: {
            avatar: undefined,
            name: '',
            tokens: {},
          },
          tokens: [],
        },
      );
  }

  async getAvatar() {
    return this.colonyStore
      .all()
      .filter(({ type: eventType }) => COLONY_EVENT_TYPES[eventType])
      .reduce(colonyAvatarReducer, null);
  }

  async getTasks() {
    return this.colonyStore
      .all()
      .filter(
        ({ type }) =>
          type === TASK_STORE_REGISTERED || type === TASK_STORE_UNREGISTERED,
      )
      .reduce(colonyTasksReducer, {});
  }

  async getDomains() {
    return this.colonyStore
      .all()
      .filter(({ type }) => type === DOMAIN_CREATED)
      .map(({ payload: { domainId, name } }: Event<typeof DOMAIN_CREATED>) => ({
        id: domainId,
        name,
      }));
  }
}
