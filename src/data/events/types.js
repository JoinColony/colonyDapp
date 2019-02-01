/* @flow */

export type EventTypeId = string;
export type EventPayload = {|
  id: string,
  timestamp: number,
  version: number,
|};

export type Event<T: EventTypeId, P: EventPayload> = {|
  type: T,
  payload: P,
|};

export type EventCreator<I: Object, O: Event<*, *>> = (args: I) => O;
