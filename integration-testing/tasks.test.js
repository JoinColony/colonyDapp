import { toUtf8String } from 'ethers/utils';
import { getNetworkClient } from './utils/network-client-helpers';

const colonyName = 'Integration Tests Colony';
const taskName = 'Integration Tests Task';

describe('`ColonyClient` is able to', () => {
  test('Create a new Task within the Colony', async () => {
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
    /*
     * Get the total number of tasks in this colony (so we can test against)
     */
    const { count: taskCountBefore } = await colonyClient.getTaskCount.call();
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
    /*
     * Check that the transaction was successful
     */
    expect(newTaskTransaction).toHaveProperty('successful', true);
    /*
     * Check the number of tasks. There should be one more.
     */
    const taskCountAfter = await colonyClient.getTaskCount.call();
    expect(taskCountAfter).toHaveProperty('count', taskCountBefore + 1);
  });
  test('Get a Task that exists in the Colony', async () => {
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
    /*
     * Get the total number of tasks so we can use the last existent task's id
     */
    const { count: lastTaskId } = await colonyClient.getTaskCount.call();
    /*
     * Get the task
     */
    const existingTask = await colonyClient.getTask.call({
      taskId: lastTaskId,
    });
    expect(existingTask).toBeInstanceOf(Object);
    expect(existingTask).toHaveProperty('id');
    /*
     * The task should not be finalized or cancelled
     *
     * This, again, is a little jury-rigged since some other tests that we might
     * add can change the latest task. but for the current purpouse this works.
     *
     * @TODO Make the get task test less fragile
     *
     * Most likely this will involve creating a new task specially just to read it.
     */
    expect(existingTask).toHaveProperty('cancelled', false);
    expect(existingTask).toHaveProperty('finalized', false);
    /*
     * The task should have the correct speciification hash.
     */
    const { specificationHash: existingTaskSpecificationHash } = existingTask;
    expect(toUtf8String(existingTaskSpecificationHash)).toMatch(taskName);
  });
});
