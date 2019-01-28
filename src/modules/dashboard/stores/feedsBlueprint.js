/* @flow */

import * as yup from 'yup';

import { FeedStore } from '../../../lib/database/stores';

import type { StoreBlueprint } from '~types';

const commentsBlueprint: StoreBlueprint = {
  name: 'feeds',
  schema: yup.object({
    content: yup.object({
      id: yup.string().required(),
      author: yup
        .string()
        .address()
        .required(),
      timestamp: yup.date().default(() => Date.now()),
      metadata: yup
        .object({
          rating: yup.number().required(),
        })
        .required(),
    }),
  }),
  type: FeedStore,
};

export default commentsBlueprint;
