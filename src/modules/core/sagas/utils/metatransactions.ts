import { Network } from '@colony/colony-js';
import { BigNumberish } from 'ethers/utils';

import { ContextModule, TEMP_getContext } from '~context/index';
import { Address } from '~types/index';

import { DEFAULT_NETWORK } from '~constants';

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
    nonce: nonce?.toString(),
    /*
     * @NOTE One hour in the future from now
     * Time is in seconds
     */
    deadline,
  },
});
