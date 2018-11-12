/* @flow */

import * as yup from 'yup';

// eslint-disable-next-line max-len
import { activityMessages } from '../../modules/dashboard/components/UserActivities';

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
    .string()
    .oneOf(Object.keys(activityMessages))
    .required(),
  colonyName: yup.string().required(),
  domainName: yup.string(),
  createdAt: yup.date().default(() => new Date()),
});
