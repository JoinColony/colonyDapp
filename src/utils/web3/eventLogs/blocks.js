/* @flow */

import type { IProvider } from '@colony/colony-js-adapter';

/*
 * Given a provider and log, get the timestamp of the block from
 * which it was emitted and return as a Date.
 */
export const getLogDate = async (
  provider: IProvider,
  { blockHash }: { blockHash: string },
) => {
  const { timestamp } = await provider.getBlock(blockHash);
  return new Date(timestamp);
};

/*
 * Given a provider and `delta`, get the current block number and subtract delta.
 * Capped at zero (no negative block numbers, but no error either).
 */
export const getBlockNumberForDelta = async (
  provider: IProvider,
  delta: number,
) => Math.max((await provider.getBlockNumber()) - delta, 0);
