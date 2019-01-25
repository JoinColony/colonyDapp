/* @flow */

import type { StoreBlueprint } from '~types';

import * as yup from 'yup';
import { ValidatedKVStore } from '../../lib/database/stores';
import { getEthereumWalletStoreAccessController } from '../accessControllers';

const userProfileStore: StoreBlueprint = {
  getAccessController: getEthereumWalletStoreAccessController,
  name: 'userProfile',
  schema: yup.object({
    displayName: yup.string(),
    createdAt: yup.date(),
    bio: yup.string(),
    // TODO: IPFS hash add yup validation for IPFS hash
    avatar: yup.string(),
    walletAddress: yup.string().address(),
    // TODO: yup validation for orbit address
    username: yup.string(),
    website: yup.string().url(),
    location: yup.string(),
    metadataStoreAddress: yup.string(),
    activitiesStoreAddress: yup.string(),
    inboxStoreAddress: yup.string(),
  }),
  type: ValidatedKVStore,
};

export default userProfileStore;
