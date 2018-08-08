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
    expect(p1.address().path).toBe('fakeAddress');
  });

  test('The Data API sets a domain pot', async () => {
    await data1.setDomainPot('fakeAddress2', { ETH: 1 });
    const pot = await data1.getDomainPot('fakeAddress2');
    expect(pot.ETH).toBe(1);
  });

  test('The Data API adds members to a domain', async () => {
    await data2.addDomainMember('fakeAddress4', 'memberOneId');
    const members = await data2.getDomainMembers('fakeAddress4');
    expect(members.length).toBe(1);
    expect(members[0]).toBe('memberOneId');
  });

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

  test.skip('Only the manager, worker, or evaluator can edit the task', async () => {});
  test.skip('Only a domain member can create a task', async () => {});
  test.skip('The Data API adds a spec to a task', async () => {});
  test.skip('Someone assigned to a task is also added to the domain', async () => {});
});
