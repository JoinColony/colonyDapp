/* @flow */

import * as yup from 'yup';

// eslint-disable-next-line import/prefer-default-export
export const UserProfile = yup.object({
  displayName: yup.string(),
  bio: yup.string(),
  // TODO: IPFS hash add yup validation for IPFS hash
  avatar: yup.string(),
  walletAddress: yup
    .string()
    .address()
    .required(),
  // TODO: required?
  username: yup.string().required(),
  website: yup.string(),
  location: yup.string(),
});
