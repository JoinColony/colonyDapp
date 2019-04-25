import createSandbox from 'jest-sandbox';
import * as yup from 'yup';

import createMockOrbitStore from './mockOrbitStore';
import ValidatedKVStore from '../ValidatedKVStore';

const schema = yup.object({
  requiredProp: yup.string().required(),
  optionalProp: yup.string(),
});

const name = 'kvStoreSchemaId';

describe('ValidatedKVStore', () => {
  const sandbox = createSandbox();

  const mockOrbitStore = createMockOrbitStore(sandbox);

  const mockPinner = {
    requestPinnedStore: sandbox.fn(() => ({ count: 5 })),
  };

  beforeEach(() => {
    sandbox.clear();
  });

  test('It creates a ValidatedKVStore', () => {
    mockOrbitStore.put.mockResolvedValueOnce(null);

    const store = new ValidatedKVStore(
      mockOrbitStore,
      name,
      mockPinner,
      schema,
    );
    expect(store._orbitStore).toBe(mockOrbitStore);
    expect(store._name).toBe(name);
    expect(store._pinner).toBe(mockPinner);
    expect(store._schema).toBe(schema);
  });

  test('It validates objects against the schema', async () => {
    mockOrbitStore.put.mockResolvedValueOnce(null);

    const store = new ValidatedKVStore(
      mockOrbitStore,
      name,
      mockPinner,
      schema,
    );

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

    const store = new ValidatedKVStore(
      mockOrbitStore,
      name,
      mockPinner,
      schema,
    );

    const key = 'requiredProp';
    const value = 'foo';

    sandbox.spyOn(store._schema.fields[key], 'validate');

    const validated = await store.validate(key, value);
    expect(validated).toEqual(value);
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
});
