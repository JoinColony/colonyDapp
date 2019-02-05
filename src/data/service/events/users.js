/* @flow */
/* eslint-disable import/prefer-default-export */

import type { Event, EventCreator, EventPayload } from '../types';

import { decoratePayload } from './utils';
import { USER_EVENT_TYPES } from '../../constants';

const { READ_UNTIL } = USER_EVENT_TYPES;

export type NotificationsReadUntilEventArgs = {|
  watermark: string,
  exceptFor?: string[],
|};
export type NotificationsReadUntilEventPayload = EventPayload &
  NotificationsReadUntilEventArgs;
export type NotificationsReadUntilEvent = Event<
  typeof READ_UNTIL,
  NotificationsReadUntilEventPayload,
>;

// @TODO add payload validation here like we had in beta events
export const createNotificationsReadEvent: EventCreator<
  NotificationsReadUntilEventArgs,
  NotificationsReadUntilEvent,
> = ({ watermark, exceptFor }) => ({
  type: READ_UNTIL,
  payload: decoratePayload<NotificationsReadUntilEventPayload>({
    watermark,
    exceptFor,
  }),
});
