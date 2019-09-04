import {
  ColonyClient as ColonyClientType,
  TokenClient as TokenClientType,
  FUNDING_POT_TYPE_PAYMENT,
} from '@colony/colony-js-client';
import Web3EthAbi from 'web3-eth-abi';

import BigNumber from 'bn.js';

import { ContractTransactionType } from '~immutable/index';
import { Address, createAddress } from '~types/index';

import { getLogDate } from './blocks';

const createContractTxObj = ({
  colonyAddress,
  from,
  to,
  token,
  ...rest
}: any): ContractTransactionType => ({
  ...rest,
  ...(colonyAddress ? { colonyAddress: createAddress(colonyAddress) } : {}),
  ...(from ? { from: createAddress(from) } : {}),
  ...(to ? { to: createAddress(to) } : {}),
  token: createAddress(token),
});

/*
 * Given a ColonyJS-parsed ColonyFundsClaimedEvent, log from which it was
 * parsed, ColonyClient and colonyAddress, return a ContractTransactionType
 * object, or null if the claim amount was zero.
 */
export const parseColonyFundsClaimedEvent = async ({
  colonyClient: {
    adapter: { provider },
  },
  colonyClient,
  colonyAddress,
  event: { payoutRemainder: amount, token },
  log: { transactionHash },
  log,
}: {
  colonyClient: ColonyClientType;
  colonyAddress: Address;
  event: any;
  log: any;
}): Promise<ContractTransactionType | null> => {
  const date = await getLogDate(colonyClient.adapter.provider, log);
  const { from } = await provider.getTransaction(transactionHash);

  // don't show claims of zero
  return amount.gt(new BigNumber(0))
    ? createContractTxObj({
        amount,
        colonyAddress,
        date,
        from,
        hash: transactionHash,
        incoming: true,
        token,
      })
    : null;
};

/*
 * Given a ColonyJS-parsed ColonyFundsMovedBetweenFundingPotsEvent, log from
 * which it was parsed, ColonyClient and colonyAddress, return a
 * ContractTransactionType object.
 */
export const parseColonyFundsMovedBetweenFundingPotsEvent = async ({
  colonyClient,
  colonyAddress,
  event: { amount, fromPot, token },
  log: { transactionHash },
  log,
}: {
  colonyClient: ColonyClientType;
  colonyAddress: Address;
  event: any;
  log: any;
}): Promise<ContractTransactionType> => {
  const date = await getLogDate(colonyClient.adapter.provider, log);

  /**
   * @todo Replace the placeholder taskId once able to get taskId from potId (funds event handler).
   */
  const taskId = 1;
  // const [, taskId] = yield call(
  //   [colonyClient.contract, colonyClient.contract.pots],
  //   events[i].fromPot === 1 ? events[i].toPot : events[i].fromPot,
  // );

  return createContractTxObj({
    amount,
    colonyAddress,
    date,
    incoming: fromPot !== 1,
    taskId,
    token,
    hash: transactionHash,
  });
};

/*
 * Given a ColonyJS-parsed PayoutClaimedEvent, log from which it was
 * parsed, and ColonyClient, return a ContractTransactionType object.
 */
export const parsePayoutClaimedEvent = async ({
  event: { potId, amount, token },
  log: { transactionHash: hash },
  log,
  colonyClient,
}: {
  colonyClient: ColonyClientType;
  event: any;
  log: any;
}): Promise<ContractTransactionType | null> => {
  const date = await getLogDate(colonyClient.adapter.provider, log);
  const { typeId: paymentId, type } = await colonyClient.getFundingPot.call({
    potId,
  });
  if (type !== FUNDING_POT_TYPE_PAYMENT) return null;
  const { recipient: to } = await colonyClient.getPayment.call({ paymentId });
  return createContractTxObj({
    amount,
    date,
    hash,
    incoming: false,
    to,
    token,
  });
};

/*
 * Given a ColonyJS-parsed TransferEvent, log from which it was parsed, Array
 * of Colony token claim events and associated logs from which they were
 * passed, ColonyClient, and colonyAddress, return a ContractTransactionType
 * object or null if that token has been claimed since the Transfer.
 */
export const parseUnclaimedTransferEvent = async ({
  claimEvents,
  claimLogs,
  colonyClient,
  colonyAddress,
  transferEvent: { from, value: amount },
  transferLog: { address, blockNumber, transactionHash: hash },
  transferLog,
}: {
  claimEvents: any[];
  claimLogs: any[];
  colonyClient: ColonyClientType;
  colonyAddress: Address;
  transferEvent: any;
  transferLog: any;
}): Promise<ContractTransactionType | null> => {
  const date = await getLogDate(colonyClient.adapter.provider, transferLog);
  const token = createAddress(address);

  // Only return if we haven't claimed since it happened
  return claimEvents.find(
    (claimEvent, i) =>
      createAddress(claimEvent.token) === token &&
      claimLogs[i].blockNumber > blockNumber,
  )
    ? null
    : createContractTxObj({
        amount,
        colonyAddress,
        date,
        from,
        hash,
        incoming: true,
        token,
      });
};

/*
 * Given a ColonyJS-parsed TransferEvent for a user, the log from which it was
 * parsed, ColonyClient, and walletAddress, return a ContractTransactionType
 * object for the token transfer.
 */
export const parseUserTransferEvent = async ({
  event: { value: amount },
  event,
  log: { address: token, transactionHash: hash },
  log,
  tokenClient,
  userColonyAddresses,
  walletAddress,
}: {
  event: any;
  log: any;
  tokenClient: TokenClientType;
  userColonyAddresses: Address[];
  walletAddress: string;
}): Promise<ContractTransactionType> => {
  const date = await getLogDate(tokenClient.adapter.provider, log);
  const to = createAddress(event.to);
  const from = createAddress(event.from);

  const colonyAddress = userColonyAddresses.find(
    address => address === from || address === to,
  );

  return createContractTxObj({
    amount,
    colonyAddress,
    date,
    from,
    hash,
    incoming: to === walletAddress,
    to,
    token,
  });
};

// Obtain the deployed extension address from an `ExtensionDeployed` log
export const parseExtensionDeployedLog = (log: any) => {
  const { _extension: extensionAddress } = Web3EthAbi.decodeLog(
    [
      {
        type: 'string',
        name: '_name',
      },
      {
        type: 'address',
        name: '_colony',
      },
      {
        type: 'address',
        name: '_extension',
      },
    ],
    log.data,
    log.topics,
  );
  return extensionAddress;
};
