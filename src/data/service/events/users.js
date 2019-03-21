/* @flow */

import { createEventCreator } from '../../utils';
import { USER_EVENT_TYPES } from '../../constants';
import { CreateNotificationsReadUntilEventSchema } from './schemas';

const {
  READ_UNTIL,
  SUBSCRIBED_TO_COLONY,
  SUBSCRIBED_TO_TASK,
  TOKEN_ADDED,
  UNSUBSCRIBED_FROM_COLONY,
  UNSUBSCRIBED_FROM_TASK,
} = USER_EVENT_TYPES;

export const createNotificationsReadEvent = createEventCreator<
  typeof READ_UNTIL,
>(READ_UNTIL, CreateNotificationsReadUntilEventSchema);

export const createSubscribeToTaskEvent = createEventCreator<
  typeof SUBSCRIBED_TO_TASK,
>(SUBSCRIBED_TO_TASK);

export const createUnsubscribeToTaskEvent = createEventCreator<
  typeof UNSUBSCRIBED_FROM_TASK,
>(UNSUBSCRIBED_FROM_TASK);

export const createSubscribeToColonyEvent = createEventCreator<
  typeof SUBSCRIBED_TO_COLONY,
>(SUBSCRIBED_TO_COLONY);

export const createUnsubscribeToColonyEvent = createEventCreator<
  typeof UNSUBSCRIBED_FROM_COLONY,
>(UNSUBSCRIBED_FROM_COLONY);

export const createUserAddTokenEvent = createEventCreator<typeof TOKEN_ADDED>(
  TOKEN_ADDED,
);

// TODO: createUserRemoveTokenEvent
