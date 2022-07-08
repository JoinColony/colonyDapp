import { Contract } from 'ethers';
import { TransactionResponse } from 'ethers/providers';
import { BigNumberish, splitSignature } from 'ethers/utils';
import { ContractClient, ClientType } from '@colony/colony-js';
import { switchChain } from '@purser/metamask/lib-esm/helpers';

import {
  generateMetatransactionErrorMessage,
  generateMetamaskTypedDataSignatureErrorMessage,
} from '~utils/web3';
import { TRANSACTION_METHODS, TransactionRecord } from '~immutable/index';
import { ContextModule, TEMP_getContext } from '~context/index';
import { XDAI_NETWORK } from '~constants';
import { metamaskSwitchNetwork } from '../../../users/sagas/wallet';
import {
  ExtendedClientType,
  MethodParams,
  MetatransactionFlavour,
  MetamaskRpcErrors,
} from '~types/index';

import {
  getChainId,
  generateEIP2612TypedData,
  generateMetatransactionMessage,
  broadcastMetatransaction,
} from '../utils';

async function getMetatransactionPromise(
  client: ContractClient,
  { methodName, params, identifier: clientAddress, id }: TransactionRecord,
): Promise<TransactionResponse> {
  const wallet = TEMP_getContext(ContextModule.Wallet);
  const colonyManager = TEMP_getContext(ContextModule.ColonyManager);
  const { networkClient } = colonyManager;
  const { address: userAddress } = wallet;
  const chainId = await getChainId();

  let normalizedMethodName: string = methodName;
  let normalizedClient: ContractClient = client;
  let lightTokenClient: ContractClient = client;
  let normalizedParams: MethodParams = params;
  let availableNonce: BigNumberish | undefined;
  let broadcastData: Record<string, any> = {};

  switch (methodName) {
    /*
     * For metatransactions we have to use the DeployTokenViaNetwork method
     */
    case TRANSACTION_METHODS.DeployToken:
      normalizedMethodName = TRANSACTION_METHODS.DeployTokenViaNetwork;
      break;
    /*
     * DeployTokenAuthority is not available on the contracts in normal circumstances (we add it via colonyJS)
     * But with metatransactions, it exits, but on a different client, with different params
     * So we have to do this ugly switch-aroo just to make the different api happy :(
     */
    case TRANSACTION_METHODS.DeployTokenAuthority: {
      normalizedClient = networkClient;
      const [tokenAddress, allowedToTransfer] = params;
      normalizedParams = [
        tokenAddress,
        clientAddress as string,
        allowedToTransfer,
      ];
      break;
    }
    default:
      break;
  }

  // eslint-disable-next-line no-console
  console.log('NORMALIZED CLIENT', normalizedClient);

  /*
   * @NOTE We have two ways to go about Metatransactions when it comes to the Token Client
   * Either vanilla metransactions or Signed Approvals (EIP2612). We need to check for both,
   * and attempt to use of them
   */
  if (normalizedClient.clientType === ClientType.TokenClient) {
    // eslint-disable-next-line no-console
    console.log(`We're using a Token Client`);

    /*
     * @NOTE If it's a TokenClient we need to reinstantiate as the "light" token client
     * basically a frankenstein's monster (currently) supporting both Metatransactions
     * and EIP-2612 (or attempting to anyway)
     */
    lightTokenClient = new Contract(
      clientAddress as string,
      [
        'function getMetatransactionNonce(address) view returns (uint256)',
        'function nonces(address) view returns (uint256)',
      ],
      colonyManager.signer,
    );
    lightTokenClient.clientType = ClientType.TokenClient;
    lightTokenClient.tokenClientType = ExtendedClientType.LightTokenClient;
    lightTokenClient.metatransactionVariation = MetatransactionFlavour.Vanilla;

    // eslint-disable-next-line no-console
    console.log('LIGHT TOKEN CLIENT', lightTokenClient);

    /*
     * See if the token supports Metatransactions
     */
    try {
      availableNonce = await lightTokenClient.getMetatransactionNonce(
        userAddress,
      );
      lightTokenClient.metatransactionVariation =
        MetatransactionFlavour.Vanilla;
    } catch (error) {
      // silent error
    }
    /*
     * Otherwise, see if supports EIP-2612
     * https://eips.ethereum.org/EIPS/eip-2612
     */
    try {
      availableNonce = await lightTokenClient.nonces(userAddress);
      lightTokenClient.metatransactionVariation =
        MetatransactionFlavour.EIP2612;
    } catch (error) {
      // silent error
    }
    /*
     * @TODO REMOVE!!
     */
    // lightTokenClient.metatransactionVariation = MetatransactionFlavour.EIP2612;

    if (!availableNonce) {
      throw new Error(generateMetatransactionErrorMessage(lightTokenClient));
    }
  } else {
    /*
     * If the client we're going to query doesn't have such a call it means that
     * most likely it doesn't support metatransactions.
     * This can be either our contracts (older ones) or external contracts without
     * support
     */
    try {
      availableNonce = await normalizedClient.getMetatransactionNonce(
        userAddress,
      );
    } catch (error) {
      throw new Error(generateMetatransactionErrorMessage(normalizedClient));
    }
  }

  // eslint-disable-next-line no-console
  console.log('Current NONCE', availableNonce);

  // eslint-disable-next-line no-console
  console.log(
    'Transaction to send',
    normalizedClient.clientType,
    normalizedMethodName,
    params,
  );

  /*
   * @NOTE For the EIP2612 metatransaction variation we only support the
   * TokenClient.approve method, every other call needs to go through
   * vanilla metatransactions
   */
  if (
    normalizedClient.clientType === ClientType.TokenClient &&
    lightTokenClient.metatransactionVariation ===
      MetatransactionFlavour.EIP2612 &&
    normalizedMethodName === TRANSACTION_METHODS.Approve
  ) {
    // eslint-disable-next-line no-console
    console.log(
      `Token Client is using the ${lightTokenClient.metatransactionVariation} variation`,
    );
    const tokenName = await normalizedClient.name();
    const [spender, amount] = params;
    const deadline = Math.floor(Date.now() / 1000) + 3600;

    try {
      const { r, s, v } = await wallet.signTypedData(
        generateEIP2612TypedData(
          userAddress,
          tokenName,
          chainId,
          normalizedClient.address,
          spender as string,
          amount as BigNumberish,
          availableNonce as BigNumberish,
          deadline,
        ),
      );

      broadcastData = {
        target: normalizedClient.address,
        owner: userAddress,
        spender,
        value: amount.toString(),
        deadline,
        r,
        s,
        v,
      };

      // eslint-disable-next-line no-console
      console.log('Broadcast data', broadcastData);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("User's wallet", wallet);

      // eslint-disable-next-line no-underscore-dangle
      const { chainId: walletChainId } = wallet?.mmProvider?._network || {};
      /*
       * @NOTE If we're singning typed data, with Metamask, we need to be on the same
       * chain as Dapp and contracts deployment
       */
      if (wallet.subtype === 'metamask' && walletChainId !== chainId) {
        if (chainId === XDAI_NETWORK.chainId) {
          /*
           * @NOTE This actually adds the network if it doesn't exist
           */
          metamaskSwitchNetwork(true).next();
        } else {
          switchChain(chainId);
        }
        if (
          error.message.includes(MetamaskRpcErrors.TypedDataSignDifferentChain)
        ) {
          throw new Error(
            generateMetamaskTypedDataSignatureErrorMessage(chainId),
          );
        }
      }
      throw new Error(error.message);
    }
  } else {
    // eslint-disable-next-line no-console
    console.log('Broadcasting transaction as VANILLA Metadata variation');

    /*
     * All the 'WithProofs' helpers don't really exist on chain, so we have to
     * make sure we are calling the on-chain method, rather than our own helper
     */
    const encodedTransaction = await normalizedClient.interface.functions[
      normalizedMethodName
    ].encode([...normalizedParams]);

    // eslint-disable-next-line no-console
    console.log('Encoded transaction', encodedTransaction);

    const { messageUint8: messageData } = await generateMetatransactionMessage(
      encodedTransaction,
      normalizedClient.address,
      chainId,
      availableNonce as BigNumberish,
    );

    const metatransactionSignature = await wallet.signMessage({
      messageData,
    });

    // eslint-disable-next-line no-console
    console.log('Signature', metatransactionSignature);

    const { r, s, v } = splitSignature(metatransactionSignature);

    broadcastData = {
      target: normalizedClient.address,
      payload: encodedTransaction,
      userAddress,
      r,
      s,
      v,
    };

    // eslint-disable-next-line no-console
    console.log('Broadcast data', broadcastData);
  }

  const {
    responseData: { txHash: hash },
  } = await broadcastMetatransaction(normalizedMethodName, broadcastData);

  // eslint-disable-next-line no-console
  console.log(`Metatransaction ${id} done ------------`);

  return { hash } as TransactionResponse;
}

export default getMetatransactionPromise;
