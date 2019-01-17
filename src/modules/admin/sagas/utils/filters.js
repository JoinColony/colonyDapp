/* @flow */

import type { ColonyClient } from '@colony/colony-js-client';
import type { Address } from '~types';

/**
 * Returns the block number `blocksBack` blocks ago (or zero, whichever is
 * greater), relative to the current network block number.
 */
export const getFilterBlocks = async (
  blocksBack: number,
  { adapter: { provider } }: ColonyClient,
) => {
  const currentBlock = await provider.getBlockNumber();
  return currentBlock - blocksBack < 0 ? 0 : currentBlock - blocksBack;
};

/**
 * Takes an Ethers logs filter (with additional `blocksBack`, used to set the
 * filter's `fromBlock` relative to the current block), as well as a
 * ColonyClient. Returns an object containing both the logs and ColonyJS-parsed
 * events for a given filter and ColonyClient.
 */
export const getLogsAndEvents = async (
  {
    blocksBack,
    ...partialFilter
  }: {
    blocksBack: number,
  },
  colonyClient: ColonyClient,
) => {
  const logs = await colonyClient.getLogs({
    fromBlock: await getFilterBlocks(blocksBack, colonyClient),
    toBlock: 'latest',
    ...partialFilter,
  });
  const events = await colonyClient.parseLogs(logs);
  return { logs, events };
};

/**
 * Returns a padded hex string of the size expected for a contract event topic,
 * for the given address.
 */
export const getFilterFormattedAddress = (address: Address) =>
  `0x000000000000000000000000${address.slice(2).toLowerCase()}`;
