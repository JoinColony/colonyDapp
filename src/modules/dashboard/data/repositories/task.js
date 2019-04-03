/* @flow */

import type { Event } from '~data/types';

import { TASK_EVENT_TYPES } from '~data/constants';
import { taskReducer } from '../reducers';

const { COMMENT_POSTED } = TASK_EVENT_TYPES;

export default class TaskRepository {
  constructor({ taskStore, commentsStore }) {
    this.taskStore = taskStore;
    this.commentsStore = commentsStore;
  }

  async getTask() {
    return this.taskStore
      .all()
      .filter(({ type: eventType }) => TASK_EVENT_TYPES[eventType])
      .reduce(taskReducer, {
        // TODO get these defaults from some model elsewhere? See #965
        amountPaid: undefined,
        commentsStoreAddress: '', // XXX Just to appease flow; it'll be there
        createdAt: undefined,
        creator: undefined,
        description: undefined,
        domainId: undefined,
        draftId: '', // XXX Just to appease flow; it'll be there
        dueDate: undefined,
        finalizedAt: undefined,
        invites: [],
        paymentId: undefined,
        payout: undefined,
        paymentToken: undefined,
        requests: [],
        skillId: undefined,
        status: undefined,
        title: undefined,
        worker: undefined,
      });
  }

  async getComments() {
    return this.commentsStore
      .all()
      .filter(({ type }) => type === COMMENT_POSTED)
      .map(({ payload }: Event<typeof COMMENT_POSTED>) => payload);
  }
}
