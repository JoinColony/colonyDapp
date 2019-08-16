import { Address } from '~types/index';
import { ColonyEvents } from './ColonyEvents';
import { TaskEvents } from './TaskEvents';
import { UserEvents } from './UserEvents';
import { UserProfileEvents } from './UserProfileEvents';

/*
 * Object type the definition of an event.
 *
 * T: String type for the event type, e.g. `DUE_DATE_SET`.
 * P: Object type representing the payload properties (technically optional).
 */
export interface EventDefinition<T extends AllEvents['type'], P> {
  meta: {
    id: string;
    timestamp: number;
    userAddress: Address;
    version: number;
  };
  payload: P;
  type: T;
}

export type AllEvents =
  | ColonyEvents
  | TaskEvents
  | UserEvents
  | UserProfileEvents;

export type Event<T extends AllEvents['type']> = Extract<
  AllEvents,
  { type: T }
>;
