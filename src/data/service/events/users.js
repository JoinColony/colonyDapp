/* @flow */

import { createEventCreator } from '../../utils';
import { USER_EVENT_TYPES } from '../../constants';
import { CreateNotificationsReadUntilEventSchema } from './schemas';

const {
  READ_UNTIL,
  SUBSCRIBED_TO_TASK,
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
