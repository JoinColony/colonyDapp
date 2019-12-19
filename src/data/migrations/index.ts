import { Versions } from '~data/constants';
import { EventMigrationFunction } from './types';

export const EVENT_MIGRATIONS: [
  Versions,
  Record<string, EventMigrationFunction<any, any>>,
][] = [
  // When a new version requires migrations, add a new entry here.
  // It's important that the versions are in order, as the order
  // of this array is used to apply migrations.
];
