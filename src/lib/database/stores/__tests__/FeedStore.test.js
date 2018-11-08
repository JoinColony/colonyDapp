import createSandbox from 'jest-sandbox';
import * as yup from 'yup';

import FeedStore from '../FeedStore';

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
    add: sandbox.fn(),
    key: 'orbit store key',
    load: sandbox.fn(),
    get: sandbox.fn(),
    type: 'orbit store type',
  };

  const schemaId = 'test schema id';

  const schema = yup.object({
    requiredProp: yup.string().required(),
    optionalProp: yup.string(),
  });

  test('It creates a FeedStore', () => {
    mockOrbitStore.add.mockResolvedValueOnce(null);

    const store = new FeedStore(mockOrbitStore, schemaId, schema);
    expect(store._orbitStore).toBe(mockOrbitStore);
    expect(store._schemaId).toBe(schemaId);
    expect(store._schema).toBe(schema);
    expect(store._orbitStore.add).toHaveBeenCalledWith({
      userAction: 'Joined Colony 🎉🎉',
      createdAt: expect.any(String),
      colonyName: '',
    });
  });
  test('It validates objects against the schema', async () => {
    mockOrbitStore.add.mockResolvedValueOnce(null);
    const store = new FeedStore(mockOrbitStore, schemaId, schema);
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
    mockOrbitStore.add.mockResolvedValueOnce(null);
    const store = new FeedStore(mockOrbitStore, schemaId, schema);
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

  // TODO test: all(), get()
});
