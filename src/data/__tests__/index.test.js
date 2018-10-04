/* eslint-env jest */
import { DataAPI } from '../index';

describe('Data component', () => {
  let data = null;

  beforeAll(async () => {
    data = await DataAPI.fromDefaultConfig();
  });

  afterAll(async () => {
    await data.stop();
  });

  test('Create the initial Data object', async () => {
    expect(data).toBeTruthy();
  });

  test('The Data Object has a getUserProfileData method', async () => {
    expect(data.getUserProfileData).toBeTruthy();
  });
});
