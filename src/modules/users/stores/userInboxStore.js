/* @flow */

import * as yup from 'yup';

import type { StoreBlueprint } from '~types/index';

import { FeedStore } from '../../../lib/database/stores';

const userInboxStore: StoreBlueprint = {
  name: 'userInbox',
  schema: yup.object({
    userAction: yup
      .string()
      // @TODO: Add inbox event type message validation
      // .oneOf(Object.keys(activityMessages))
      .required(),
    colonyName: yup.string(),
    domainName: yup.string(),
    createdAt: yup.date().default(() => new Date()),
  }),
  type: FeedStore,
};

export default userInboxStore;
