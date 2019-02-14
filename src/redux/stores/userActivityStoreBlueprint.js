/* @flow */

import * as yup from 'yup';

import type { StoreBlueprint } from '~types';

import { FeedStore } from '../../lib/database/stores';

import { activityMessages } from '../../components/UserActivities';

// @TODO: This shouldn't be duplicated
const userActivityStoreBlueprint: StoreBlueprint = {
  name: 'userActivity',
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

export default userActivityStoreBlueprint;
