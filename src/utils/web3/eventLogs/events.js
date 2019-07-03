/* @flow */

import type { LogFilter } from '@colony/colony-js-adapter';
import type {
  ColonyNetworkClient as ColonyNetworkClientType,
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
  client: ColonyClientType | TokenClientType | ColonyNetworkClientType,
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
  client: ColonyClientType | TokenClientType | ColonyNetworkClientType,
  logFilter: LogFilter,
  logFilterOptions: LogFilterOptions,
) => {
  const filter = await getEventLogFilter(
    client.adapter.provider,
    logFilter,
    logFilterOptions,
  );
  return client.getEvents(filter);
};

export const decorateLog = async (
  client: ColonyClientType | TokenClientType | ColonyNetworkClientType,
  log: *,
  event?: *,
) => {
  const { blockHash, transactionHash } = log;
  const { timestamp } = await client.adapter.provider.getBlock(blockHash);
  const transaction = await client.adapter.provider.getTransaction(
    transactionHash,
  );

  let parsedEvent = event;
  if (!parsedEvent) {
    const events = await client.parseLogs([log]);
    parsedEvent = events && events[0];
  }

  return {
    event: parsedEvent,
    log,
    transaction,
    timestamp: new Date(timestamp).getTime() * 1e3,
  };
};

export const getDecoratedEvents = async (
  client: ColonyClientType | TokenClientType | ColonyNetworkClientType,
  logFilter: LogFilter,
  logFilterOptions: LogFilterOptions,
) => {
  const filter = await getEventLogFilter(
    client.adapter.provider,
    logFilter,
    logFilterOptions,
  );

  const logs = await client.getLogs(filter);
  if (!(logs && logs.length)) return [];

  const events = await client.parseLogs(logs);
  if (!(events && events.length && events.length === logs.length)) {
    throw new Error('Something went wrong while parsing logs');
  }

  return Promise.all(
    logs.map((log, index) => decorateLog(client, log, events[index])),
  );
};

export const getEventLogs = async (
  client: ColonyClientType | TokenClientType | ColonyNetworkClientType,
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
