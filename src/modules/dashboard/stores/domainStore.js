/* @flow */

import * as yup from 'yup';

import { KVStore } from '../../../lib/database/stores';

import type { StoreBlueprint } from '~types';

const domainStore: StoreBlueprint = {
  // TODO: implement
  getAccessController() {},
  name: 'domain',
  schema: yup.object({
    meta: yup.object({
      id: yup.number(),
      address: yup.string().address(),
      ensName: yup.string(),
    }),
    name: yup.string(),
    tasksDatabase: yup.string(),
  }),
  type: KVStore,
};

export default domainStore;
