/* @flow */

import * as yup from 'yup';

import type { StoreBlueprint } from '~types/index';

import { FeedStore } from '../../lib/database/stores';

const commentsStore: StoreBlueprint = {
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
        attachments: yup.array().of(
          yup.object({
            ipfsHash: yup.string().required(),
            filename: yup.string().required(),
            type: yup.string().required(),
            size: yup.number().min(1),
          }),
        ),
        mentions: yup.array().of(yup.string().required()),
      }),
    }),
  }),
  type: FeedStore,
};

export default commentsStore;
