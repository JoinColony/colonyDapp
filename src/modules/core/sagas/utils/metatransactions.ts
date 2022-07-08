import { Network } from '@colony/colony-js';
import { BigNumberish } from 'ethers/utils';
import { soliditySha3 } from 'web3-utils';
import { hexSequenceNormalizer } from '@purser/core';

import { ContextModule, TEMP_getContext } from '~context/index';
import { Address } from '~types/index';

import { DEFAULT_NETWORK } from '~constants';

import { generateBroadcasterHumanReadableError } from './errorMessages';

export async function getChainId(): Promise<number> {
  const colonyManager = TEMP_getContext(ContextModule.ColonyManager);
  const { provider } = colonyManager;
  /*
   * @NOTE Short-circuit early, skip making an unnecessary RPC call
   */
  if (DEFAULT_NETWORK === Network.Local) {
    /*
     * Due to ganache internals shannanigans, when on the local ganache network
     * we must use chainId 1, otherwise the broadcaster (and the underlying contracts)
     * wont't be able to verify the signature (due to a chainId miss-match)
     *
     * This issue is only valid for ganache networks, as in production the chain id
     * is returned properly
     */
    return 1;
  }
  const { chainId } = await provider.getNetwork();
  return chainId;
}

export const generateEIP2612TypedData = (
  userAddress: Address,
  tokenName: string,
  chainId: number,
  verifyingContract: Address,
  spender: Address,
  value: BigNumberish,
  nonce: BigNumberish,
  deadline: number,
) => ({
  types: {
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ],
    Permit: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ],
  },
  primaryType: 'Permit',
  domain: {
    name: tokenName,
    version: '1',
    chainId,
    verifyingContract,
  },
  message: {
    owner: userAddress,
    spender,
    value: value.toString(),
    nonce: nonce.toString(),
    /*
     * @NOTE One hour in the future from now
     * Time is in seconds
     */
    deadline,
  },
});

export const generateMetatransactionMessage = async (
  encodedTransaction: string,
  contractAddress: Address,
  chainId: number,
  nonce: BigNumberish,
): Promise<{
  message: string;
  messageUint8: Uint8Array;
}> => {
  const message = soliditySha3(
    { t: 'uint256', v: nonce.toString() },
    { t: 'address', v: contractAddress },
    { t: 'uint256', v: chainId },
    { t: 'bytes', v: encodedTransaction },
  ) as string;

  // eslint-disable-next-line no-console
  console.log('Transaction message', message);

  const messageBuffer = Buffer.from(
    hexSequenceNormalizer(message, false),
    'hex',
  );

  const messageUint8 = (Array.from(messageBuffer) as unknown) as Uint8Array;
  /*
   * Purser validator expects either a string or a Uint8Array. We convert this
   * to a an array to make Metamask happy when signing the buffer.
   *
   * So in order to actually pass validation, both for Software and Metamask
   * wallets we need to "fake" the array as actually being a Uint.
   *
   * Note this not affect the format of the data passed in to be signed,
   * or the signature.
   */
  messageUint8.constructor = Uint8Array;

  // eslint-disable-next-line no-console
  console.log('Actual message converted into Uint8', messageUint8);

  return {
    message,
    messageUint8,
  };
};

export const broadcastMetatransaction = async (
  methodName: string,
  broadcastData: Record<string, any> = {},
): Promise<{
  responseData: {
    payload?: string;
    reason?: string;
    txHash?: string;
  };
  reponseStatus: 'fail' | 'success' | 'unknown';
  response: Response;
}> => {
  const response = await fetch(
    `${process.env.BROADCASTER_ENDPOINT}/broadcast`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(broadcastData),
    },
  );
  const {
    message: responseError,
    status: reponseStatus,
    data: responseData,
  } = await response.json();

  // eslint-disable-next-line no-console
  console.log('Response data', responseError, reponseStatus, responseData);

  if (reponseStatus !== 'success') {
    throw new Error(
      generateBroadcasterHumanReadableError(
        methodName,
        responseError,
        responseData,
      ),
    );
  }

  return {
    responseData,
    reponseStatus,
    response,
  };
};
