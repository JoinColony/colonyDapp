/* @flow */

import OrbitDB from 'orbit-db';
import generate from 'nanoid/generate';

import type {
  ENSResolverType,
  Identity,
  IdentityProvider,
  OrbitDBAddress,
  OrbitDBStore,
  StoreBlueprint,
} from './types';
import IPFSNode from '../ipfs';

// import { Store } from './stores';
import { setMeta } from './commands';
import { PermissiveAccessController } from './accessControllers';

const base58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const generateId = () => generate(base58, 21);

type StoreIdentifier = string | OrbitDBAddress;

const { isValidAddress, parseAddress } = OrbitDB;

/**
 * The DDB class is a wrapper around an OrbitDB instance. It will be used to handle
 * schemas, create new Stores and keep track of the created ones. It also includes
 * means to add resolvers for resolving store addresses
 */
class DDB {
  _identityProvider: IdentityProvider<Identity>;

  _ipfsNode: IPFSNode;

  _orbitNode: OrbitDB;

  _stores: Map<string, *>;

  _resolvers: Map<string, ENSResolverType>;

  static getAccessController(
    { getAccessController, name }: StoreBlueprint,
    storeProps?: Object,
  ) {
    // @TODO: Once we use only the new store blueprints, we won't need a fallback for storeProps anymore
    const accessController = getAccessController
      ? getAccessController(storeProps || {})
      : new PermissiveAccessController();

    if (!getAccessController)
      console.warn(`Using permissive access controller for store "${name}"`);
    return accessController;
  }

  constructor<I: Identity, P: IdentityProvider<I>>(
    ipfsNode: IPFSNode,
    identityProvider: P,
  ) {
    if (!ipfsNode.pinner) {
      throw new Error('No pinner connected - but we need it!');
    }

    this._ipfsNode = ipfsNode;
    this._stores = new Map();
    this._resolvers = new Map();
    this._identityProvider = identityProvider;
  }

  _makeStore(
    orbitStore: *,
    { name, schema, type: StoreClass }: StoreBlueprint,
  ) {
    const store = new StoreClass(
      orbitStore,
      name,
      this._ipfsNode.pinner,
      schema,
    );
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

  async _resolveStoreAddress(identifier: string) {
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

  async _getStoreAddress(
    identifier: StoreIdentifier,
  ): Promise<OrbitDBAddress | null> {
    if (!identifier) {
      throw new Error(
        'Please define an identifier for the store you want to retrieve',
      );
    }
    if (typeof identifier === 'string') {
      // If it's already a valid address we parse it
      if (isValidAddress(identifier)) {
        return parseAddress(identifier);
      }
      // Otherwise it might be a resolver identifier (e.g. 'user.someusername')
      const addressString = await this._resolveStoreAddress(identifier);
      if (!addressString) {
        return null;
      }
      if (!isValidAddress(addressString)) {
        throw new Error(`Address found not valid: ${addressString}`);
      }
      return parseAddress(addressString);
    }
    return identifier;
  }

  // TODO given that ENSResolverType defines its own type, resolverId seems redundant
  addResolver(resolverId: string, resolver: ENSResolverType) {
    this._resolvers.set(resolverId, resolver);
  }

  async createStore<T: *>(
    blueprint: StoreBlueprint,
    storeProps?: Object,
  ): Promise<T> {
    const { name, type: StoreClass } = blueprint;
    if (name.includes('.')) {
      throw new Error('A dot (.) in store names is not allowed');
    }
    const id = `${name}.${generateId()}`;

    const accessController = this.constructor.getAccessController(
      blueprint,
      storeProps,
    );
    const orbitStore: OrbitDBStore = await this._orbitNode.create(
      id,
      StoreClass.orbitType,
      // We might want to use more options in the future. Just add them here
      { accessController, overwrite: false },
    );

    const store: T = this._makeStore(orbitStore, blueprint);
    await store.ready();

    // If supported, set the `meta` values on the store.
    if (storeProps && storeProps.meta) await setMeta(store, storeProps.meta);

    return store;
  }

  async getStore<T: *>(
    blueprint: StoreBlueprint,
    identifier: StoreIdentifier,
    storeProps?: Object,
  ): Promise<T> {
    const { name: bluePrintName, type } = blueprint;

    const address = await this._getStoreAddress(identifier);
    if (!address)
      throw new Error(
        `Address not found for store with identifier ${
          typeof identifier === 'string' ? identifier : identifier.toJSON()
        }`,
      );

    const cachedStore: ?T = this._getCachedStore(address);
    if (cachedStore) return cachedStore;

    const name = address.path.split('.')[0];
    if (name !== bluePrintName) {
      throw new Error(
        // eslint-disable-next-line max-len
        `Expected name matching blueprint "${bluePrintName}" for store "${name}"`,
      );
    }

    const accessController = this.constructor.getAccessController(
      blueprint,
      storeProps,
    );
    const orbitStore: OrbitDBStore = await this._orbitNode.open(address, {
      accessController,
    });
    if (orbitStore.type !== type.orbitType) {
      throw new Error(
        `Expected ${type.orbitType} for store ${name}, got ${orbitStore.type}`,
      );
    }
    const store: T = this._makeStore(orbitStore, blueprint);

    await store.load();
    return store;
  }

  // Taken from https://github.com/orbitdb/orbit-db/commit/50dcd71411fbc96b1bcd2ab0625a3c0b76acbb7e
  async storeExists(identifier: StoreIdentifier): Promise<boolean> {
    const address = await this._getStoreAddress(identifier);
    // @TODO This should actually throw an error
    if (!address) return false;
    // eslint-disable-next-line no-underscore-dangle
    const cache = await this._orbitNode._loadCache(
      this._orbitNode.directory,
      address,
    );
    if (!cache) return false;
    const data = await cache.get(`${address.toString()}/_manifest`);
    return data !== undefined && data !== null;
  }

  async init() {
    const identity = await this._identityProvider.createIdentity();
    await this._ipfsNode.ready;
    const ipfs = this._ipfsNode.getIPFS();

    this._orbitNode = new OrbitDB(ipfs, identity, {
      // TODO: is there a case where this could not be the default?
      // TODO should this be a constant, or configurable? and `colonyOrbitDB`?
      path: 'colonyOrbitdb',
    });
  }

  async stop() {
    return this._orbitNode.stop();
  }
}

export default DDB;
