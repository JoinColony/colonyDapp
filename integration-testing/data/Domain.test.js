/* eslint-env jest */
import DDBTestFactory from '../utils/DDBTestFactory';
import { sleep } from '../../src/utils/time';

const factory = new DDBTestFactory('DomainModel.test');
let data1 = null;
let data2 = null;
let data3 = null;

beforeAll(async () => {
  await factory.pinner();

  data1 = await factory.Data('data1');
  await sleep(400); // prevent nodes with same keys
  data2 = await factory.Data('data2');
  await sleep(400); // prevent nodes with same keys
  data3 = await factory.Data('data3');

  await factory.ready();
}, DDBTestFactory.TIMEOUT);

afterAll(async () => {
  await factory.clear();
}, DDBTestFactory.TIMEOUT);

describe('Data: a domain', () => {
  test('Can access a domain', async () => {
    const p1 = await data1.getDomain('fakeAddress');
    expect(p1).toBeTruthy();
    expect(typeof p1.address()).toBe('string');
  });

  test('The domain database has a funding pot', async () => {});

  test('The domain database holds task objects', async () => {});

  test('The Data API adds a task to a domain', async () => {
    await data2.draftTask('fakeAddress3', {
      _id: 'shortID',
      spec: 'fakeIPFSHash',
      bounty: 25,
    });
    const tasks = await data2.getDomainTasks('fakeAddress3');
    expect(tasks.length).toBe(1);
    expect(tasks[0].spec).toBe('fakeIPFSHash');
  });

  test('The Data API adds a comment to a task', async () => {
    await data3.draftTask('fakeAddress3', {
      _id: 'shortID',
      spec: 'fakeIPFSHash',
      bounty: 25,
    });

    await data3.addComment(
      'fakeAddress3',
      'shortID',
      'gosh what a wonderful task',
    );
    const comments = await data3.getTaskComments('fakeAddress3', 'shortID');
    expect(comments.length).toBe(1);
    expect(comments[0]).toEqual(
      expect.stringMatching('gosh what a wonderful task'),
    );
  });

  // TODO do we really need this?
  test('Only the manager, worker, or evaluator can edit the task', async () => {});
});
