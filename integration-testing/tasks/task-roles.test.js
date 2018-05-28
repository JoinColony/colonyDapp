import { getNetworkClient } from '../utils/network-client-helpers';

const colonyName = 'Integration Tests Colony';
const taskName = 'Integration Tests Task';

const managerAddress = Object.keys(global.ganacheAccounts.private_keys)[0];
const workerAddress = Object.keys(global.ganacheAccounts.private_keys)[1];

describe('`ColonyClient` is able to', () => {
  test('Set the role for a task', async () => {
    /*
     * Get the network client
     */
    const networkClient = await getNetworkClient(managerAddress);
    /*
     * Get the existing colony
     */
    const colonyClient = await networkClient.getColonyClient({
      key: colonyName,
    });
    /*
     * This is a little jury-rigged, since later tests might create new colonies,
     * which in turn will make this value to not be reliable.
     *
     * But as it stands, this is the Id of the latest domain we created in this
     * colony during the `domain` integration tests.
     */
    const { count: latestDomainId } = await colonyClient.getDomainCount.call();
    /*
     * Create the task under the last domain create in this colony.
     * (See above about the caveat on this)
     */
    const newTaskTransaction = await colonyClient.createTask.send({
      specificationHash: taskName,
      domainId: latestDomainId,
    });
    const { eventData: { taskId: newTaskId } } = newTaskTransaction;
    /*
     * Check the task has manager role assigned
     *
     * Role `0` = manager
     * Role `1` = evaluator
     * Role `3` = worker
     *
     * @NOTE Convert addresses to lowercase
     *
     * This will normalize them when checking one against the other
     */
    const { address: managerRoleAddress } = await colonyClient.getTaskRole.call(
      { taskId: newTaskId, role: 0 },
    );
    expect(managerRoleAddress.toLowerCase()).toEqual(
      managerAddress.toLowerCase(),
    );
    /*
     * Check tha the task does not have a worker role assigned
     */
    const { address: workerRoleNull } = await colonyClient.getTaskRole.call({
      taskId: newTaskId,
      role: 3,
    });
    expect(workerRoleNull).toBe(null);
    /*
     * Set another address as the worker
     */
    const setTaskRoleTransaction = await colonyClient.setTaskRoleUser.send({
      taskId: newTaskId,
      role: 3,
      user: workerAddress,
    });
    expect(setTaskRoleTransaction).toHaveProperty('successful', true);
    /*
     * Check tha the task now has a worker role, and is the correct one
     */
    const { address: workerRoleAddress } = await colonyClient.getTaskRole.call({
      taskId: newTaskId,
      role: 3,
    });
    expect(workerRoleAddress.toLowerCase()).toBe(workerAddress.toLowerCase());
  });
});
