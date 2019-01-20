/* @flow */

import * as yup from 'yup';

import type { StoreBlueprint } from '~types';

import { ValidatedKVStore } from '../../lib/database/stores';
import { EthereumWalletAccessController } from '../../lib/database/accessControllers';

type StoreProps = {
  walletAddress: string,
};

const userProfileStore: StoreBlueprint = {
  // TODO: I don't want to assign a default value here. Ideas on how to fix flow, anyone?
  getAccessController({ walletAddress }: StoreProps = {}) {
    return new EthereumWalletAccessController(walletAddress);
  },
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
