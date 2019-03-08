/* @flow */

import { USER_EVENT_TYPES } from '../constants';

import type { EventDefinition } from './events';

const {
  READ_UNTIL,
  SUBSCRIBED_TO_TASK,
  UNSUBSCRIBED_FROM_TASK,
} = USER_EVENT_TYPES;

export type UserEvents = {|
  READ_UNTIL: EventDefinition<
    typeof READ_UNTIL,
    {|
      readUntil: string,
      exceptFor?: string[],
    |},
  >,
  SUBSCRIBED_TO_TASK: EventDefinition<
    typeof SUBSCRIBED_TO_TASK,
    {|
      draftId: string,
    |},
  >,
  UNSUBSCRIBED_FROM_TASK: EventDefinition<
    typeof UNSUBSCRIBED_FROM_TASK,
    {|
      draftId: string,
    |},
  >,
|};
