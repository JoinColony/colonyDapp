import {
  ColonyClient,
  ColonyNetworkClient,
  FundingPotAssociatedType,
  getBlockTime,
  getLogs,
} from '@colony/colony-js';
import { bigNumberify } from 'ethers/utils';
import { HashZero } from 'ethers/constants';
import { ApolloClient } from '@apollo/client';

import {
  Transfer,
  SubgraphColonyFundsClaimedEventsQuery,
  SubgraphColonyFundsClaimedEventsQueryVariables,
  SubgraphColonyFundsClaimedEventsDocument,
} from '~data/index';
import { notUndefined } from '~utils/arrays';
import { parseSubgraphEvent } from '~utils/events';

export const getColonyFundsClaimedTransfers = async (
  apolloClient: ApolloClient<object>,
  colonyClient: ColonyClient,
): Promise<Transfer[]> => {
  const { provider } = colonyClient;

  const { data: colonyFundsClaimedEventsData } = await apolloClient.query<
    SubgraphColonyFundsClaimedEventsQuery,
    SubgraphColonyFundsClaimedEventsQueryVariables
  >({
    query: SubgraphColonyFundsClaimedEventsDocument,
    fetchPolicy: 'network-only',
    variables: {
      colonyAddress: colonyClient.address.toLowerCase(),
    },
  });
  const colonyFundsClaimedEvents =
    colonyFundsClaimedEventsData?.colonyFundsClaimedEvents || [];

  const transfers = await Promise.all(
    colonyFundsClaimedEvents.map(async (event) => {
      const parsedEvent = parseSubgraphEvent(event);
      const {
        values: { token, payoutRemainder },
        hash,
        timestamp,
      } = parsedEvent;

      const tx = hash ? await provider.getTransaction(hash) : undefined;

      // Don't show claims of zero
      if (!bigNumberify(payoutRemainder).gt(bigNumberify(0))) return undefined;

      return {
        __typename: 'Transfer',
        amount: payoutRemainder.toString(),
        colonyAddress: colonyClient.address,
        date: timestamp || 0,
        from: (tx && tx.from) || null,
        hash: hash || HashZero,
        incoming: true,
        to: colonyClient.address,
        token,
      };
    }),
  );

  return transfers.filter(notUndefined);
};

export const getPayoutClaimedTransfers = async (
  colonyClient: ColonyClient,
): Promise<Transfer[]> => {
  const { provider } = colonyClient;
  const filter = colonyClient.filters.PayoutClaimed(null, null, null, null);
  const logs = await getLogs(colonyClient, filter);

  const transfers = await Promise.all(
    logs.map(async (log) => {
      const event = colonyClient.interface.parseLog(log);
      const date = log.blockHash
        ? await getBlockTime(provider, log.blockHash)
        : 0;
      const {
        values: { fundingPotId, token, amount },
      } = event;

      const {
        associatedType,
        associatedTypeId,
      } = await colonyClient.getFundingPot(fundingPotId);

      if (associatedType !== FundingPotAssociatedType.Payment) return undefined;

      const { recipient: to } = await colonyClient.getPayment(associatedTypeId);

      return {
        __typename: 'Transfer',
        amount: amount.toString(),
        colonyAddress: colonyClient.address,
        date,
        from: null,
        hash: log.transactionHash || HashZero,
        incoming: false,
        to,
        token,
      };
    }),
  );

  return transfers.filter(notUndefined);
};

export const getColonyUnclaimedTransfers = async (
  colonyClient: ColonyClient,
  networkClient: ColonyNetworkClient,
): Promise<Transfer[]> => {
  const { provider } = colonyClient;
  const { tokenClient } = colonyClient;
  const claimedTransferFilter = colonyClient.filters.ColonyFundsClaimed(
    null,
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

  return Promise.resolve(
    tokenTransferLogs.reduce(async (transferLogs, transferLog) => {
      const event = tokenClient.interface.parseLog(transferLog);
      const date = transferLog.blockHash
        ? await getBlockTime(provider, transferLog.blockHash)
        : 0;
      /*
       * @NOTE Take the values from the "array" rather than from the named properties
       * This is because our native tokens differ in abi from ERC20 or SAI tokens
       *
       * Here's the mapping:
       *
       * Ours   ERC20
       * ---    ---
       * src    from
       * dest   to
       * wad    value
       *
       * But if we take the values from the array, they will always be in the
       * same order: 0->from, 1->to, 2->value
       *
       * This way we can always be sure that get the correct values for the various
       * tokens all the time
       */
      const source = event?.values['0'];
      const amount = event?.values['2'];

      /*
       * Determine if this transfer was generated by the reputation mining cycle
       * on the Xdai network.
       *
       * If that's the case, we need to filter it out.
       */
      const isMiningCycleTransfer =
        source.toLowerCase() === networkClient.address.toLowerCase() &&
        amount.isZero();

      const { blockNumber } = transferLog;

      const transferClaimed = !!claimedTransferEvents.find(
        ({ values: { token } }, i) =>
          token === transferLog.address &&
          blockNumber &&
          claimedTransferLogs &&
          claimedTransferLogs[i] &&
          claimedTransferLogs[i].blockNumber &&
          // blockNumber is defined (we just checked that), only TS doesn't know that for some reason
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          claimedTransferLogs[i].blockNumber! > blockNumber,
      );

      if (!transferClaimed && !isMiningCycleTransfer) {
        return [
          ...(await transferLogs),
          {
            __typename: 'Transfer',
            amount: amount?.toString(),
            colonyAddress: colonyClient.address,
            date,
            from: source || null,
            hash: transferLog.transactionHash || HashZero,
            incoming: true,
            to: colonyClient.address,
            token: transferLog.address,
          },
        ];
      }
      return transferLogs;
    }, Promise.resolve([])),
  );
};
