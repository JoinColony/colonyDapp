/* @flow */
/* eslint-disable flowtype/generic-spacing */

import * as yup from 'yup';

import type { CommandSpec } from '../../execution';

import { getENSDomainString } from '~utils/web3/ens';
import { getStore } from '../../application/stores';
import {
  colonyStoreBlueprint,
  domainsIndexStoreBlueprint,
} from '../../../modules/dashboard/stores';
import { getDomainsStoreAddress } from '../queries/colony';

const getColonyStore = async ({ ddb, colonyENSName, walletAddress }) => {
  const nameHash = getENSDomainString('colony', colonyENSName);
  return getStore(ddb)(colonyStoreBlueprint, nameHash, {
    walletAddress,
  });
};

// Not really used, but exploring using a query
const getDomainsStore = async ({ ddb, colonyStore, walletAddress }) => {
  const domainsStoreAddress = await getDomainsStoreAddress(colonyStore);
  return getStore(ddb)(domainsIndexStoreBlueprint, domainsStoreAddress, {
    walletAddress,
  });
};

// examples
// colonyStore
const addTaskStoreEvent = {
  type: 'ADD_TASK_STORE',
  payload: {
    domainId,
    taskId,
    taskStore,
  },
};
// taskStore
const addWorkRequestEvent = {
  type: 'ADD_WORK_REQUEST',
  payload: {
    taskId,
    workRequest,
  },
};
const updateTitleEvent = {
  type: 'UPDATE_TITLE',
  payload: {
    taskId,
    title,
  },
};

export const createTask: CommandSpec<
  {
    ddb: *,
  },
  {
    colonyENSName: *,
    domainId: *,
    taskId: *,
    walletAddress: *,
  },
> = {
  //
  async execute(
    { ddb }: *,
    { taskId, domainId, colonyENSName, walletAddress }: *,
  ) {
    // get colony store
    const colonyStore = await getColonyStore({
      colonyENSName,
      ddb,
      walletAddress,
    });

    // Create a task store (idempotent)
    const taskStore = await createTaskStore({
      colonyENSName,
      ddb,
      domainId,
      taskId,
    });

    // Add event to colony store: added this domain with this taskStore
    await append(colonyStore, {
      type: 'ADD_TASK_STORE',
      payload: {
        taskId,
        domainId,
        taskStore: taskStore.address.toString(),
      },
    });
  },
};
