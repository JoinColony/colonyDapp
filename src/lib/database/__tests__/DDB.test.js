/* eslint-disable no-underscore-dangle,max-len */

import createSandbox from 'jest-sandbox';
import { object, string } from 'yup';
import OrbitDB from 'orbit-db';

import DDB from '../DDB';
import KVStore from '../KVStore';

jest.mock('orbit-db');

describe('DDB', () => {
  const sandbox = createSandbox();
  beforeEach(() => {
    sandbox.clear();
  });

  const mockIpfs = {
    getIPFS: sandbox.fn(),
  };
  const mockIpfsReady = sandbox.fn();
  Object.defineProperty(mockIpfs, 'ready', {
    get: mockIpfsReady,
  });

  const mockIdentityProvider = {
    createIdentity: sandbox.fn(),
  };

  const testSchemaId = 'test-schema-id';
  const testSchemaIdPattern = new RegExp(`^${testSchemaId}..+$`);
  const testSchema = object({
    requiredProp: string().required(),
    optionalProp: string(),
  });

  // Register a schema globally
  DDB.registerSchema(testSchemaId, testSchema);

  test('It should create a DDB instance', async () => {
    const ipfs = 'ipfs';
    const identity = 'identity';
    mockIpfs.getIPFS.mockReturnValueOnce(ipfs);
    mockIdentityProvider.createIdentity.mockResolvedValueOnce(identity);
    mockIpfsReady.mockResolvedValueOnce(true);

    const ddb = await DDB.createDatabase(mockIpfs, mockIdentityProvider);

    expect(ddb).toBeInstanceOf(DDB);
    expect(ddb).toHaveProperty('_stores', expect.any(Map));
    expect(ddb).toHaveProperty('_resolvers', expect.any(Map));
    expect(ddb).toHaveProperty('_orbitNode', expect.any(OrbitDB));

    expect(OrbitDB).toHaveBeenCalledWith(ipfs, identity, {
      path: 'colonyOrbitdb',
    });

    expect(mockIdentityProvider.createIdentity).toHaveBeenCalled();
    expect(mockIpfsReady).toHaveBeenCalled();
  });

  test('It not create a DDB instance without a ready IPFS node', async () => {
    mockIpfsReady.mockImplementationOnce(() => {
      throw new Error('oh no');
    });

    try {
      await DDB.createDatabase(mockIpfs, mockIdentityProvider);
    } catch (error) {
      expect(error.message).toBe('oh no');
    }
  });

  test('It should create stores of different types', async () => {
    const ddb = await DDB.createDatabase(mockIpfs, mockIdentityProvider);

    const options = { write: ['*'] };

    const mockOrbitStore = {
      put: sandbox.fn(),
      address: {
        root: 'root',
        path: 'path',
      },
    };
    ddb._orbitNode.create.mockResolvedValueOnce(mockOrbitStore);

    sandbox.spyOn(ddb, '_makeStore');

    const keyValueStore = await ddb.createStore(
      'keyvalue',
      testSchemaId,
      options,
    );
    expect(keyValueStore).toBeInstanceOf(KVStore);

    expect(ddb._orbitNode.create).toHaveBeenCalledWith(
      expect.stringMatching(testSchemaIdPattern),
      'keyvalue',
      options,
    );
    expect(ddb._makeStore).toHaveBeenCalledWith(
      mockOrbitStore,
      testSchemaId,
      'keyvalue',
    );
  });

  test('It should not allow creating a store with dots in the schemaId', async () => {
    const ddb = await DDB.createDatabase(mockIpfs, mockIdentityProvider);
    try {
      await ddb.createStore('keyvalue', 'no.dots.allowed.here');
    } catch (error) {
      expect(error.message).toContain('not allowed');
    }
  });
});
