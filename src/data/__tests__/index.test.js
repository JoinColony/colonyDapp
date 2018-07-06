/* eslint-env jest */
import Data from '../index';

describe('Data component', () => {
  let data = null;

  beforeAll(async () => {
    data = await Data.fromDefaultConfig();
  });

  afterAll(async () => {
    await data.stop();
  });

  test('Create the initial Data object', async () => {
    expect(data).toBeTruthy();
  });

  // test('The Data Object has a list peer method', async () => {
  //   expect(data.listPeers).toBeTruthy();
  // });
});
