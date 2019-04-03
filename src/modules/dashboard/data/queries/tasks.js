/* @flow */

import type { TaskQuery } from './types';

import { getCommentsStore, getTaskStore } from '~data/stores';
import { TaskRepository } from '../repositories';

const prepareTaskQuery = async ({ colonyClient, ddb, wallet, metadata }) => {
  const taskStore = await getTaskStore(colonyClient, ddb, wallet)(metadata);
  const commentsStore = await getCommentsStore(ddb)(metadata);
  return new TaskRepository({ taskStore, commentsStore });
};

export const getTask: TaskQuery<*, *> = ({
  ddb,
  colonyClient,
  wallet,
  metadata,
}) => ({
  async execute() {
    const taskRepository = await prepareTaskQuery({
      colonyClient,
      ddb,
      wallet,
      metadata,
    });
    return taskRepository.getTask();
  },
});

export const getTaskComments: TaskQuery<*, *> = ({
  colonyClient,
  ddb,
  wallet,
  metadata,
}) => ({
  async execute() {
    const taskRepository = await prepareTaskQuery({
      colonyClient,
      ddb,
      wallet,
      metadata,
    });
    return taskRepository.getComments();
  },
});
