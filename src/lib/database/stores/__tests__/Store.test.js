import createSandbox from 'jest-sandbox';

import createMockOrbitStore from './mockOrbitStore';
import KVStore from '../KVStore';

const name = 'storeId';

describe('Store (KVStore)', () => {
  const sandbox = createSandbox();

  const mockOrbitStore = createMockOrbitStore(sandbox);

  const mockPinner = {
    requestPinnedStore: sandbox.fn(() => ({ count: 5 })),
  };

  beforeEach(() => {
    sandbox.clear();
  });

  test('It waits for replication when loading', async () => {
    const store = new KVStore(mockOrbitStore, name, mockPinner);

    sandbox
      .spyOn(store._orbitStore, 'load')
      .mockImplementation(async () => null);

    // Mock the event emitter
    const listeners = {};
    sandbox
      .spyOn(store._orbitStore.events, 'once')
      .mockImplementation((eventName, handler) => {
        listeners[eventName] = handler;
      });

    sandbox.spyOn(store, '_waitForReplication').mockImplementation(() => true);

    const loadPromise = store.load();

    expect(loadPromise).toBeInstanceOf(Promise);
    expect(listeners.ready).toEqual(expect.any(Function));

    listeners.ready(); // Emit the event manually

    await loadPromise;

    expect(store._orbitStore.load).toHaveBeenCalledTimes(1);
    expect(store._orbitStore.events.once).toHaveBeenCalledTimes(1);
    expect(store._orbitStore.events.once).toHaveBeenCalledWith(
      'ready',
      expect.any(Function),
    );
  });
});
