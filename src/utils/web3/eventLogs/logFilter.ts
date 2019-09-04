import { padLeft, toHex } from 'web3-utils';
import flatMap from 'lodash/flatMap';

import { getBlockNumberForDelta } from './blocks';
import { LogFilterOptions } from './types';

// import { IProvider, LogFilter } from '@colony/colony-js-adapter';
type Provider = any;
interface LogFilter {
  topics?: string[];
  toBlock?: number;
  fromBlock?: number;
}

/**
 * Given a string topic (or null), normalize the string
 * with the expected format/padded length (or return null).
 */
const formatTopic = (topic: string | null): string | null =>
  topic ? padLeft(topic.toLowerCase(), 64) : null;

/**
 * Given arguments, return an object with formatted topics.
 */
export const mapTopics = (...topics: (string | null)[]) => ({
  topics: topics.map(formatTopic),
});

/**
 * Returns a padded hex string of the size expected for a contract event topic,
 * for the given input. Uses Buffer for hex string conversion.
 */
export const formatFilterTopic = (input: string) => padLeft(toHex(input), 64);

/*
 * Returns an array of topics for the given ColonyJS events, and from/to
 * addresses, if given, for ERC20 transfers, or similar events.
 */
const getTopics = ({ events = [], from, to }: LogFilterOptions) => {
  const topics = [
    flatMap(events, ({ interface: { topics: eventTopics } }) => eventTopics),
    from ? formatTopic(from) : null,
    to ? formatTopic(to) : null,
  ];
  // Remove trailing null topics, since certain nodes don't like them
  while (topics[topics.length - 1] === null) {
    topics.pop();
  }
  return topics;
};

/*
 * Returns given filter with added `fromBlock` and `toBlock` components
 * according to how many `blocksBack` from latest.
 */
export const restrictLogFilterBlocks = async (
  provider: Provider,
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
  provider: Provider,
  logFilter: LogFilter,
  { blocksBack, events = [], from, to }: LogFilterOptions,
) => ({
  ...(await restrictLogFilterBlocks(provider, logFilter, blocksBack)),
  topics: logFilter.topics || getTopics({ events, from, to }),
  eventNames: events.map(({ eventName }) => eventName),
});
