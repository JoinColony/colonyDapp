/* eslint-env jest */
import DDBTestFactory from '../utils/DDBTestFactory';
import { sleep } from '../../src/utils/time';
import { retryUntilValue } from '../utils/tools';

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

describe('User Profile', () => {
  test(
    'Create my user profile component',
    async () => {
      const p1 = await data1.getMyUserProfile();
      expect(p1).toBeTruthy();
      expect(p1.isEmpty()).toBeTruthy();
    },
    DDBTestFactory.TIMEOUT,
  );

  test(
    'Create my user profile and set its name',
    async () => {
      const p1 = await data2.getMyUserProfile();
      const name = factory.name('Kanye West');

      await p1.setName(name);

      expect(p1.isEmpty()).toBeFalsy();
      expect(p1.getName()).toBe(name);
    },
    DDBTestFactory.TIMEOUT,
  );

  test(
    'Create my user profile and set its name sync with another',
    async () => {
      const p1 = await data3.getMyUserProfile();
      const p2 = await data4.getUserProfile(p1.address());
      const name = factory.name('Franz Kafka');

      await p1.setName(name);

      expect(p1.isEmpty()).toBeFalsy();
      expect(
        await retryUntilValue(() => p2.isEmpty(), { value: false }),
      ).toBeFalsy();
      expect(await retryUntilValue(() => p2.getName(), { value: name })).toBe(
        name,
      );
    },
    DDBTestFactory.TIMEOUT,
  );

  test(
    'Create a user profile and subscribe to changes',
    async () => {
      // Arrange
      const p1 = await data2.getMyUserProfile();
      const p2 = await data3.getUserProfile(p1.address());
      const name = factory.name('Albert Camus');

      let update = {};
      p2.subscribe(x => {
        update = x;
      });

      // Act
      await p1.setName(name);

      // Assert
      expect(await retryUntilValue(() => update.name)).toEqual(name);
    },
    DDBTestFactory.TIMEOUT,
  );
});
