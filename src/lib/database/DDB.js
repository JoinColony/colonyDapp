/* @flow */

import OrbitDB from 'orbit-db';
import nanoid from 'nanoid';

import type {
  Identity,
  IdentityProvider,
  OrbitDBAddress,
  OrbitDBStore,
  Schema,
  StoreType,
} from './types';

import IPFSNode from '../ipfs';
import Store from './Store';
import KVStore from './KVStore';

// TODO: better typing
type Resolver = Object;

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

type StoreIdentifier = string | OrbitDBAddress;

const { isValidAddress, parseAddress } = OrbitDB;

const STORE_CLASSES = {
  keyvalue: KVStore,
  // TODO: more to come
  counter: Store,
  eventlog: Store,
  feed: Store,
  docstore: Store,
};

const SCHEMAS: Map<string, Schema> = new Map();

/**
 * The DDB class is a wrapper around an OrbitDB instance. It will be used to handle
 * schemas, create new Stores and keep track of the created ones. It also includes
 * means to add resolvers for resolving store addresses
 */
class DDB {
  _orbitNode: OrbitDB;

  _stores: Map<string, Store>;

  _resolvers: Map<string, Resolver>;

  static registerSchema(schemaId: string, schema: Schema) {
    SCHEMAS.set(schemaId, schema);
  }

  addResolver(resolverId: string, resolver: Resolver) {
    this._resolvers.set(resolverId, resolver);
  }

  static getStoreClass(storeType: StoreType) {
    return STORE_CLASSES[storeType];
  }

  static async createDatabase<I: Identity, P: IdentityProvider<I>>(
    ipfsNode: IPFSNode,
    identityProvider: P,
  ): Promise<DDB> {
    const identity = await identityProvider.createIdentity();
    await ipfsNode.ready;
    return new DDB(ipfsNode, identity);
  }

  constructor(ipfsNode: IPFSNode, identity: Identity) {
    this._stores = new Map();
    this._resolvers = new Map();
    this._orbitNode = new OrbitDB(ipfsNode.getIPFS(), identity, {
      // TODO: is there a case where this could not be the default?
      path: 'colonyOrbitdb',
    });
  }

  async getStore(
    identifier: StoreIdentifier,
    options?: OrbitStoreOpenOpts,
  ): Promise<Store> {
    const address = await this._getStoreAddress(identifier);
    if (!address) {
      throw new Error(`Could not find store with address ${address}`);
    }
    const cachedStore = this._getCachedStore(address);
    if (cachedStore) return cachedStore;
    const schemaId = address.path.split('.')[0];
    if (!SCHEMAS.has(schemaId)) {
      throw new Error(`Schema ${schemaId} not found in schemas.`);
    }
    const orbitStore: OrbitDBStore = await this._orbitNode.open(
      address,
      options,
    );
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

  _resolveStoreAddress(identifier: string): Promise<string> {
    const [resolverKey, id] = identifier.split('.');
    if (!resolverKey || !id) {
      throw new Error('Identifier is not in a valid form');
    }

    const resolver = this._resolvers.get(resolverKey);
    if (!resolver) {
      throw new Error(
        `Resolver with key ${resolverKey} not found. Did you register it?`,
      );
    }

    return resolver.resolve(id);
  }

  async _getStoreAddress(identifier: StoreIdentifier): Promise<OrbitDBAddress> {
    if (!identifier) {
      throw new Error(
        'Please define an identifier for the store you want to retrieve',
      );
    }
    if (typeof identifier == 'string') {
      // If it's already a valid address we parse it
      if (isValidAddress(identifier)) {
        return parseAddress(identifier);
      }
      // Otherwise it might be a resolver identifier (e.g. 'user.someusername')
      const addressString = await this._resolveStoreAddress(identifier);
      if (!isValidAddress(addressString)) {
        throw new Error(
          `Address found not valid: ${addressString || 'none given'}`,
        );
      }
      return parseAddress(addressString);
    }
    return identifier;
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
