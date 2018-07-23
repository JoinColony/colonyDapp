/* eslint-env jest */
import DDBTestFactory from '../utils/DDBTestFactory';
import { sleep } from '../../src/utils/time';

const factory = new DDBTestFactory('DomainModel.test');
let data1 = null;
let data2 = null;

beforeAll(async () => {
  await factory.pinner();

  data1 = await factory.Data('data1');
  await sleep(400); // prevent nodes with same keys
  data2 = await factory.Data('data2');

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

  test('Tasks hold comments', async () => {});

  // TODO do we really need this?
  test('Only the manager, worker, or evaluator can edit the task', async () => {});
});
