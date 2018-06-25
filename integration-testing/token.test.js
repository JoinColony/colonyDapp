import { isAddress } from 'web3-utils';
import { bigNumberify } from 'ethers/utils';
import { getNetworkClient } from './utils/network-client-helpers';

const tokensToMint = 1000;

describe('`ColonyNetworkClient` is able to', () => {
  test('Create and deploy a new Token', async () => {
    const networkClient = await getNetworkClient();
    /*
     * Create a new token
     */
    const token = await networkClient.createToken({
      name: 'Integration Test Token',
      symbol: 'ITT',
    });
    /*
     * Check if it's a valid address
     */
    expect(isAddress(token)).toBeTruthy();
  });
  test('Make the Colony owner of the Token', async () => {
    /*
     * Get the network client
     */
    const networkClient = await getNetworkClient();
    /*
     * Get the number of colonies. This will also represent the last created
     * colony's Id which we created in the previous step.
     */
    const { count: lastColonyId } = await networkClient.getColonyCount.call();
    /*
     * Get the existing colony
     */
    const colonyClient = await networkClient.getColonyClient(lastColonyId);
    /*
     * Get the token's owner
     */
    const tokenOwner = await colonyClient.token.contract.owner();
    /*
     * Make the colony the owner of the Token
     *
     * We only do this if the colony isn't already an owner, otherwise your
     * trasaction will revert.
     */
    if (tokenOwner !== colonyClient.contract.address) {
      const tokenAuthorityTransaction = await colonyClient.token.setOwner.send({
        owner: colonyClient.contract.address,
      });
      expect(tokenAuthorityTransaction).toHaveProperty('successful', true);
      expect(tokenAuthorityTransaction.eventData).toHaveProperty(
        'owner',
        colonyClient.contract.address,
      );
    }
  });
  test('Mint new tokens', async () => {
    /*
     * Get the network client
     */
    const networkClient = await getNetworkClient();
    /*
     * Get the number of colonies. This will also represent the last created
     * colony's Id which we created in the previous step.
     */
    const { count: lastColonyId } = await networkClient.getColonyCount.call();
    /*
     * Get the existing colony
     */
    const colonyClient = await networkClient.getColonyClient(lastColonyId);
    /*
     * Get the amount of tokens before minting new ones
     */
    const {
      amount: initialTokenAmount,
    } = await colonyClient.token.getTotalSupply.call();
    /*
     * Mint new tokens, but only if there aren't any in the Colony
     */
    if (initialTokenAmount.toNumber() === 0) {
      const mintTokensTransaction = await colonyClient.mintTokens.send({
        amount: bigNumberify(tokensToMint),
      });
      expect(mintTokensTransaction).toHaveProperty('successful', true);
      const {
        amount: currentTokenAmount,
      } = await colonyClient.token.getTotalSupply.call();
      expect(currentTokenAmount.toNumber()).toEqual(tokensToMint);
    }
  });
});
