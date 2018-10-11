/* @flow */

import OrbitDB from 'orbit-db';
import nanoid from 'nanoid';

import type {
  Identity,
  IdentityProvider,
  OrbitDBStore,
  Schema,
  StoreType,
} from './types';

import IPFSNode from '../ipfsNode/IPFSNode';
import Store from './Store';
import KVStore from './KVStore';

// TODO: better typing
type Resolver = Object;

type DatabaseOptions = {
  resolvers?: { [string]: Resolver },
};
type OrbitStoreCreateOpts = {
  directory?: string,
  write?: string[],
  overwrite?: boolean,
  replicate?: boolean,
};

type OrbitStoreOpenOpts = {
  localOnly?: boolean,
  directory?: string,
  overwrite?: boolean,
  replicate?: boolean,
};

type OrbitDBAddress = {
  root: string,
  path: string,
};
type StoreIdentifier = string | OrbitDBAddress;

const { isValidAddress, parseAddress } = OrbitDB;

const SCHEMAS: Map<string, Schema> = new Map();

class DDB {
  _orbitNode: OrbitDB;

  _resolvers: { [string]: Resolver };

  _stores: Map<string, Store>;

  static registerSchema(schemaId: string, schema: Schema) {
    SCHEMAS.set(schemaId, schema);
  }

  static getStoreClass(storeType: StoreType) {
    return {
      keyvalue: KVStore,
      // TODO: more to come
      counter: Store,
      eventlog: Store,
      feed: Store,
      docstore: Store,
    }[storeType];
  }

  static async createDatabase(
    ipfsNode: IPFSNode,
    identityProvider: IdentityProvider,
    options: DatabaseOptions = {},
  ): Promise<DDB> {
    const identity = await identityProvider.createIdentity();
    await ipfsNode.ready;
    return new DDB(ipfsNode, identity, options);
  }

  constructor(
    ipfsNode: IPFSNode,
    identity: Identity,
    options: DatabaseOptions = {},
  ) {
    this._stores = new Map();
    this._orbitNode = new OrbitDB(ipfsNode.getIPFS(), identity, {
      // TODO: is there a case where this could not be the default?
      path: 'colonyOrbitdb',
    });
    this._resolvers = options.resolvers || {};
  }

  async getStore(
    identifier: StoreIdentifier,
    options?: OrbitStoreOpenOpts,
  ): Promise<Store | null> {
    const address = await this._getStoreAddress(identifier);
    if (!address) return null;
    const cachedStore = this._getCachedStore(address);
    if (cachedStore) return cachedStore;
    const schemaId = address.path.split('.')[0];
    const orbitStore: OrbitDBStore = await this._orbitNode.open(
      address,
      options,
    );
    // TODO: hoping "type" is the correct property here
    return this._makeStore(orbitStore, schemaId, orbitStore.type);
  }

  _makeStore(
    orbitStore: OrbitDBStore,
    schemaId: string,
    storeType: StoreType,
  ): Store {
    const schema = SCHEMAS.get(schemaId);
    if (!schema) {
      throw new Error(
        `Store schema with id ${schemaId} not found. Did you register it?`,
      );
    }
    const StoreClass = DDB.getStoreClass(storeType);
    const store = new StoreClass(orbitStore, schemaId, schema);
    const { root, path } = store.address;
    this._stores.set(`${root}/${path}`, store);
    return store;
  }

  _getCachedStore(address: OrbitDBAddress) {
    const { root, path } = address;
    return this._stores.has(`${root}/${path}`)
      ? this._stores.get(`${root}/${path}`)
      : null;
  }

  async _resolveStoreAddress(identifier: string): Promise<string | null> {
    const [resolverKey, id] = identifier.split('.');
    if (!resolverKey || !id) return null;
    const resolvers = Object.keys(this._resolvers);
    for (let i = 0; i < resolvers.length; i += 1) {
      if (resolverKey === resolvers[i]) {
        return this._resolvers[resolverKey].resolve(id);
      }
    }
    return null;
  }

  async _getStoreAddress(
    identifier: StoreIdentifier,
  ): Promise<OrbitDBAddress | null> {
    if (!identifier) return null;
    if (typeof identifier == 'string') {
      // If it's already a valid address we parse it
      if (isValidAddress(identifier)) {
        return parseAddress(identifier);
      }
      // Otherwise it might be a resolver identifier (e.g. 'user.someusername')
      const addressString = await this._resolveStoreAddress(identifier);
      return isValidAddress(addressString) ? parseAddress(addressString) : null;
    }
    if (identifier.root && identifier.path) {
      return identifier;
    }
    return null;
  }

  async createStore(
    type: StoreType,
    schemaId: string,
    options?: OrbitStoreCreateOpts,
  ) {
    if (schemaId.includes('.')) {
      throw new Error('A dot (.) in schemaIds is not allowed');
    }
    const id = `${schemaId}.${nanoid()}`;
    const orbitStore: OrbitDBStore = await this._orbitNode.create(
      id,
      type,
      options,
    );
    return this._makeStore(orbitStore, schemaId, type);
  }
}

export default DDB;
