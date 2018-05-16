import { bigNumberify } from 'ethers/utils';
import { isAddress } from 'web3-utils';
import { getNetworkClient } from './utils/network-client-helpers';

const colonyName = 'Integration Tests Colony';
let colonyAddress;
let colonyToken;

describe('`ColonyClient` is able to', () => {
  test('Create a new Colony (instance)', async () => {
    /*
     * Get the network client
     */
    const networkClient = await getNetworkClient();
    /*
     * Create a new colony
     */
    const colonyClientInstance = await networkClient.createColony.send(
      {
        name: colonyName,
        tokenAddress: await networkClient.createToken({
          name: 'Integration Test Token',
          symbol: 'ITT',
        }),
      },
      {
        gasLimit: bigNumberify(7000000),
        waitForMining: true,
      },
    );
    expect(colonyClientInstance).toHaveProperty('eventData');
    expect(colonyClientInstance.eventData).toHaveProperty('colonyId');
    /*
     * Get the Colony's Instance
     */
    const colonyClient = await networkClient.getColonyClient({
      id: colonyClientInstance.eventData.colonyId,
    });
    expect(isAddress(colonyClient.contract.address)).toBeTruthy();
    /*
     * Save address for later (so we can check against)
     */
    colonyAddress = colonyClient.contract.address;
    /*
     * Check if valid methods are available
     */
    expect(colonyClient).toHaveProperty('getTask');
    expect(colonyClient).toHaveProperty('getNonRewardPotsTotal');
    expect(colonyClient).toHaveProperty('getPotBalance');
    expect(colonyClient).toHaveProperty('getTaskCount');
    expect(colonyClient).toHaveProperty('getTaskPayout');
    expect(colonyClient).toHaveProperty('getTaskRole');
    expect(colonyClient).toHaveProperty('getTaskWorkRatings');
    expect(colonyClient).toHaveProperty('getTaskWorkRatingSecret');
    expect(colonyClient).toHaveProperty('getToken');
    expect(colonyClient).toHaveProperty('addDomain');
    expect(colonyClient).toHaveProperty('addGlobalSkill');
    expect(colonyClient).toHaveProperty('assignWorkRating');
    expect(colonyClient).toHaveProperty('cancelTask');
    expect(colonyClient).toHaveProperty('claimColonyFunds');
    expect(colonyClient).toHaveProperty('claimPayout');
    expect(colonyClient).toHaveProperty('createTask');
    expect(colonyClient).toHaveProperty('finalizeTask');
    expect(colonyClient).toHaveProperty('mintTokens');
    expect(colonyClient).toHaveProperty('mintTokensForColonyNetwork');
    expect(colonyClient).toHaveProperty('moveFundsBetweenPots');
    expect(colonyClient).toHaveProperty('revealTaskWorkRating');
    expect(colonyClient).toHaveProperty('submitTaskDeliverable');
    expect(colonyClient).toHaveProperty('submitTaskWorkRating');
    /*
     * Save the tokens address for later (so we can check against)
     */
    colonyToken = await colonyClient.getToken.call().address;
  });
  test('Recover an existing Colony', async () => {
    /*
     * Get the network client
     */
    const networkClient = await getNetworkClient();
    /*
     * Recover the colony using it's name
     */
    const recoveredColonyClientInstance = await networkClient.getColonyClient({
      key: colonyName,
    });
    /*
     * The recovered Colony should have the same contract address and token
     * address as the one created previously
     */
    expect(recoveredColonyClientInstance.contract.address).toEqual(
      colonyAddress,
    );
    expect(await recoveredColonyClientInstance.getToken.call().address).toEqual(
      colonyToken,
    );
  });
});
