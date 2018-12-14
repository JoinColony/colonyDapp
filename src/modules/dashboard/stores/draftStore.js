/* @flow */

import * as yup from 'yup';

import { DocStore } from '../../../lib/database/stores';

import type { StoreBlueprint } from '~types';

const draftStore: StoreBlueprint = {
  // TODO: implement
  getAccessController() {},
  name: 'draft',
  schema: yup.object({
    id: yup.number(),
    title: yup.string().required(),
    creator: yup.string().required(),
    specHash: yup.string(),
    dueDate: yup.date(),
    domainName: yup.string(),
    colonyName: yup.string().required(),
    assignee: yup.string(),
  }),
  type: DocStore,
};

export default draftStore;
