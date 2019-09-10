import { EventTypes, Versions } from '~data/constants';
import { Event, VersionedEvent } from '../types';

export type EventMigrationFunction<T extends EventTypes, V extends Versions> = (
  event: Event<T>,
) => VersionedEvent<V, T>;
