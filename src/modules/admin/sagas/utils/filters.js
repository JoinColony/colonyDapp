/* @flow */

import type { ColonyClient } from '@colony/colony-js-client';

export const getFilterBlocks = async (
  blocksBack: number,
  { adapter: { provider } }: ColonyClient,
) => {
  const currentBlock = await provider.getBlockNumber();
  return currentBlock - blocksBack < 0 ? 0 : currentBlock - blocksBack;
};

export const getLogsAndEvents = async (
  partialFilter: Object,
  colonyClient: ColonyClient,
) => {
  const logs = await colonyClient.getLogs({
    fromBlock: getFilterBlocks(
      partialFilter.blocksBack || 400000,
      colonyClient,
    ),
    toBlock: 'latest',
    ...partialFilter,
  });
  const events = await colonyClient.parseLogs(logs);
  return { logs, events };
};
