import pipe from 'lodash/fp/pipe';
import nanoid from 'nanoid';

import { EVENT_MIGRATIONS } from '~data/migrations';
import { Address } from '~types/strings';
import { EventTypes, Versions, VERSION } from './constants';
import { Entry, Event, VersionedEvent } from './types';

/**
 * Given an Event version, type and optional (depending on event type) payload,
 * return a versioned Event object.
 *
 * @param version {Versions} Event version
 * @param type {EventTypes} Event type
 * @param payload {object} Event payload
 * @return {VersionedEvent}
 */
export const createVersionedEvent = <V extends Versions, T extends EventTypes>(
  version: V,
  type: T,
  payload?: VersionedEvent<V, T>['payload'],
): VersionedEvent<V, T> =>
  ({
    type,
    payload: payload || null,
    meta: {
      id: nanoid(),
      timestamp: Date.now(),
      userAddress: '' as Address, // This will get set by the EventStore from the Orbit Entry
      version,
    },
  } as VersionedEvent<V, T>);

/**
 * Given an Event type and optional (depending on event type) payload,
 * return an Event object of the current version.
 *
 * @param type {EventTypes} Event type
 * @param payload {object} Event payload
 * @return {VersionedEvent}
 */
export const createEvent = <T extends EventTypes>(
  type: T,
  payload?: VersionedEvent<Versions.CURRENT, T>['payload'],
): VersionedEvent<Versions.CURRENT, T> =>
  createVersionedEvent(VERSION, type, payload);

/**
 * Parse an OrbitDB Entry object as a Colony Event object
 *
 * @param entry {Entry}
 * @return {Event<any>}
 */
const parseEntry = <E extends Event<any>>({
  identity: { id: userAddress },
  payload: {
    value: { meta, ...event },
  },
}: Entry): E => ({
  ...event,
  meta: {
    ...meta,
    userAddress,
  },
});

/**
 * Given an Event, if the event's version is less than the current version,
 * run all necessary migrations on that event and return the migrated event.
 *
 * @param event {Event<any>}
 * @return {Event<any>}
 */
const migrateEvent = <E extends Event<any>>(event: E): E => {
  if (VERSION > event.meta.version) {
    return EVENT_MIGRATIONS.reduce(
      (migratedEvent, [version, { [event.type]: migrate }]) =>
        migrate && version > migratedEvent.meta.version
          ? migrate(migratedEvent)
          : migratedEvent,
      event,
    ) as E;
  }
  return event as E;
};

/**
 * Given an OrbitDB Entry, parse the entry as an Event and run any
 * required migrations on it.
 *
 * @param entry {Entry}
 * @return {Event<any>}
 */
export const transformEntry = <E extends Event<any>>(entry: Entry): E => {
  return pipe(
    parseEntry,
    migrateEvent,
  )(entry);
};
