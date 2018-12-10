import createSandbox from 'jest-sandbox';
import * as yup from 'yup';

import KVStore from '../KVStore';

const schema = yup.object({
  requiredProp: yup.string().required(),
  optionalProp: yup.string(),
});

describe('KVStore', () => {
  const sandbox = createSandbox();

  beforeEach(() => {
    sandbox.clear();
  });

  const mockOrbitStore = {
    _addOperation: sandbox.fn(),
    address: 'orbit store address',
    close: sandbox.fn(),
    drop: sandbox.fn(),
    get: sandbox.fn(),
    key: 'orbit store key',
    load: sandbox.fn(),
    put: sandbox.fn(),
    type: 'orbit store type',
    events: {
      once: sandbox.fn(),
    },
  };

  const name = 'test schema id';

  test('It creates a KVStore', () => {
    mockOrbitStore.put.mockResolvedValueOnce(null);

    const store = new KVStore(mockOrbitStore, name, schema);
    expect(store._orbitStore).toBe(mockOrbitStore);
    expect(store._name).toBe(name);
    expect(store._schema).toBe(schema);
  });

  test('It validates objects against the schema', async () => {
    mockOrbitStore.put.mockResolvedValueOnce(null);

    const store = new KVStore(mockOrbitStore, name, schema);

    sandbox.spyOn(store._schema, 'validate');

    const validProps = { requiredProp: 'foo', optionalProp: 'bar' };
    const validated = await store.validate(validProps);
    expect(validated).toEqual(validProps);
    expect(store._schema.validate).toHaveBeenCalledWith(
      validProps,
      expect.any(Object),
    );

    // Missing `requiredProp`
    const invalidProps = { optionalProp: 'bar' };
    try {
      await store.validate(invalidProps);
      expect(false).toBe(true); // unreachable
    } catch (error) {
      expect(store._schema.validate).toHaveBeenCalledWith(
        invalidProps,
        expect.any(Object),
      );
      expect(error.toString()).toMatch('requiredProp is a required field');
    }
  });

  test('It validates a key/value pair against the schema', async () => {
    mockOrbitStore.put.mockResolvedValueOnce(null);

    const store = new KVStore(mockOrbitStore, name, schema);

    const key = 'requiredProp';
    const value = 'foo';

    sandbox.spyOn(store._schema.fields[key], 'validate');

    const validated = await store.validate(key, value);
    expect(validated).toEqual({ [key]: value });
    expect(store._schema.fields[key].validate).toHaveBeenCalledWith(
      value,
      expect.any(Object),
    );

    // Missing a value
    try {
      await store.validate(key);
      expect(false).toBe(true); // unreachable
    } catch (error) {
      expect(store._schema.fields[key].validate).toHaveBeenCalledWith(
        undefined,
        expect.any(Object),
      );
      expect(error.toString()).toMatch('this is a required field');
    }
  });

  test('It waits for replication when loading', async () => {
    const store = new KVStore(mockOrbitStore, name, schema);

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

  test('It times out when waiting for replication takes too long', async () => {
    // jest.useRealFakeDoors();
    jest.useFakeTimers();

    const store = new KVStore(mockOrbitStore, name, schema);
    sandbox
      .spyOn(store._orbitStore, 'load')
      .mockImplementation(async () => null);

    const loadPromise = store.load();
    jest.runOnlyPendingTimers();

    await expect(loadPromise).rejects.toThrow(
      'Timeout while waiting on replication',
    );

    jest.useRealTimers();
  });

  // TODO test: all(), get(), append(), set(), _setObject()
});
