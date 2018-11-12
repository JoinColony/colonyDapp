import createSandbox from 'jest-sandbox';

import { create as createWallet } from '@colony/purser-software';
import DDB from '../../DDB';
import PurserIdentityProvider from '../../PurserIdentityProvider';
import FeedStore from '../FeedStore';
import { UserActivity as schema } from '../../schemas';
import IPFSNode from '../../../ipfs';

describe('FeedStore', () => {
  const sandbox = createSandbox();

  beforeEach(() => {
    sandbox.clear();
  });

  let wallet;
  let identityProvider;
  let ddb;

  beforeAll(async () => {
    DDB.registerSchema('userActivity', schema);

    wallet = await createWallet();

    identityProvider = new PurserIdentityProvider(wallet);
    const ipfs = new IPFSNode();
    ddb = await DDB.createDatabase(ipfs, identityProvider);
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
      userAction: { joinedColony: 'joinedColony' },
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
  });
  test('The all() method returns events in the order added', async () => {
    const store = await ddb.createStore('feed', 'userActivity');
    const firstActivity = {
      colonyName: 'Zombies',
      userAction: { joinedColony: 'joinedColony' },
    };
    const secondActivity = {
      colonyName: 'Zombies2',
      userAction: {
        acceptedTask: 'I will help you bear this burden, Bilbo Baggins',
      },
    };

    await store.add(firstActivity);
    await store.add(secondActivity);

    const events = store.all();
    expect(events.length).toBe(2);
    expect(events[0].colonyName).toBe('Zombies');
    expect(events[1].colonyName).toBe('Zombies2');
  });
});
