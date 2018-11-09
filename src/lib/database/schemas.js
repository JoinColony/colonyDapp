/* @flow */

import * as yup from 'yup';
import messages from '../../types/ActivityMessages';

// eslint-disable-next-line import/prefer-default-export
export const UserProfile = yup.object({
  displayName: yup.string(),
  bio: yup.string(),
  // TODO: IPFS hash add yup validation for IPFS hash
  avatar: yup.string(),
  walletAddress: yup.string().address(),
  // TODO: yup validation for orbit address
  orbitAddress: yup.string(),
  username: yup.string(),
  website: yup.string().url(),
  location: yup.string(),
});

export const UserActivity = yup.object({
  userAction: yup
    .object()
    .shape(messages)
    .noUnknown()
    .required(),
  colonyName: yup.string().required(),
  domainName: yup.string(),
  createdAt: yup.date().default(() => new Date()),
});
