import BigNumber from 'bn.js';
import {
  ColonyNetworkClient as ColonyNetworkClientType,
  ColonyClient as ColonyClientType,
  TokenClient as TokenClientType,
} from '@colony/colony-js-client';

import { LogFilterOptions } from './types';

import { getEventLogFilter } from './logFilter';

type LogFilter = any;

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

/*
 * Decorate logs with a timestamp, a transaction object and the parsed event data
 */
export const decorateLog = async (
  client: ColonyClientType | TokenClientType | ColonyNetworkClientType,
  log: any,
  event?: any,
) => {
  const { blockHash, transactionHash } = log;
  const { timestamp } = await client.adapter.provider.getBlock(blockHash);
  const transaction = await client.adapter.provider.getTransaction(
    transactionHash,
  );

  /**
   * @NOTE: We have to cater for logs coming directly from transactions.
   * This is needed because we have `putNotification` that adds to
   * current user's activities on redux. So if we don't pass in an event,
   * we try to parse it from the log.
   */
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

interface EventTransaction {
  blockHash: string;
  blockNumber: number;
  creates: string | null;
  data: string;
  from: string;
  gasLimit: BigNumber;
  gasPrice: BigNumber;
  hash: string;
  networkId: number;
  nonce: number;
  r: string;
  raw: string;
  s: string;
  to: string;
  transactionIndex: number;
  v: number;
}

interface DecoratedEvent<T, P> {
  event: { eventName: T } & P;
  log: {
    address: string;
    blockHash: string;
    blockNumber: number;
    data: string;
    logIndex: number;
    topics: string[];
    transactionHash: string;
    transactionIndex: number;
  };
  timestamp: number;
  transaction: EventTransaction;
}

/*
 * Get logs using a logFilter and decorate them with a transaction, a timestamp and parsed event data
 */
export const getDecoratedEvents = async <T, P>(
  client: ColonyClientType | TokenClientType | ColonyNetworkClientType,
  logFilter: LogFilter,
  logFilterOptions: LogFilterOptions,
): Promise<DecoratedEvent<T, P>[]> => {
  const filter = await getEventLogFilter(
    client.adapter.provider,
    logFilter,
    logFilterOptions,
  );

  const logs = await client.getLogs(filter);
  if (!(logs && logs.length)) return [];

  const events = await client.parseLogs(logs);
  if (!(events && events.length && events.length === logs.length)) {
    throw new Error( // eslint-disable-next-line max-len
      'Something went wrong while parsing logs, parsed events doesnt match the logs',
    );
  }

  /**
   * @NOTE: Here we pass the event directly so we don't try to parse the log again
   * on `decorateLog`
   */
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
