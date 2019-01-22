/* @flow */

import * as yup from 'yup';

import { FeedStore } from '../../../lib/database/stores';

import type { StoreBlueprint } from '~types';

const commentsBlueprint: StoreBlueprint = {
  /*
   * @TODO Need access controller
   */
  name: 'comments',
  schema: yup.object({
    id: yup.number(),
    creator: yup.string(),
    createdAt: yup.date().default(() => new Date()),
    data: yup.string(),
  }),
  type: FeedStore,
};

export default commentsBlueprint;
