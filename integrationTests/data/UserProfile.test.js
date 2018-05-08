/* eslint-env jest */
import Factory from './factory';
import { sleep } from '../../src/utils/time';
import { retryUntilValue } from '../utils';

let factory = null;
let pinner = null;
let data1 = null;
let data2 = null;
let data3 = null;
let data4 = null;

beforeAll(async () => {
  factory = new Factory('UserProfile.test');
  pinner = await factory.pinner();
  data1 = await factory.Data('data1');
  await sleep(400); // prevent nodes with same keys
  data2 = await factory.Data('data2');
  await sleep(400); // prevent nodes with same keys
  data3 = await factory.Data('data3');
  await sleep(400); // prevent nodes with same keys
  data4 = await factory.Data('data4');

  await factory.ready();
}, Factory.TIMEOUT);

afterAll(async () => {
  await factory.clear();
}, Factory.TIMEOUT);


describe('User Profile', () => {
  test('Create my user profile component', async () => {
    const p1 = await data1.getMyUserProfile();
    expect(p1).toBeTruthy();
    expect(p1.isEmpty()).toBeTruthy();
  });

  test('Create my user profile and set its name', async () => {
    const p1 = await data2.getMyUserProfile();
    let name = factory.name('Kanye West');

    await p1.setName(name);

    expect(p1.isEmpty()).toBeFalsy();
    expect(p1.getName()).toBe(name);
  });

  test('Create my user profile and set its name sync with another', async () => {
    const p1 = await data3.getMyUserProfile();
    const p2 = await data4.getUserProfile(p1.address());
    let name = factory.name('Franz Kafka');

    await p1.setName(name);

    await sleep(1000);

    expect(p1.isEmpty()).toBeFalsy();
    expect(p2.isEmpty()).toBeFalsy();
    expect(p2.getName()).toBe(name);
  }, 55000);

  test('Create a user profile and subscribe to changes', async () => {
    // Arrange
    const p1 = await data2.getMyUserProfile();
    const p2 = await data3.getMyUserProfile(p1.address());
    let name = factory.name('Albert Camus');

    let update = {};
    p2.subscribe(x => {
      console.log('Subscription triggered with x=', x);
      update = x;
    })

    // Act
    await p1.setName(name);

    // Assert
    expect(await retryUntilValue(() => update.name)).toEqual(name);
  });
});
