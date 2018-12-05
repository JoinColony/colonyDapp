import createSandbox from 'jest-sandbox';
import * as yup from 'yup';

import FeedStore from '../FeedStore';

const schema = yup.object({
  colonyName: yup.string().required(),
  userAction: yup.string().required(),
});

describe('FeedStore', () => {
  const sandbox = createSandbox();

  beforeEach(() => {
    sandbox.clear();
  });

  const mockOrbitStore = {};

  const name = 'UserActivity';

  test('It creates a FeedStore', () => {
    const store = new FeedStore(mockOrbitStore, name, schema);
    expect(store._orbitStore).toBe(mockOrbitStore);
    expect(store._name).toBe(name);
    expect(store._schema).toBe(schema);
  });
  test('It validates an activity event against the schema', async () => {
    const store = new FeedStore(mockOrbitStore, name, schema);
    sandbox.spyOn(store._schema, 'validate');
    const validProps = {
      colonyName: 'Zombies',
      userAction: 'joinedColony',
    };
    const validated = await store.validate(validProps);
    expect(validated).toEqual(validProps);
    expect(store._schema.validate).toHaveBeenCalledWith(
      validProps,
      expect.any(Object),
    );
    // Missing `userAction`
    const invalidProps = { colonyName: 'bar' };
    await expect(store.validate(invalidProps)).rejects.toThrow(/required/);
    expect(store._schema.validate).toHaveBeenCalledWith(
      invalidProps,
      expect.any(Object),
    );
  });
});
