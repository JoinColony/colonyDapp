import { EventTypes, Versions } from '~data/constants';
import { ROOT_DOMAIN } from '~constants';
import { EventMigrationFunction } from './types';

const taskCreated: EventMigrationFunction<
  EventTypes.TASK_CREATED,
  Versions.V2
> = ({ payload, meta, ...event }) => ({
  ...event,
  payload: {
    ...payload,
    domainId: ROOT_DOMAIN,
  },
  meta: {
    ...meta,
    version: Versions.V2,
  },
});

const domainSet: EventMigrationFunction<EventTypes.DOMAIN_SET, Versions.V2> = ({
  payload,
  meta,
  ...event
}) => ({
  ...event,
  payload: {
    ...payload,
    domainId: payload.domainId.toString(), // because it was a number before
  },
  meta: {
    ...meta,
    version: Versions.V2,
  },
});

export const V2Migrations: [
  Versions.V2,
  Record<string, EventMigrationFunction<any, Versions.V2>>,
] = [
  Versions.V2,
  {
    [EventTypes.TASK_CREATED]: taskCreated,
    [EventTypes.DOMAIN_SET]: domainSet,
  },
];
