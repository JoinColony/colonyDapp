import BigNumber from 'bn.js';

import { Address } from '~types/index';
import { ColonyManager, ColonyClient, Query } from '~data/types';
import { ContractTransactionType } from '~immutable/index';

import {
  getLogsAndEvents,
  parseColonyFundsClaimedEvent,
  parseColonyFundsMovedBetweenFundingPotsEvent,
  parsePayoutClaimedEvent,
  parseUnclaimedTransferEvent,
} from '~utils/web3/eventLogs';
import { ZERO_ADDRESS } from '~utils/web3/constants';

import { Context } from '~context/index';

type Metadata = { colonyAddress: Address };
type ContractEventQuery<A, R> = Query<ColonyClient, Metadata, A, R>;

const EVENT_PARSERS = {
  ColonyFundsClaimed: parseColonyFundsClaimedEvent,
  // eslint-disable-next-line max-len
  ColonyFundsMovedBetweenFundingPots: parseColonyFundsMovedBetweenFundingPotsEvent,
  PayoutClaimed: parsePayoutClaimedEvent,
};

const context = [Context.COLONY_MANAGER];
const prepare = async (
  { colonyManager }: { colonyManager: ColonyManager },
  { colonyAddress }: Metadata,
) => colonyManager.getColonyClient(colonyAddress);

export const getColonyTransactions: ContractEventQuery<
  void,
  ContractTransactionType[]
> = {
  name: 'getColonyTransactions',
  context,
  prepare,
  async execute(colonyClient) {
    const {
      contract: { address: colonyAddress },
      events: {
        ColonyFundsClaimed,
        // ColonyFundsMovedBetweenFundingPots,
        PayoutClaimed,
      },
    } = colonyClient;
    const { events, logs } = await getLogsAndEvents(
      colonyClient,
      {
        address: colonyAddress,
        fromBlock: 1,
      },
      {
        events: [
          ColonyFundsClaimed,
          /*
        @todo Refactor Colony transactions
        @body The Colony transactions list is currently really just
        events, vaguely displayed as transactions. It should be refactored
        along with the user wallet transactions list.
       */
          // ColonyFundsMovedBetweenFundingPots,
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
    return transactions.filter(Boolean) as ContractTransactionType[];
  },
};

export const getColonyUnclaimedTransactions: ContractEventQuery<
  void,
  ContractTransactionType[]
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

    // Get logs & events for token transfer to this colony
    const {
      logs: transferLogs,
      events: transferEvents,
    } = await getLogsAndEvents(
      tokenClient,
      { fromBlock: 1 },
      { events: [Transfer], to: colonyAddress },
    );

    // Get logs & events for token claims by this colony
    const { logs: claimLogs, events: claimEvents } = await getLogsAndEvents(
      colonyClient,
      { address: colonyAddress, fromBlock: 1 },
      { events: [ColonyFundsClaimed] },
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

    // Get ether balance and add a fake transaction if there's any unclaimed
    const colonyEtherBalance = await colonyClient.adapter.provider.getBalance(
      colonyAddress,
    );
    const {
      total: colonyNonRewardsPotsTotal,
    } = await colonyClient.getNonRewardPotsTotal.call({ token: ZERO_ADDRESS });
    const {
      balance: colonyRewardsPotTotal,
    } = await colonyClient.getFundingPotBalance.call({
      potId: 0,
      token: ZERO_ADDRESS,
    });
    const unclaimedEther = new BigNumber(
      colonyEtherBalance
        .sub(colonyNonRewardsPotsTotal)
        .sub(colonyRewardsPotTotal)
        .toString(10),
    );
    if (unclaimedEther.gtn(0)) {
      unclaimedTransfers.push({
        amount: unclaimedEther,
        colonyAddress,
        date: new Date(),
        hash: '0x0',
        incoming: true,
        token: ZERO_ADDRESS,
      });
    }

    return unclaimedTransfers.filter(Boolean) as ContractTransactionType[];
  },
};
