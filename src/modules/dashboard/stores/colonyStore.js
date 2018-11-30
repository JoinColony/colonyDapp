/* @flow */

import * as yup from 'yup';

import { KVStore } from '../../../lib/database/stores';

const colonyStore = {
  // TODO: implement
  getAccessController() {},
  name: 'colony',
  schema: yup.object({
    colonyId: yup.number(),
    colonyAddress: yup.string().address(),
    colonyName: yup.string(),
    tokenAddress: yup.string().address(),
    tokenName: yup.string(),
    tokenSymbol: yup.string(),
    tokenIcon: yup.string(),
  }),
  type: KVStore,
};

export default colonyStore;
