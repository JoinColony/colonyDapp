/* @flow */

import * as yup from 'yup';

import { FeedStore } from '../../../lib/database/stores';

import type { StoreBlueprint } from '~types';

const draftStore: StoreBlueprint = {
  // TODO: implement
  getAccessController() {},
  name: 'draft',
  schema: yup.object({
    id: yup.number(),
    title: yup.string(),
    specHash: yup.string(),
    dueDate: yup.date(),
    domainName: yup.string(),
    colonyName: yup.string(),
    creator: yup.string(),
    assignee: yup.string(),
  }),
  type: FeedStore,
};

export default draftStore;
