/* @flow */

import * as yup from 'yup';

import { DocStore } from '../../lib/database/stores';
import { colonyMeta } from './meta';

import type { StoreBlueprint } from '~types';

const domainsIndexStoreBlueprint: StoreBlueprint = {
  // TODO: add access controller
  name: 'domainsIndex',
  schema: yup.object({
    meta: colonyMeta,
    doc: yup.object({
      name: yup.string(),
      databases: yup.object({
        tasksIndex: yup.string(),
      }),
    }),
  }),
  type: DocStore,
};

export default domainsIndexStoreBlueprint;
