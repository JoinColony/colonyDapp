/* @flow */

import * as yup from 'yup';

import type { IPFSHash } from './types';

export type UserProfileType = {
  name: string,
  bio: string,
  avatar: IPFSHash,
  // colonies: profileColony[],
  // tasks: profileTask[],
  walletAddress: string,
  ensName: string,
  website: string,
  location: string,
};

// eslint-disable-next-line import/prefer-default-export
export const UserProfile = {
  name: yup.string(),
  bio: yup.string(),
  // TODO: IPFS hash add yup validation for IPFS hash
  avatar: yup.string(),
  // colonies: [],
  // tasks: [],
  walletAddress: yup.string().address(),
  // TODO: required?
  username: yup.string(),
  website: yup.string(),
  location: yup.string(),
};
