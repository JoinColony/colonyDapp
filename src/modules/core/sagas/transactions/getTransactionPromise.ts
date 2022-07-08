import { TransactionResponse } from 'ethers/providers';
import { ContractClient, TransactionOverrides } from '@colony/colony-js';
import { TransactionRecord } from '~immutable/index';

/*
 * Given a method and a transaction record, create a promise for sending the
 * transaction with the method.
 */
async function getTransactionPromise(
  // @TODO this is not great but I feel like we will replace this anyways at some point
  client: ContractClient,
  tx: TransactionRecord,
): Promise<TransactionResponse> {
  const {
    methodName,
    options: {
      gasLimit: gasLimitOverride,
      gasPrice: gasPriceOverride,
      ...restOptions
    },
    params,
    gasLimit,
    gasPrice,
  } = tx;
  const sendOptions: TransactionOverrides = {
    gasLimit: gasLimitOverride || gasLimit,
    gasPrice: gasPriceOverride || gasPrice,
    ...restOptions,
  };
  return client[methodName](...[...params, sendOptions]);
}

export default getTransactionPromise;
