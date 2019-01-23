/* @flow */
/* eslint-disable flowtype/generic-spacing */

import * as yup from 'yup';

import type { ENSName } from '~types';
import type { EventCommandSpec, CommandSpec, QuerySpec } from '../../execution';

import { eventCommandExecutor, executeCommand } from '../../execution';
import { createStore, getStore } from '../../application/stores';

// TODO
import { getDomainsStoreAddress } from '../queries/colony';

type EventStore = {};

const ADD_DOMAINS_STORE_REFERENCE = 'ADD_DOMAINS_STORE_REFERENCE';
const DOMAINS_STORE_ADD_DOMAIN = 'DOMAINS_STORE_ADD_DOMAIN';

// service commands
const addDomainsStoreReference: EventCommandSpec<{
  colonyENSName: ENSName,
  colonyStore: EventStore,
  domainsStore: EventStore,
}> = {
  type: ADD_DOMAINS_STORE_REFERENCE,
  isUnique: true,
  getPayload({ colonyENSName, domainsStore }) {
    return {
      colonyENSName,
      domainsStore: domainsStore.address.toString(),
    };
  },
};

export const addTasksStoreReference: EventCommandSpec<{
  colonyENSName: ENSName,
  domainsStore: EventStore,
  tasksStore: EventStore,
}> = {
  type: ADD_DOMAINS_STORE_REFERENCE,
  isUnique: true,
  getPayload({ colonyENSName, tasksStore }) {
    return {
      colonyENSName,
      tasksStore: tasksStore.address.toString(),
    };
  },
};

export const createDomainsStore: CommandSpec<{
  colonyENSName: ENSName,
  colonyStore: EventStore,
}> = {
  blueprint: {},
  schema: yup.object({
    colonyENSName: yup.string.required(),
    colonyStore: yup.store().required(),
    ddb: yup.object().required(),
  }),
  async execute({ ddb, colonyENSName, colonyStore }) {
    const domainsStore = await createStore(ddb)(this.blueprint, {
      colonyENSName,
    });
    await executeCommand(addDomainsStoreReference, {
      colonyENSName,
      colonyStore,
      domainsStore,
    });
    return domainsStore;
  },
};

export const createTasksStore: CommandSpec<{
  colonyENSName: ENSName,
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

export const addDomainToDomainsStore: EventCommandSpec<{
  domainId: string,
  domainName: string,
  domainsStore: EventStore,
  tasksStore: EventStore,
}> = {
  type: DOMAINS_STORE_ADD_DOMAIN,
  executor: eventCommandExecutor,
  isUnique: true,
  schema: yup.object({
    domainId: yup.number().required(),
    domainName: yup.string().required(),
    domainsStore: yup.store().required(),
    tasksStore: yup.store().required(),
  }),
  getPayload({ tasksStore, domainId, domainName }: *) {
    return {
      domainId,
      domainName,
      tasksStore: tasksStore.address.toString(),
    };
  },
  getStore({ domainsStore }: *) {
    return domainsStore;
  },
};
