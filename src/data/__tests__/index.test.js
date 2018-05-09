/* eslint-env jest */
import Data from '../index'

const RANDOM_KEY = '0x64579b1de5b95ff5da197e8b04d8e03c73572c77';

describe('Data component', () => {
  let data = null;

  beforeAll(async () => {
    data = await Data.fromDefaultConfig();
  })

  afterAll(async () => {
    await data.stop();
  })

  test('Create the initial Data object', async () => {
    expect(data).toBeTruthy();
  });

  test('The Data Object has a list peer method', async () => {
    expect(data.listPeers).toBeTruthy();
  })
});

