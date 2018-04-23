/* eslint-env jest */
import Data from '../../src/data'

let data = null;
let data2 = null;

describe('User Profile', () => {
  beforeAll(async () => {
    data = await Data.fromDefaultConfig();
    data2 = await Data.fromDefaultConfig({ repo: 'anotherRepo' });
  })

  afterAll(async () => {
    await data.close();
    await data2.close();
  })

  test('Create my user profile component', async () => {
    const p1 = await data.getMyUserProfile();
    expect(p1).toBeTruthy();
  });

  test('Create my user profile and set its name', async () => {
    const p1 = await data.getMyUserProfile();
    await p1.setName('JohnDoe');
    expect(p1.name).toBe('JohnDoe');
  })

  test('Create my user profile and set its name sync with another', async () => {
    const p1 = await data.getMyUserProfile();
    await p1.setName('JohnDoe2');

    const p2 = await data2.getUserProfile(p1.publicKey);
    expect(p2.name).toBe('JohnDoe2');
  })
});
