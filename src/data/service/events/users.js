/* @flow */
/* eslint-disable import/prefer-default-export */

import type { Event } from '../../types';

import { createEventCreator } from '../../utils';
import { USER_EVENT_TYPES } from '../../constants';
import { CreateNotificationsReadUntilEventSchema } from './schemas';

const { READ_UNTIL } = USER_EVENT_TYPES;

export type NotificationsReadUntilEventArgs = {|
  readUntil: string,
  exceptFor?: string[],
|};
export type NotificationsReadUntilEventPayload = NotificationsReadUntilEventArgs;
export type NotificationsReadUntilEvent = Event<
  typeof READ_UNTIL,
  NotificationsReadUntilEventPayload,
>;

export const createNotificationsReadEvent = createEventCreator<
  typeof READ_UNTIL,
  NotificationsReadUntilEventArgs,
  NotificationsReadUntilEvent,
>(READ_UNTIL, CreateNotificationsReadUntilEventSchema);
