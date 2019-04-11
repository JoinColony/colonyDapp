import createSandbox from 'jest-sandbox';
import * as yup from 'yup';

import DocStore from '../DocStore';

const schema = yup.object({
  doc: yup.object({
    userAction: yup.string().required(),
    username: yup.string().required(),
  }),
  meta: yup.object({
    colonyName: yup.string().required(),
  }),
});

describe('DocStore', () => {
  const sandbox = createSandbox();

  const mockPinner = {
    requestPinnedStore: sandbox.fn(() => ({ count: 5 })),
  };

  beforeEach(() => {
    sandbox.clear();
  });

  const mockOrbitStore = {};

  const name = 'UserActivity';

  test('It creates a DocStore', () => {
    const store = new DocStore(mockOrbitStore, name, mockPinner, schema);
    expect(store._orbitStore).toBe(mockOrbitStore);
    expect(store._name).toBe(name);
    expect(store._docSchema).toBe(schema.fields.doc);
    expect(store._metaSchema).toBe(schema.fields.meta);
  });
  test('It validates an activity event against the schema', async () => {
    const store = new DocStore(mockOrbitStore, name, mockPinner, schema);
    sandbox.spyOn(store._docSchema, 'validate');
    const validProps = {
      userAction: 'joinedColony',
      username: 'chmanie',
    };
    const validated = await store.validate(validProps);
    expect(validated).toEqual(validProps);
    expect(store._docSchema.validate).toHaveBeenCalledWith(
      validProps,
      expect.any(Object),
    );
    // Missing `username`
    const invalidProps = { userAction: 'joinColony' };
    await expect(store.validate(invalidProps)).rejects.toThrow(/required/);
    expect(store._docSchema.validate).toHaveBeenCalledWith(
      invalidProps,
      expect.any(Object),
    );
  });
});
