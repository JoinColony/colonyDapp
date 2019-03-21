/* @flow */

import type { StoreBlueprint } from '~types/index';

import * as yup from 'yup';
import { FeedStore } from '../../lib/database/stores';
import { getPermissiveStoreAccessController } from '../accessControllers';

const userInboxStore: StoreBlueprint = {
  getAccessController: getPermissiveStoreAccessController,
  name: 'userInbox',
  schema: yup.object({
    userAction: yup
      .string()
      // TODO: Add inbox event type message validation
      // .oneOf(Object.keys(activityMessages))
      .required(),
    colonyName: yup.string(),
    domainName: yup.string(),
    createdAt: yup.date().default(() => new Date()),
  }),
  type: FeedStore,
};

export default userInboxStore;
