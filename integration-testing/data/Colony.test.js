/* eslint-env jest */
import DDBTestFactory from '../utils/DDBTestFactory';
import { sleep } from '../../src/utils/time';
import logo from './logo.png';

const factory = new DDBTestFactory('ColonyModel.test');
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

describe('Data: a colony', () => {
  test('Can access a colony', async () => {
    const p1 = await data1.getColony('fakeAddress');
    expect(p1).toBeTruthy();
  });

  test('The colony database holds domain hashes', async () => {
    const p1 = await data1.getColony('fakeAddress');
    await p1.addDomain('domainAddress1');
    const domain = await p1.getDomains();
    expect(domain.length).toBe(1);
    expect(domain[0]).toBe('domainAddress1');
  });

  test('The colony database holds an avatar IPFS hash', async () => {
    await data2.setColonyAvatar('fakeAddress', logo);
    const p2 = await data2.getColony('fakeAddress');
    const avatar = await p2.getAvatar();
    expect(typeof avatar).toBe('string');
    expect(avatar.length).toBe(46);
  });

  test('The colony database has members', async () => {
    await data2.addMember('fakeAddress', 'memberOneId');
    const p3 = await data2.getColony('fakeAddress');
    const members = await p3.getMembers();
    expect(members.length).toBe(1);
    expect(members[0]).toBe('memberOneId');
  });
});
