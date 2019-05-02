/* @flow */

import type { StoreBlueprint } from '~types';

import * as yup from 'yup';
import { ValidatedKVStore } from '../../lib/database/stores';
import { getEthereumWalletStoreAccessController } from '../accessControllers';

const userProfileStore: StoreBlueprint = Object.freeze({
  getAccessController: getEthereumWalletStoreAccessController,
  defaultName: 'userProfile',
  schema: yup.object({
    displayName: yup.string(),
    createdAt: yup.number(),
    bio: yup.string(),
    avatarHash: yup
      .string()
      .cid()
      .nullable(),
    walletAddress: yup.string().address(),
    username: yup.string(),
    website: yup.string().url(),
    location: yup.string(),
    /*
     * The store address fields are required for the store, but
     * since we want to set fields invididually, we cannot mark them
     * as such. Ideal solution: make this store an EventStore #1228
     */
    metadataStoreAddress: yup.string().orbitDBAddress(),
    inboxStoreAddress: yup.string().orbitDBAddress(),
  }),
  type: ValidatedKVStore,
});

export default userProfileStore;
