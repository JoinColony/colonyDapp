import {
  ColonyClient,
  FundingPotAssociatedType,
  getBlockTime,
  getLogs,
} from '@colony/colony-js';
import { bigNumberify } from 'ethers/utils';
import { HashZero } from 'ethers/constants';

import { Transaction } from '~data/index';
import { notUndefined } from '~utils/arrays';

export const getColonyFundsClaimedTransactions = async (
  colonyClient: ColonyClient,
): Promise<Transaction[]> => {
  const { provider } = colonyClient;

  const filter = colonyClient.filters.ColonyFundsClaimed(null, null, null);
  const logs = await getLogs(colonyClient, filter);

  const transactions = await Promise.all(
    logs.map(async (log) => {
      const event = colonyClient.interface.parseLog(log);
      const date = log.blockHash
        ? await getBlockTime(provider, log.blockHash)
        : 0;
      const { values } = event;

      const tx = log.transactionHash
        ? await provider.getTransaction(log.transactionHash)
        : undefined;
      const { token, payoutRemainder } = values;

      // Don't show claims of zero
      if (!payoutRemainder.gt(bigNumberify(0))) return undefined;

      return {
        __typename: 'Transaction',
        amount: payoutRemainder,
        colonyAddress: colonyClient.address,
        date,
        from: tx ? tx.from : undefined,
        hash: log.transactionHash || HashZero,
        incoming: true,
        token,
      };
    }),
  );
  return transactions.filter(notUndefined);
};

export const getPayoutClaimedTransactions = async (
  colonyClient: ColonyClient,
): Promise<Transaction[]> => {
  const { provider } = colonyClient;
  const filter = colonyClient.filters.PayoutClaimed(null, null, null);
  const logs = await getLogs(colonyClient, filter);

  const transactions = await Promise.all(
    logs.map(async (log) => {
      const event = colonyClient.interface.parseLog(log);
      const date = log.blockHash
        ? await getBlockTime(provider, log.blockHash)
        : 0;
      const { values } = event;

      const { fundingPotId, token, amount } = values;
      const {
        associatedType,
        associatedTypeId,
      } = await colonyClient.getFundingPot(fundingPotId);

      if (associatedType !== FundingPotAssociatedType.Payment) return undefined;

      const { recipient: to } = await colonyClient.getPayment(associatedTypeId);

      return {
        __typename: 'Transaction',
        amount,
        colonyAddress: colonyClient.address,
        date,
        hash: log.transactionHash || HashZero,
        incoming: false,
        to,
        token,
      };
    }),
  );

  return transactions.filter(notUndefined);
};

export const getColonyUnclaimedTransfers = async (
  colonyClient: ColonyClient,
): Promise<Transaction[]> => {
  const { provider } = colonyClient;
  const { tokenClient } = colonyClient;
  const claimedTransferFilter = colonyClient.filters.ColonyFundsClaimed(
    null,
    null,
    null,
  );
  const claimedTransferLogs = await getLogs(
    colonyClient,
    claimedTransferFilter,
  );
  const claimedTransferEvents = claimedTransferLogs.map((log) =>
    colonyClient.interface.parseLog(log),
  );

  // Get logs & events for token transfer to this colony
  const tokenTransferFilter = tokenClient.filters.Transfer(
    null,
    colonyClient.address,
    null,
  );
  const tokenTransferLogs = await getLogs(colonyClient, {
    // Do not limit it to the tokenClient. We want all transfers to the colony
    topics: tokenTransferFilter.topics,
  });

  const transactions = await Promise.all(
    tokenTransferLogs.map(async (log) => {
      const event = colonyClient.interface.parseLog(log);
      const date = log.blockHash
        ? await getBlockTime(provider, log.blockHash)
        : 0;
      const { values } = event;
      const { blockNumber } = log;

      const { src, wad } = values;

      const transferClaimed = !!claimedTransferEvents.find(
        ({ values: { token } }, i) =>
          token === log.address &&
          blockNumber &&
          claimedTransferLogs &&
          claimedTransferLogs[i] &&
          claimedTransferLogs[i].blockNumber &&
          // blockNumber is defined (we just checked that), only TS doesn't know that for some reason
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          claimedTransferLogs[i].blockNumber! > blockNumber,
      );

      if (transferClaimed) return undefined;

      return {
        __typename: 'Transaction',
        amount: wad,
        colonyAddress: colonyClient.address,
        date,
        from: src,
        hash: log.transactionHash || HashZero,
        incoming: true,
        token: log.address,
      };
    }),
  );

  return transactions.filter(notUndefined);
};
