import {
  ColonyClient,
  ColonyNetworkClient,
  FundingPotAssociatedType,
  getBlockTime,
} from '@colony/colony-js';
import { Log } from 'ethers/providers';
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

  const tokenTransferLogs: Log[] = [];
  try {
    const BLOCK_CHUNK_SIZE = 500000;
    const latestBlock = await colonyClient.provider.getBlock();
    /* eslint-disable no-await-in-loop */
    for (let index = 0; index < latestBlock.number; index += BLOCK_CHUNK_SIZE) {
      const transferLogsCallResponse = await fetch(
        colonyClient.provider.connection.url,
        {
          body: JSON.stringify({
            id: index,
            jsonrpc: '2.0',
            method: 'eth_getLogs',
            params: [
              {
                fromBlock: index,
                toBlock:
                  index + BLOCK_CHUNK_SIZE > latestBlock.number
                    ? latestBlock.number
                    : index + BLOCK_CHUNK_SIZE,
                topics: tokenTransferFilter.topics,
              },
            ],
          }),
          method: 'POST',
          mode: 'cors',
          credentials: 'omit',
        },
      );
      const {
        result: transferLogsChunk,
      } = await transferLogsCallResponse.json();
      tokenTransferLogs.push(...transferLogsChunk);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    /* eslint-enable no-await-in-loop */
  } catch (error) {
    //
  }

  return Promise.resolve(
    tokenTransferLogs.reduce(async (transferLogs, transferLog) => {
      let event;
      try {
        /*
         * @NOTE Guard parsing the `Transfer` logs into events
         * This is needed because NFT transfers (ERC-721's) emit the same event as ERC-20's
         * just with the last argument changed (wad vs. id), meaning that if someone would
         * send a NFT to a colony's address, it would break this logic (since `parseLog` will error out),
         * and none of the subsequent token transfers in would show up.
         *
         * For more reading, have a look at the `Transfer` even from the two standards:
         * - https://eips.ethereum.org/EIPS/eip-20#events
         * - https://eips.ethereum.org/EIPS/eip-721#specification
         *
         * The approach to fix this is pretty naive as it doesn't attempt to do any logic detection,
         * it just drops the log that can't be parsed and moves on.
         *
         * Have ever told you how much I hate ERC-20/721 standards?
         */
        event = tokenClient.interface.parseLog(transferLog);
      } catch (error) {
        return transferLogs;
      }
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
