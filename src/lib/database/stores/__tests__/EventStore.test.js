import createSandbox from 'jest-sandbox';

import createMockOrbitStore from './mockOrbitStore';
import EventStore from '../EventStore';

describe('EventStore', () => {
  const sandbox = createSandbox();
  const mockOrbitStore = createMockOrbitStore(sandbox);

  const mockPinner = {
    requestReplication: sandbox.fn(() => ({ count: 5 })),
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
});
