/* eslint-env jest */
import PinnerClient from '../../src/lib/pinningService/packages/pinning-service-client/src';

let pinnerClient = null;

beforeAll(async () => {
  pinnerClient = PinnerClient.fromConfig({ host: 'http://localhost:9090' });
  await pinnerClient.ready();
});

describe('Smoke test', () => {
  test('client is online', async () => {
    expect(await pinnerClient.isOnline()).toBe(true);
  });
});


