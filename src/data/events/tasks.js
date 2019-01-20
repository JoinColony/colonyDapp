/* @flow */

import { TASK_EVENT_TYPES } from '../constants';

const { COMMENT_STORE_CREATED } = TASK_EVENT_TYPES;

// @TODO add payload validation here like we had in beta events
// eslint-disable-next-line import/prefer-default-export
export const createCommentStoreCreatedEvent = ({
  commentsStoreAddress,
  taskId,
}: {
  commentsStoreAddress: string,
  taskId: string,
}) => ({
  type: COMMENT_STORE_CREATED,
  payload: { commentsStoreAddress, taskId },
});
