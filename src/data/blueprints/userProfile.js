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
    metadataStoreAddress: yup
      .string()
      .orbitDBAddress()
      .required(),
    inboxStoreAddress: yup
      .string()
      .orbitDBAddress()
      .required(),
  }),
  type: ValidatedKVStore,
});

export default userProfileStore;
