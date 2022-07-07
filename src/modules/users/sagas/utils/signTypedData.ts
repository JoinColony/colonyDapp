import { splitSignature } from 'ethers/utils';
import { JsonRpcProvider } from 'ethers/providers';

import { ContextModule, TEMP_getContext } from '~context/index';
import { promisify } from '~utils/async';
import { RpcMethods } from '~types/index';

export async function ganacheSignTypedData(
  typedData: Record<string, any>,
): Promise<{ signature: string; r: string; s: string; v?: number }> {
  const colonyManager = TEMP_getContext(ContextModule.ColonyManager);
  const { provider } = colonyManager;

  const signature = await (provider as JsonRpcProvider).send(
    RpcMethods.SignTypedData,
    [this.address, typedData],
  );

  const { r, s, v } = splitSignature(signature);
  return { r, s, v, signature };
}

export async function metamaskSignTypedData(
  typedData: Record<string, any>,
): Promise<{ signature: string; r: string; s: string; v?: number }> {
  /*
   * @NOTE Ignore is used here to deal with Typescript not knowing
   * about the `web3` instance and provider injected by Metamask
   */
  // @ts-ignore
  const metamaskSendMethod = promisify(window.ethereum.sendAsync);

  const { result: signature } = (await metamaskSendMethod({
    method: RpcMethods.SignTypedDataV4,
    params: [this.address, JSON.stringify(typedData)],
    id: new Date().getTime(),
  })) as { id: number; jsonrpc: string; result: string };

  const { r, s, v } = splitSignature(signature);
  return { r, s, v, signature };
}
