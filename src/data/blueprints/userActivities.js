/* @flow */

import type { StoreBlueprint } from '~types';

import * as yup from 'yup';

import { FeedStore } from '../../lib/database/stores';
import { getEthereumWalletStoreAccessController } from '../accessControllers';

const userActivitiesStore: StoreBlueprint = {
  getAccessController: getEthereumWalletStoreAccessController,
  name: 'userActivities',
  schema: yup.object({
    userAction: yup.string().required(),
    colonyName: yup.string(),
    domainName: yup.string(),
    createdAt: yup.date().default(() => new Date()),
  }),
  type: FeedStore,
};

export default userActivitiesStore;
