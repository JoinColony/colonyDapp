/* @flow */
/* eslint-disable import/prefer-default-export */

import type { Event } from '../../types';

import { createEventCreator } from '../../utils';
import { USER_EVENT_TYPES } from '../../constants';
import { CreateNotificationsReadUntilEventSchema } from './schemas';

const {
  READ_UNTIL,
  SUBSCRIBED_TO_TASK,
  UNSUBSCRIBED_FROM_TASK,
} = USER_EVENT_TYPES;

export type NotificationsReadUntilEventArgs = {|
  readUntil: string,
  exceptFor?: string[],
|};
export type NotificationsReadUntilEventPayload = NotificationsReadUntilEventArgs;
export type NotificationsReadUntilEvent = Event<
  typeof READ_UNTIL,
  NotificationsReadUntilEventPayload,
>;

export type SubscribedToTaskEventArgs = {|
  taskId: string,
|};
export type SubscribedToTaskEventPayload = SubscribedToTaskEventArgs;
export type SubscribedToTaskEvent = Event<
  typeof SUBSCRIBED_TO_TASK,
  SubscribedToTaskEventPayload,
>;

export type UnsubscribedFromTaskEventArgs = {|
  taskId: string,
|};
export type UnsubscribedFromTaskEventPayload = UnsubscribedFromTaskEventArgs;
export type UnsubscribedFromTaskEvent = Event<
  typeof UNSUBSCRIBED_FROM_TASK,
  UnsubscribedFromTaskEventPayload,
>;

export const createNotificationsReadEvent = createEventCreator<
  typeof READ_UNTIL,
  NotificationsReadUntilEventArgs,
  NotificationsReadUntilEvent,
>(READ_UNTIL, CreateNotificationsReadUntilEventSchema);

export const createSubscribeToTaskEvent = createEventCreator<
  typeof SUBSCRIBED_TO_TASK,
  SubscribedToTaskEventArgs,
  SubscribedToTaskEvent,
>(SUBSCRIBED_TO_TASK);

export const createUnsubscribeToTaskEvent = createEventCreator<
  typeof UNSUBSCRIBED_FROM_TASK,
  UnsubscribedFromTaskEventArgs,
  UnsubscribedFromTaskEvent,
>(UNSUBSCRIBED_FROM_TASK);
