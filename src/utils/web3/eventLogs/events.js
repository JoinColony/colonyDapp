/* @flow */

import type { LogFilter } from '@colony/colony-js-adapter';
import type {
  ColonyClient as ColonyClientType,
  TokenClient as TokenClientType,
} from '@colony/colony-js-client';

import type { LogFilterOptions } from './types';

import { getEventLogFilter } from './logFilter';

/*
 * Given a colony client, log filter and additional log filter options,
 * return an object containing both the logs and ColonyJS-parsed events.
 */
export const getLogsAndEvents = async (
  client: ColonyClientType | TokenClientType,
  logFilter: LogFilter,
  logFilterOptions: LogFilterOptions,
) => {
  const logs = await client.getLogs(
    await getEventLogFilter(
      client.adapter.provider,
      logFilter,
      logFilterOptions,
    ),
  );
  const events = await client.parseLogs(logs);
  return { logs, events };
};

/*
 * Given a colony client, log filter and additional log filter options,
 * return the ColonyJS-parsed events.
 */
export const getEvents = async (
  client: ColonyClientType | TokenClientType,
  logFilter: LogFilter,
  logFilterOptions: LogFilterOptions,
) =>
  client.getEvents(
    await getEventLogFilter(
      client.adapter.provider,
      logFilter,
      logFilterOptions,
    ),
  );

export const getEventLogs = async (
  client: ColonyClientType | TokenClientType,
  logFilter: LogFilter,
  logFilterOptions: LogFilterOptions,
) =>
  client.getLogs(
    await getEventLogFilter(
      client.adapter.provider,
      logFilter,
      logFilterOptions,
    ),
  );
