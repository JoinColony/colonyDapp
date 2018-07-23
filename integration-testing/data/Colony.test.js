/* eslint-env jest */
import DDBTestFactory from '../utils/DDBTestFactory';
import { sleep } from '../../src/utils/time';
import { retryUntilValue } from '../utils/tools';
import logo from './logo.png';

const factory = new DDBTestFactory('UserProfile.test');
let data1 = null;
let data2 = null;
let data3 = null;
let data4 = null;

beforeAll(async () => {
  await factory.pinner();

  data1 = await factory.Data('data1');
  await sleep(400); // prevent nodes with same keys
  data2 = await factory.Data('data2');
  await sleep(400); // prevent nodes with same keys
  data3 = await factory.Data('data3');
  await sleep(400); // prevent nodes with same keys
  data4 = await factory.Data('data4');

  await factory.ready();
}, DDBTestFactory.TIMEOUT);

afterAll(async () => {
  await factory.clear();
}, DDBTestFactory.TIMEOUT);

describe.only('Data: a colony', () => {
  test('Can access a colony', async () => {
    const p1 = await data1.getColony('fakeAddress');
    expect(p1).toBeTruthy();
  });

  test('The colony database holds domain hashes', async () => {});
  test('The colony database holds an avatar IPFS hash', async () => {
    await data2.setColonyAvatar('fakeAddress', logo);
    const p2 = await data2.getColony('fakeAddress');
    const avatar = await p2.getAvatar();
    expect(typeof avatar).toBe('string');
    expect(avatar.length).toBe(46);
  });
});
