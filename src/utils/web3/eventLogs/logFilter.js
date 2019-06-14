/* @flow */

import { padLeft, toHex } from 'web3-utils';
import flatMap from 'lodash/flatMap';

import type { IProvider, LogFilter } from '@colony/colony-js-adapter';

import { getBlockNumberForDelta } from '~utils/web3/eventLogs/blocks';

import type { LogFilterOptions } from './types';

/*
 * Returns a padded hex string of the size expected for a contract event topic,
 * for the given address.
 */
const padTopicAddress = (address: string) => padLeft(address.toLowerCase(), 64);

/**
 * Returns a padded hex string of the size expected for a contract event topic,
 * for the given input. Uses Buffer for hex string conversion.
 */
export const getFilterFormatted = (input: any) => padLeft(toHex(input), 64);

/*
 * Returns an array of topics for the given ColonyJS events, and from/to
 * addresses, if given, for ERC20 transfers, or similar events.
 */
const getTopics = ({ events = [], from, to }: LogFilterOptions) => {
  const topics = [
    flatMap(events, ({ interface: { eventTopics } }) => eventTopics),
    // $FlowFixMe the LogFilter type should accept null for this
    from ? padTopicAddress(from) : null,
    // $FlowFixMe the LogFilter type should accept null for this
    to ? padTopicAddress(to) : null,
  ];
  while (topics[topics.length] === null) {
    topics.pop();
  }
  return topics;
};

/*
 * Returns given filter with added `fromBlock` and `toBlock` components
 * according to how many `blocksBack` from latest.
 */
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

/*
 * Returns an augmented log filter, according to options.
 */
export const getEventLogFilter = async (
  provider: IProvider,
  logFilter: LogFilter,
  { blocksBack, events = [], from, to }: LogFilterOptions,
) => ({
  ...(await restrictLogFilterBlocks(provider, logFilter, blocksBack)),
  topics: logFilter.topics || getTopics({ events, from, to }),
  eventNames: events.map(({ eventName }) => eventName),
});
