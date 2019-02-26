/* @flow */

/*
 * Returns a padded hex string of the size expected for a contract event topic,
 * for the given address.
 */
import type { IProvider, LogFilter } from '@colony/colony-js-adapter';
import { getBlockNumberForDelta } from '~utils/web3/eventLogs/blocks';

import type { LogFilterOptions } from './types';

// TODO examine the length of the address
const padTopicAddress = (address: string) =>
  `0x000000000000000000000000${address.slice(2).toLowerCase()}`;

const getTopics = ({ events = [], from, to }: LogFilterOptions) => [
  events.map(({ interface: { topics } }) => topics),
  // $FlowFixMe the LogFilter type should accept null for this
  from ? padTopicAddress(from) : null,
  // $FlowFixMe the LogFilter type should accept null for this
  to ? padTopicAddress(to) : null,
];

export const restrictLogFilterBlocks = async (
  provider: IProvider,
  { fromBlock, toBlock, ...logFilter }: LogFilter,
  blocksBack?: number,
) => ({
  fromBlock:
    fromBlock ||
    (blocksBack && (await getBlockNumberForDelta(provider, blocksBack))),
  toBlock: toBlock || 'latest',
  ...logFilter,
});

export const getEventLogFilter = async (
  provider: IProvider,
  logFilter: LogFilter,
  { blocksBack, events = [], from, to }: LogFilterOptions,
) => ({
  ...(await restrictLogFilterBlocks(provider, logFilter, blocksBack)),
  topics: logFilter.topics || getTopics({ events, from, to }),
  eventNames: events.map(({ eventName }) => eventName),
});
