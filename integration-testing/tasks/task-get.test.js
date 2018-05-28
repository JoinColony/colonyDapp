import { toUtf8String } from 'ethers/utils';
import { getNetworkClient } from '../utils/network-client-helpers';

const colonyName = 'Integration Tests Colony';
const taskName = 'Integration Tests Task';

describe('`ColonyClient` is able to', () => {
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
