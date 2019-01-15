/* @flow */

import * as yup from 'yup';

import { ValidatedKVStore } from '../../../lib/database/stores';

import type { StoreBlueprint } from '~types';

const colonyStoreBlueprint: StoreBlueprint = {
  // TODO: add access controller
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
    admins: yup.object(),
    databases: yup.object({
      domainsIndex: yup.string(),
    }),
  }),
  type: ValidatedKVStore,
};

export default colonyStoreBlueprint;
