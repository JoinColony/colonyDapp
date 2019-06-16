import createSandbox from 'jest-sandbox';
import RoomMonitorMock from 'ipfs-pubsub-peer-monitor';

import PinnerConnector from '../PinnerConnector';

jest.mock('orbit-db-pubsub');
jest.mock('ipfs-pubsub-peer-monitor');

const TEST_ROOM = 'PINNER_TEST_ROOM';

describe('PinnerConnector', () => {
  const sandbox = createSandbox();

  beforeEach(() => {
    sandbox.clear();
  });

  const mockIpfs = {
    id: jest.fn(() => ({ id: 'fakeId' })),
    pubsub: {
      subscribe: jest.fn(() => Promise.resolve(true)),
      unsubscribe: jest.fn(() => Promise.resolve(true)),
    },
  };

  test('Constructor', () => {
    const connector = new PinnerConnector(mockIpfs, TEST_ROOM);
    expect(connector._ipfs).toBe(mockIpfs);
  });

  test('Initialization', async () => {
    const connector = new PinnerConnector(mockIpfs, TEST_ROOM);

    await connector.init();
    expect(mockIpfs.id).toHaveBeenCalled();
    expect(connector._id).toBe('fakeId');
    expect(mockIpfs.pubsub.subscribe).toHaveBeenCalledWith(
      TEST_ROOM,
      expect.any(Function),
    );
    expect(RoomMonitorMock).toHaveBeenCalledWith(mockIpfs.pubsub, TEST_ROOM);
    expect(connector._roomMonitor.on).toHaveBeenCalledWith(
      'leave',
      expect.any(Function),
    );
    expect(connector._roomMonitor.on).toHaveBeenCalledWith(
      'error',
      expect.any(Function),
    );
  });
});
