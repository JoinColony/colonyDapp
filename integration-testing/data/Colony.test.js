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
    const p1 = await data1._getColony('fakeAddress');
    expect(p1).toBeTruthy();
  });

  test('The colony model accepts domain hashes', async () => {
    await data1.addColonyDomain('fakeAddress', 'domainAddress1');
    const domain = await data1.getColonyDomains('fakeAddress');
    expect(domain.length).toBe(1);
    expect(domain[0]).toBe('domainAddress1');
  });

  test('The colony model accepts a funding pot', async () => {
    await data2.setColonyPot('fakeAddress2', { ETH: 1 });
    const pot = await data2.getColonyPot('fakeAddress2');
    expect(pot.ETH).toBe(1);
  });

  test('The Data API sets a colony pot', async () => {
    await data2.setColonyPot('fakeAddress2', { ETH: 1 });
    const pot = await data2.getColonyPot('fakeAddress2');
    expect(pot.ETH).toBe(1);
  });

  test('The Data API adds members to a colony', async () => {
    await data2.addColonyMember('fakeAddress2', 'fakeID');
    const members = await data2.getColonyMembers('fakeAddress2');
    expect(members.length).toBe(1);
    expect(members[0]).toBe('fakeID');
  });

  test.skip('The Data API adds a domain to a colony', async () => {
    await data1.addColonyDomain('fakeAddress', 'domainAddress2');
    const domain = await data1.getColonyDomains('fakeAddress');
    expect(domain.length).toBe(1);
    expect(domain[0]).toBe('domainAddress1');
  });

  test.skip('The Data API holds an avatar IPFS hash', async () => {
    await data2.setColonyAvatar('fakeAddress', logo);
    const p2 = await data2.getColony('fakeAddress');
    const avatarHash = await p2.getAvatar();
    expect(typeof avatarHash).toBe('string');
    expect(avatarHash.length).toBe(46);

    const avatar = await data2.getColonyAvatar('fakeAddress');
    expect(avatar).toBe(logo);
    expect(typeof avatar).toBe('string');
  });
});
