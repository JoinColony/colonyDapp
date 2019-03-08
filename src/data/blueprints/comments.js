/* @flow */

import type { StoreBlueprint } from '~types/index';

import * as yup from 'yup';
import { FeedStore } from '../../lib/database/stores';
import { getPermissiveStoreAccessController } from '../accessControllers';

const commentsStore: StoreBlueprint = {
  getAccessController: getPermissiveStoreAccessController,
  name: 'comments',
  schema: yup.object({
    signature: yup.string().required(),
    content: yup.object({
      id: yup.string().required(),
      author: yup
        .string()
        .address()
        .required(),
      timestamp: yup.date().default(() => Date.now()),
      body: yup.string().required(),
      metadata: yup.object({
        /*
         * TODO When the time is right, add attachments
         */
        mentions: yup.array().of(yup.string().required()),
      }),
    }),
  }),
  type: FeedStore,
};

export default commentsStore;
