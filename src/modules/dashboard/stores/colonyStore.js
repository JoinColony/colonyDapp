/* @flow */

import * as yup from 'yup';

import { KVStore } from '../../../lib/database/stores';

import type { StoreBlueprint } from '~types';

const colonyStore: StoreBlueprint = {
  // TODO: implement
  getAccessController() {},
  name: 'colony',
  schema: yup.object({
    id: yup.number(),
    address: yup.string().address(),
    ensName: yup.string(),
    name: yup.string(),
    token: yup.object({
      address: yup.string().address(),
      icon: yup.string(),
      name: yup.string(),
      symbol: yup.string(),
    }),
  }),
  type: KVStore,
};

export default colonyStore;
