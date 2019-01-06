/* @flow */

import * as yup from 'yup';

import { DocStore } from '../../../lib/database/stores';
import { colonyMeta } from './meta';

import type { StoreBlueprint } from '~types';

const domainsIndexStoreBlueprint: StoreBlueprint = {
  // TODO: implement
  // eslint-disable-next-line no-unused-vars
  getAccessController(storeProps?: *) {
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
        return '';
      },
      async setup() {
        return undefined;
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

export default domainsIndexStoreBlueprint;
