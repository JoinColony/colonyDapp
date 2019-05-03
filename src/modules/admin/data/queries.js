/* @flow */

import type { Address } from '~types';
import type { ColonyManager, ColonyClient, Query } from '~data/types';
import type { ContractTransactionType } from '~immutable';

import {
  getLogsAndEvents,
  parseColonyFundsClaimedEvent,
  parseColonyFundsMovedBetweenFundingPotsEvent,
  parsePayoutClaimedEvent,
  parseUnclaimedTransferEvent,
} from '~utils/web3/eventLogs';

import { CONTEXT } from '~context';

type Metadata = {| colonyAddress: Address |};
type ContractEventQuery<A, R> = Query<ColonyClient, Metadata, A, R>;

const EVENT_PARSERS = {
  ColonyFundsClaimed: parseColonyFundsClaimedEvent,
  // eslint-disable-next-line max-len
  ColonyFundsMovedBetweenFundingPots: parseColonyFundsMovedBetweenFundingPotsEvent,
  PayoutClaimed: parsePayoutClaimedEvent,
};

const context = [CONTEXT.COLONY_MANAGER];
const prepare = async (
  { colonyManager }: { colonyManager: ColonyManager },
  { colonyAddress }: Metadata,
) => colonyManager.getColonyClient(colonyAddress);

export const getColonyTransactions: ContractEventQuery<
  void,
  ContractTransactionType[],
> = {
  name: 'getColonyTransactions',
  context,
  prepare,
  async execute(colonyClient) {
    const {
      contract: { address: colonyAddress },
      events: {
        ColonyFundsClaimed,
        ColonyFundsMovedBetweenFundingPots,
        PayoutClaimed,
      },
    } = colonyClient;
    const { events, logs } = await getLogsAndEvents(
      colonyClient,
      {},
      {
        blocksBack: 400000,
        events: [
          ColonyFundsClaimed,
          ColonyFundsMovedBetweenFundingPots,
          PayoutClaimed,
        ],
      },
    );
    const transactions = await Promise.all(
      events.map((event, i) =>
        EVENT_PARSERS[event.eventName]({
          event,
          log: logs[i],
          colonyClient,
          colonyAddress,
        }),
      ),
    );
    return transactions.filter(Boolean);
  },
};

export const getColonyUnclaimedTransactions: ContractEventQuery<
  void,
  ContractTransactionType[],
> = {
  name: 'getColonyUnclaimedTransactions',
  context,
  prepare,
  async execute(colonyClient) {
    const {
      contract: { address: colonyAddress },
      events: { ColonyFundsClaimed },
      tokenClient,
    } = colonyClient;
    const {
      events: { Transfer },
    } = tokenClient;

    const blocksBack = 400000;

    // Get logs & events for token transfer to this colony
    const {
      logs: transferLogs,
      events: transferEvents,
    } = await getLogsAndEvents(
      tokenClient,
      {},
      { blocksBack, events: [Transfer], to: colonyAddress },
    );

    // Get logs & events for token claims by this colony
    const { logs: claimLogs, events: claimEvents } = await getLogsAndEvents(
      colonyClient,
      {},
      { blocksBack, events: [ColonyFundsClaimed] },
    );

    const unclaimedTransfers = await Promise.all(
      transferEvents.map((transferEvent, i) =>
        parseUnclaimedTransferEvent({
          claimEvents,
          claimLogs,
          colonyClient,
          colonyAddress,
          transferEvent,
          transferLog: transferLogs[i],
        }),
      ),
    );

    return unclaimedTransfers.filter(Boolean);
  },
};
