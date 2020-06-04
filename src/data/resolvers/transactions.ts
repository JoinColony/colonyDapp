import {
  ColonyClient,
  FundingPotAssociatedType,
  getBlockTime,
} from '@colony/colony-js';

import { Transaction } from '~data/index';
import { notUndefined } from '~utils/arrays';

export const getColonyFundsClaimedTransactions = async (
  colonyClient: ColonyClient,
): Promise<Transaction[]> => {
  const { provider } = colonyClient;

  const filter = colonyClient.filters.ColonyFundsClaimed(null, null, null);
  const logs = await provider.getLogs(filter);

  return Promise.all(
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

      return {
        __typename: 'Transaction',
        amount: payoutRemainder,
        colonyAddress: colonyClient.address,
        date,
        from: tx ? tx.from : undefined,
        hash: log.transactionHash,
        incoming: true,
        token,
      };
    }),
  );
};

export const getPayoutClaimedTransactions = async (
  colonyClient: ColonyClient,
): Promise<Transaction[]> => {
  const { provider } = colonyClient;
  const filter = colonyClient.filters.PayoutClaimed(null, null, null);
  const logs = await provider.getLogs(filter);

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
        hash: log.transactionHash,
        incoming: false,
        to,
        token,
      };
    }),
  );

  return transactions.filter(notUndefined);
};
