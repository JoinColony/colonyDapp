import createSandbox from 'jest-sandbox';

import createMockOrbitStore from './mockOrbitStore';
import EventStore from '../EventStore';

describe('EventStore', () => {
  const sandbox = createSandbox();
  const mockOrbitStore = createMockOrbitStore(sandbox);

  const mockPinner = {
    requestPinnedStore: sandbox.fn(() => ({ count: 5 })),
  };

  beforeEach(() => {
    sandbox.clear();
  });

  const name = 'colony-store';
  const type = 'eventlog';

  test('It creates a EventStore', () => {
    const store = new EventStore(mockOrbitStore, name, mockPinner);
    expect(store._orbitStore).toBe(mockOrbitStore);
    expect(store._name).toBe(name);
    expect(store.constructor.orbitType).toBe(type);
  });

  test('It can append an event to the log', async () => {
    const store = new EventStore(mockOrbitStore, name, mockPinner);
    sandbox.spyOn(store, 'add');
    const eventPayload = {
      colonyName: 'Zombies',
      user: 'jimmy',
    };
    await store.add(eventPayload);
    expect(store.add).toHaveBeenCalledWith(eventPayload);
  });
});
