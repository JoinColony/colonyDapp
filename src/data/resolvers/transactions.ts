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
  SubgraphPayoutClaimedEventsDocument,
  SubgraphPayoutClaimedEventsQuery,
  SubgraphPayoutClaimedEventsQueryVariables,
} from '~data/index';
import { notUndefined } from '~utils/arrays';
import { parseSubgraphEvent } from '~utils/events';

export const getColonyFundsClaimedTransfers = async (
  apolloClient: ApolloClient<object>,
  colonyAddress: string,
): Promise<Transfer[]> => {
  const { data: colonyFundsClaimedEventsData } = await apolloClient.query<
    SubgraphColonyFundsClaimedEventsQuery,
    SubgraphColonyFundsClaimedEventsQueryVariables
  >({
    query: SubgraphColonyFundsClaimedEventsDocument,
    variables: {
      colonyAddress: colonyAddress.toLowerCase(),
    },
  });
  const colonyFundsClaimedEvents =
    colonyFundsClaimedEventsData?.colonyFundsClaimedEvents || [];

  const transfers = colonyFundsClaimedEvents.map((event) => {
    const parsedEvent = parseSubgraphEvent(event);
    const {
      values: { token, payoutRemainder, agent },
      hash,
      timestamp,
    } = parsedEvent;

    // Don't show claims of zero
    if (!bigNumberify(payoutRemainder).gt(bigNumberify(0))) return undefined;

    return {
      __typename: 'Transfer',
      amount: payoutRemainder.toString(),
      colonyAddress,
      date: timestamp || 0,
      from: agent || null,
      hash: hash || HashZero,
      incoming: true,
      to: colonyAddress,
      token,
    };
  });

  return transfers.filter(notUndefined);
};

export const getPayoutClaimedTransfers = async (
  apolloClient: ApolloClient<object>,
  colonyClient: ColonyClient,
): Promise<Transfer[]> => {
  const { data: colonyPayoutClaimedEventsData } = await apolloClient.query<
    SubgraphPayoutClaimedEventsQuery,
    SubgraphPayoutClaimedEventsQueryVariables
  >({
    query: SubgraphPayoutClaimedEventsDocument,
    variables: {
      colonyAddress: colonyClient.address.toLowerCase(),
    },
  });
  const colonyPayoutClaimedEvents =
    colonyPayoutClaimedEventsData?.payoutClaimedEvents || [];

  const transfers = await Promise.all(
    colonyPayoutClaimedEvents.map(async (event) => {
      const parsedEvent = parseSubgraphEvent(event);
      const {
        values: { fundingPotId, token, amount },
        hash,
        timestamp,
      } = parsedEvent;

      const {
        associatedType,
        associatedTypeId,
      } = await colonyClient.getFundingPot(fundingPotId);

      if (associatedType !== FundingPotAssociatedType.Payment) return undefined;

      const { recipient: to } = await colonyClient.getPayment(associatedTypeId);

      return {
        __typename: 'Transfer',
        amount,
        colonyAddress: colonyClient.address,
        date: timestamp || 0,
        from: null,
        hash: hash || HashZero,
        incoming: false,
        to,
        token,
      };
    }),
  );

  return transfers.filter(notUndefined);
};

export const getColonyUnclaimedTransfers = async (
  apolloClient: ApolloClient<object>,
  colonyClient: ColonyClient,
  networkClient: ColonyNetworkClient,
): Promise<Transfer[]> => {
  const { provider } = colonyClient;
  const { tokenClient } = colonyClient;

  const { data: colonyFundsClaimedEventsData } = await apolloClient.query<
    SubgraphColonyFundsClaimedEventsQuery,
    SubgraphColonyFundsClaimedEventsQueryVariables
  >({
    query: SubgraphColonyFundsClaimedEventsDocument,
    variables: {
      colonyAddress: colonyClient.address.toLowerCase(),
    },
    fetchPolicy: 'network-only',
  });
  const colonyFundsClaimedEvents =
    colonyFundsClaimedEventsData?.colonyFundsClaimedEvents || [];

  const parsedClaimedTransferEvents = colonyFundsClaimedEvents.map((event) =>
    parseSubgraphEvent(event),
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

      const transferClaimed = !!parsedClaimedTransferEvents.find(
        ({ values: { token }, blockNumber: eventBlockNumber }) =>
          token === transferLog.address.toLowerCase() &&
          blockNumber &&
          eventBlockNumber &&
          eventBlockNumber > blockNumber,
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
