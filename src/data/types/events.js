/* @flow */

// eslint-disable-next-line no-unused-vars
import type { $Pick } from '~types';

import type { ColonyEvents } from './ColonyEvents';
import type { TaskEvents } from './TaskEvents';
import type { UserEvents } from './UserEvents';

import {
  COLONY_EVENT_TYPES,
  TASK_EVENT_TYPES,
  USER_EVENT_TYPES,
} from '../constants';

// eslint-disable-next-line no-unused-vars
const ALL_EVENT_TYPES = Object.freeze({
  ...COLONY_EVENT_TYPES,
  ...TASK_EVENT_TYPES,
  ...USER_EVENT_TYPES,
});

/*
 * Object type the definition of an event.
 *
 * T: String type for the event type, e.g. `DUE_DATE_SET`.
 * P: Object type representing the payload properties (technically optional).
 */
export type EventDefinition<T: string, P: ?Object> = {|
  meta: {| timestamp: number, version: number, id: string |},
  payload: P,
  type: T,
|};

export type EventsType = {|
  ...ColonyEvents,
  ...TaskEvents,
  ...UserEvents,
|};

export type EventTypeString = $Keys<{|
  // XXX This is a workaround for the `createEventCreator` typing;
  // we need this to be an indexed object, but `EventsType` should not
  // have an indexer property because we need to check it against the
  // event types constant to make sure all event types match up.
  [eventType: string]: EventDefinition<*, *>,
  ...EventsType,
|}>;

/*
 * Type representing an already-defined event.
 *
 * T: String type for the event type, e.g. `DUE_DATE_SET`.
 */
export type Event<T: EventTypeString> = $ElementType<EventsType, T>;

/* eslint-disable */
/*::
// This bit of flow magic tests that EventsType has coverage for
// everything in ALL_EVENT_TYPES, and also that EventsType doesn't
// contain anything that ALL_EVENT_TYPES doesn't have.
type EventsTypesDiff = $Exact<
  $Diff<$Pick<typeof ALL_EVENT_TYPES, EventsType>, $Exact<typeof ALL_EVENT_TYPES>>,
>;
const diff: EventsTypesDiff = Object.freeze({}); // the diff should be empty
 */
/* eslint-enable */
