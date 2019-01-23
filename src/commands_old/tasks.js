/* @flow */
/* eslint-disable flowtype/generic-spacing */

import * as yup from 'yup';

import type { EventCommandSpec, CommandSpec } from '../../execution';

import { eventCommandExecutor } from '../../execution';
import { getStore, createStore } from '../../application/stores';

const ADD_TASK_TO_TASKS_STORE = 'ADD_TASK_TO_TASKS_STORE';
const ADD_TASKS_STORE_REFERENCE = 'ADD_TASKS_STORE_REFERENCE';

const addTasksStoreReference: EventCommandSpec<{
  colonyENSName: ENSName,
  domainsStore: EventStore,
  tasksStore: EventStore,
}> = {
  type: ADD_TASKS_STORE_REFERENCE,
  isUnique: true,
  getPayload({ colonyENSName, tasksStore }) {
    return {
      colonyENSName,
      tasksStore: tasksStore.address.toString(),
    };
  },
  getStore({ tasksStore }: *) {
    return tasksStore;
  },
};

export const addTaskToTasksStore: EventCommandSpec<{
  taskId: string,
  taskStore: EventStore,
  tasksStore: EventStore,
}> = {
  executor: eventCommandExecutor,
  type: ADD_TASK_TO_TASKS_STORE,
  isUnique: true,
  schema: yup.object({
    taskId: yup.string().required(),
    taskStore: yup.store().required(),
    tasksStore: yup.store().required(),
  }),
  getPayload({ taskStore, taskId }: *) {
    return {
      taskId,
      taskStore: taskStore.address.toString(),
    };
  },
  getStore({ domainsStore }: *) {
    return domainsStore;
  },
};

export const createTasksStore: CommandSpec<{
  colonyENSName: ENSName,
  ddb: DDB,
}> = {
  schema: yup.object({
    colonyENSName: yup.string.required(),
    ddb: yup.object().required(),
  }),
  async execute({ colonyENSName, ddb }: *) {
    return createStore(ddb)(this.blueprint, {
      colonyENSName,
    });
  },
};

export const getTasksStore: CommandSpec<{
  colonyENSName: ENSName,
  ddb: DDB,
  tasksStoreAddress: string,
}> = {
  schema: yup.object({
    colonyENSName: yup.string.required(),
    ddb: yup.object().required(),
    tasksStoreAddress: yup.string().required(),
  }),
  async execute({ colonyENSName, ddb, tasksStoreAddress }: *) {
    return getStore(ddb)(this.blueprint, tasksStoreAddress, {
      colonyENSName,
    });
  },
};
