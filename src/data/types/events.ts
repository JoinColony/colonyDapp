import { EventTypes, Versions } from '~data/constants';
import { Address } from '~types/index';
import { ColonyEvents } from './ColonyEvents';
import { TaskEvents } from './TaskEvents';
import { UserEvents } from './UserEvents';
import { UserProfileEvents } from './UserProfileEvents';

/*
 * The definition of an event object.
 *
 * T: String type for the event type, e.g. `DUE_DATE_SET`.
 * P: Object type representing the payload properties (technically optional).
 * V: Version number
 */
export interface EventDefinition<
  T extends EventTypes,
  P extends object | null,
  V extends Versions
> {
  readonly type: T;
  readonly payload: P;
  readonly meta: {
    readonly id: string;
    readonly timestamp: number;
    readonly userAddress: Address;
    readonly version: V;
  };
}

export type AllEvents =
  | ColonyEvents
  | TaskEvents
  | UserEvents
  | UserProfileEvents;

export type Event<T extends EventTypes> = Extract<
  AllEvents,
  { type: T; payload: any; meta: any }
>;

export type VersionedEvent<V extends Versions, T extends EventTypes> = Extract<
  Event<T>,
  { meta: { version: V } }
>;

export type AllCurrentEvents = Extract<
  AllEvents,
  {
    meta: { version: Versions.CURRENT };
  }
>;
