import { Network } from '@colony/colony-js';

import { ContextModule, TEMP_getContext } from '~context/index';
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
