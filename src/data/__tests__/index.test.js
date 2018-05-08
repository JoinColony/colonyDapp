/* eslint-env jest */
import Data from '../index'

const RANDOM_KEY = '0x64579b1de5b95ff5da197e8b04d8e03c73572c77';

describe('Data component', () => {
  test('Create the initial Data object', () => {
    const data = Data.fromDefaultConfig();
    expect(data).toBeTruthy();
  });

  test('The Data Object has a list peer method', () => {
    const data = Data.fromDefaultConfig();
    expect(data.listPeers()).toBeTruthy();
  })
});

describe('Data Profile', () => {
  test('The Data object lets me try to get user profiles', async () => {
    const data = Data.fromDefaultConfig();
    const profile = await data.getUserProfile(RANDOM_KEY);
    expect(profile.isEmpty()).toBe(true);
  });

  test('The User Profile object lets me update the content of a profile', async () => {
    const data = Data.fromDefaultConfig();
    const profile = await data.getUserProfile(RANDOM_KEY);

    await profile.setName('John Doe');
    expect(profile.name).toBe('John Doe');
  });

  test('Updated profile are not empty anymore', async () => {
    const data = Data.fromDefaultConfig();
    const profile = await data.getUserProfile(RANDOM_KEY);

    await profile.setName('John Doe');
    expect(profile.isEmpty()).toBe(false);
  });

});

