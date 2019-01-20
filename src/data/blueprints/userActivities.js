/* @flow */

import * as yup from 'yup';

import type { StoreBlueprint } from '~types/index';

import { FeedStore } from '../../lib/database/stores';
import { EthereumWalletAccessController } from '../../lib/database/accessControllers';

type StoreProps = {
  walletAddress: string,
};

const userActivitiesStore: StoreBlueprint = {
  getAccessController({ walletAddress }: StoreProps = {}) {
    return new EthereumWalletAccessController(walletAddress);
  },
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
