/* @flow */

import * as yup from 'yup';

import type { StoreBlueprint } from '~types/index';

import { FeedStore } from '../../../lib/database/stores';
import { EthereumWalletAccessController } from '../../../lib/database/accessControllers';
import { activityMessages } from '../../dashboard/components/UserActivities';

type StoreProps = {
  walletAddress: string,
};

const userActivitiesStore: StoreBlueprint = {
  // TODO: I don't want to assign a default value here. Ideas on how to fix flow, anyone?
  getAccessController({ walletAddress }: StoreProps = {}) {
    return new EthereumWalletAccessController(walletAddress);
  },
  name: 'userActivities',
  schema: yup.object({
    userAction: yup
      .string()
      .oneOf(Object.keys(activityMessages))
      .required(),
    colonyName: yup.string().required(),
    domainName: yup.string(),
    createdAt: yup.date().default(() => new Date()),
  }),
  type: FeedStore,
};

export default userActivitiesStore;
