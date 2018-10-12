/* @flow */

import * as yup from 'yup';

import type { UserType } from '~types/user';

export type UserProfileType = UserType & {
  // colonies: profileColony[],
  // tasks: profileTask[],
};

// eslint-disable-next-line import/prefer-default-export
export const UserProfile = {
  displayName: yup.string(),
  bio: yup.string(),
  // TODO: IPFS hash add yup validation for IPFS hash
  avatar: yup.string(),
  // colonies: [],
  // tasks: [],
  walletAddress: yup
    .string()
    .address()
    .required(),
  // TODO: required?
  username: yup.string().required(),
  website: yup.string(),
  location: yup.string(),
};
