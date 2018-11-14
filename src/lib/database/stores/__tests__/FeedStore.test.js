import createSandbox from 'jest-sandbox';

import FeedStore from '../FeedStore';
import { UserActivity as schema } from '../../schemas';

describe('FeedStore', () => {
  const sandbox = createSandbox();

  beforeEach(() => {
    sandbox.clear();
  });

  const mockOrbitStore = {
  };

  const schemaId = 'UserActivity';

  test('It creates a FeedStore', () => {
    const store = new FeedStore(mockOrbitStore, schemaId, schema);
    expect(store._orbitStore).toBe(mockOrbitStore);
    expect(store._schemaId).toBe(schemaId);
    expect(store._schema).toBe(schema);
  });
  test('It validates an activity event against the schema', async () => {
    const store = new FeedStore(mockOrbitStore, schemaId, schema);
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
    try {
      await store.validate(invalidProps);
      expect(false).toBe(true); // unreachable
    } catch (error) {
      expect(store._schema.validate).toHaveBeenCalledWith(
        invalidProps,
        expect.any(Object),
      );
      expect(error.toString()).toMatch('userAction is a required field');
    }

    const wrongUserActionKeyProps = {
      colonyName: 'bar',
      userAction: 'noColony',
    };
    try {
      await store.validate(wrongUserActionKeyProps);
      expect(false).toBe(true); // unreachable
    } catch (error) {
      expect(store._schema.validate).toHaveBeenCalledWith(
        wrongUserActionKeyProps,
        expect.any(Object),
      );
      // Split the error string so if we add more fields we do not need to update the test
      expect(error.toString().split(':')[1]).toMatch(
        'userAction must be one of the following values',
      );
    }
  });
});
