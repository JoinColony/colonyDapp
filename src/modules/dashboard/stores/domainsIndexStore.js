/* @flow */

import * as yup from 'yup';

import { DocStore } from '../../../lib/database/stores';
import { colonyMeta } from './meta';

import type { StoreBlueprint } from '~types';

const domainsIndexStore: StoreBlueprint = {
  // TODO: implement
  // eslint-disable-next-line no-unused-vars
  getAccessController(storeProps: Object) {
    return {
      async canAppend() {
        return true;
      },
      async grant() {
        return true;
      },
      async revoke() {
        return true;
      },
      async save() {
        return true;
      },
      async setup() {
        return true;
      },
    };
  },
  name: 'domainsIndex',
  schema: yup.object({
    meta: colonyMeta,
    doc: {
      name: yup.string(),
      databases: yup.object({
        tasksIndex: yup.string(),
      }),
    },
  }),
  type: DocStore,
};

export default domainsIndexStore;
