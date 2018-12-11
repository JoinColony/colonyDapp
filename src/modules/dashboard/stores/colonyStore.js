/* @flow */

import * as yup from 'yup';

import { KVStore } from '../../../lib/database/stores';

import type { StoreBlueprint } from '~types';

const colonyStore: StoreBlueprint = {
  // TODO: implement
  /* $FlowFixMe */
  getAccessController() {
    return {
      canAppend() {
        return Promise.resolve(true);
      },
      grant() {},
      revoke() {},
      save() {},
      setup() {
        return Promise.resolve(true);
      },
    };
  },
  name: 'colony',
  schema: yup.object({
    id: yup.number(),
    address: yup.string().address(),
    ensName: yup.string(),
    name: yup.string(),
    description: yup.string(),
    website: yup.string().url(),
    guideline: yup.string().url(),
    // TODO: IPFS hash add yup validation for IPFS hash
    avatar: yup.string(),
    token: yup.object({
      address: yup.string().address(),
      icon: yup.string(),
      name: yup.string(),
      symbol: yup.string(),
    }),
    rootDomain: yup.string(),
  }),
  type: KVStore,
};

export default colonyStore;
