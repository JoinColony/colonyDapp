type Provider = any;

/*
 * Given a provider and log, get the timestamp of the block from
 * which it was emitted and return as a Date.
 */
export const getLogDate = async (
  provider: Provider,
  { blockHash }: { blockHash: string },
) => {
  const { timestamp } = await provider.getBlock(blockHash);
  // timestamp is seconds, Date wants ms
  return new Date(timestamp * 1000);
};

/*
 * Given a provider and `delta`, get the current block number and subtract delta.
 * Capped at zero (no negative block numbers, but no error either).
 */
export const getBlockNumberForDelta = async (
  provider: Provider,
  delta: number,
) => Math.max((await provider.getBlockNumber()) - delta, 0);
