import { getNetworkClient } from './utils/network-client-helpers';

const colonyName = 'Integration Tests Colony';

describe('`ColonyClient` is able to', () => {
  test('Create a new Domain within the Colony', async () => {
    /*
     * Get the network client
     */
    const networkClient = await getNetworkClient();
    /*
     * Get the existing colony
     */
    const colonyClient = await networkClient.getColonyClient({
      key: colonyName,
    });
    const domainCountBefore = await colonyClient.getDomainCount.call();
    /*
     * We have just the parent local skill that was added by default when the
     * colony was created
     */
    expect(domainCountBefore).toHaveProperty('count', 1);
    /*
     * Since this is the first domain, in the first colony, it's Id is `3`
     *
     * The first two are reserved for the meta colony's skills
     */
    const newDomainTransaction = await colonyClient.addDomain.send({
      parentSkillId: 3,
    });
    expect(newDomainTransaction).toHaveProperty('successful', true);
    const domainCountAfter = await colonyClient.getDomainCount.call();
    /*
     * If all goes to plan we should have another domain
     */
    expect(domainCountAfter).toHaveProperty('count', 2);
    /*
     * But we shouln't be able to add a new domain to the meta colony's skill
     */
    try {
      await colonyClient.addDomain.send({
        parentSkillId: 1,
      });
    } catch (e) {
      const domainCountAfterCatching = await colonyClient.getDomainCount.call();
      /*
       * Count should still be 2 since we shouldn't have been able to add
       * a new domain
       */
      expect(domainCountAfterCatching).toHaveProperty('count', 2);
    }
  });
});
