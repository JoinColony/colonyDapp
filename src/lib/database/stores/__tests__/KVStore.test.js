import createSandbox from 'jest-sandbox';

import createMockOrbitStore from './mockOrbitStore';
import KVStore from '../KVStore';

const name = 'kvStore';

describe('KVStore', () => {
  const sandbox = createSandbox();

  const mockOrbitStore = createMockOrbitStore(sandbox);

  beforeEach(() => {
    sandbox.clear();
  });

  test('It creates a KVStore', () => {
    mockOrbitStore.put.mockResolvedValueOnce(null);

    const store = new KVStore(mockOrbitStore, name);
    expect(store._orbitStore).toBe(mockOrbitStore);
    expect(store._name).toBe(name);
  });
});
