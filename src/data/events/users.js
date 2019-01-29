/* @flow */
/* eslint-disable import/prefer-default-export */

import type {
  EventCreator,
  NotificationsReadUntilEventArgs,
  NotificationsReadUntilEventPayload,
} from './types';

import { decoratePayload } from './utils';
import { USER_EVENT_TYPES } from '../constants';

const { READ_UNTIL } = USER_EVENT_TYPES;

// @TODO add payload validation here like we had in beta events
export const createNotificationsReadEvent: EventCreator<
  NotificationsReadUntilEventArgs,
  NotificationsReadUntilEventPayload,
> = ({ watermark, exceptFor }) => ({
  type: READ_UNTIL,
  payload: decoratePayload<NotificationsReadUntilEventPayload>({
    watermark,
    exceptFor,
  }),
});
