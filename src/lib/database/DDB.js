/* @flow */

import OrbitDB from 'orbit-db';
import generate from 'nanoid/generate';

import type { ObjectSchema } from 'yup';

import type {
  ResolverFn,
  Identity,
  IdentityProvider,
  OrbitDBAddress,
  OrbitDBStore,
  StoreBlueprint,
} from './types';
import IPFSNode from '../ipfs';

import Keystore from './Keystore';
import {
  AccessControllerFactory,
  PermissiveAccessController,
} from './accessControllers';

// We'll skip the Q here because every id that contains a `Qm` is not allowed
const ipfsCompatibleBase57 =
  '123456789ABCDEFGHJKLMNPRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
export const generateId = () => generate(ipfsCompatibleBase57, 21);

type StoreIdentifier = string | OrbitDBAddress;

const { isValidAddress, parseAddress } = OrbitDB;

/**
 * The DDB class is a wrapper around an OrbitDB instance. It will be used to handle
 * schemas, create new Stores and keep track of the created ones. It also includes
 * means to add add a resolver for resolving store addresses
 */
class DDB {
  _identityProvider: IdentityProvider<Identity>;

  _ipfsNode: IPFSNode;

  _orbitNode: OrbitDB;

  _stores: Map<string, *>;

  _resolver: ?ResolverFn;

  static getAccessController(
    storeName: string,
    { getAccessController }: StoreBlueprint,
    storeProps?: Object,
  ) {
    /**
     * @todo Remove fallback for DDB store props
     * @body Once we use only the new store blueprints, we won't need a fallback for storeProps anymore
     */
    const accessController = getAccessController
      ? getAccessController(storeProps || {})
      : new PermissiveAccessController();

    if (!getAccessController)
      console.warn(
        `Using permissive access controller for store "${storeName}"`,
      ); // eslint-disable-line max-len

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
    this._resolver = null;
    this._identityProvider = identityProvider;
  }

  /**
   * @todo Optimise `DDB.busy` getter for open stores
   * @body An improvement can be made if we limit the stores to the ones that are open (once we actually close stores) This eslint rule doesn't make much sense in this case
   */
  get busy() {
    // eslint-disable-next-line no-restricted-syntax
    for (const [, store] of this._stores) {
      if (store.busy) return true;
    }
    return false;
  }

  _makeStore(
    orbitStore: *,
    {
      name,
      schema,
      type: StoreClass,
    }: { name: string, schema?: ObjectSchema, type: * },
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

  async _getStoreAddress(
    identifier: ?StoreIdentifier,
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
      // Otherwise it might be something to pass into the resolver
      const addressString =
        typeof this._resolver == 'function'
          ? await this._resolver(identifier)
          : null;
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

  registerResolver(resolverFn: ResolverFn) {
    this._resolver = resolverFn;
  }

  async createStore<T: *>(
    blueprint: StoreBlueprint,
    storeProps?: Object,
  ): Promise<T> {
    const { defaultName, getName, type: StoreClass } = blueprint;
    if (!(defaultName || getName)) {
      throw new Error('Store blueprint is invalid');
    }

    if (defaultName && defaultName.includes('.')) {
      throw new Error('A dot (.) in store names is not allowed');
    }

    const name = defaultName
      ? `${defaultName}.${generateId()}`
      : getName && getName(storeProps);

    if (!name) throw new Error('Store name is invalid or undefined');

    /**
     * @NOTE: Only necessary to pass in the whole access controller object
     * to orbit-db without it getting on our way
     */
    const storeAccessController = this.constructor.getAccessController(
      name,
      blueprint,
      storeProps,
    );
    const orbitStore: OrbitDBStore = await this._orbitNode.create(
      name,
      StoreClass.orbitType,
      // We might want to use more options in the future. Just add them here
      {
        accessController: { controller: storeAccessController },
        overwrite: false,
      },
    );

    const { type, schema } = blueprint;
    const store: T = this._makeStore(orbitStore, { name, schema, type });
    await store.ready();

    return store;
  }

  async getStore<T: *>(
    blueprint: StoreBlueprint,
    identifier: ?StoreIdentifier,
    storeProps?: Object,
  ): Promise<T> {
    const { defaultName, getName, type } = blueprint;
    if (!(defaultName || getName)) {
      throw new Error('Store blueprint is invalid');
    }

    const address = await this._getStoreAddress(identifier);
    if (!address)
      throw new Error(
        `Address not found for store with identifier ${
          typeof identifier === 'string'
            ? identifier
            : JSON.stringify(identifier)
        }`,
      );

    const cachedStore: ?T = this._getCachedStore(address);
    if (cachedStore) {
      await cachedStore.load();
      return cachedStore;
    }

    const expectedStoreName = defaultName || (getName && getName(storeProps));
    if (!expectedStoreName)
      throw new Error('Cannot define expected store name');

    const name = address.path.split('.')[0];
    if (name !== expectedStoreName) {
      throw new Error(
        // eslint-disable-next-line max-len
        `Expected name matching blueprint "${expectedStoreName}" for store "${name}"`,
      );
    }

    /**
     * @NOTE: Only necessary to pass in the whole access controller object
     * to orbit-db without it getting on our way
     */
    const storeAccessController = this.constructor.getAccessController(
      name,
      blueprint,
      storeProps,
    );
    const orbitStore: OrbitDBStore = await this._orbitNode.open(address, {
      accessController: { controller: storeAccessController },
      overwrite: false,
    });
    if (orbitStore.type !== type.orbitType) {
      throw new Error(
        `Expected ${type.orbitType} for store ${name}, got ${orbitStore.type}`,
      );
    }
    const { schema } = blueprint;
    const store: T = this._makeStore(orbitStore, { name, type, schema });

    await store.load();
    return store;
  }

  // Taken from https://github.com/orbitdb/orbit-db/commit/50dcd71411fbc96b1bcd2ab0625a3c0b76acbb7e
  async storeExists(identifier: StoreIdentifier): Promise<boolean> {
    const address = await this._getStoreAddress(identifier);
    /**
     * @todo Fix `DDB.storeExists` error modes
     * @body If there's no address, it should return an error. Also, this method is unused...
     */
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

  async generateStoreAddress(
    blueprint: StoreBlueprint,
    storeProps?: Object,
  ): Promise<OrbitDBAddress> {
    const { defaultName, getName, type: StoreClass } = blueprint;
    if (defaultName || !getName) {
      throw new Error(
        // eslint-disable-next-line max-len
        'Cannot determine store address for the given blueprint. Store name not deterministic',
      );
    }

    const name = getName && getName(storeProps);
    if (!name) throw new Error('Store name is invalid or undefined');
    const storeAccessController = this.constructor.getAccessController(
      name,
      blueprint,
      storeProps,
    );
    return this._orbitNode.determineAddress(
      name,
      StoreClass.orbitType,
      // We might want to use more options in the future. Just add them here
      {
        /**
         * @NOTE: Only necessary to pass in the whole access controller object
         * to orbit-db without it getting on our way
         */
        accessController: { controller: storeAccessController },
        overwrite: false,
      },
    );
  }

  async init() {
    const identity = await this._identityProvider.createIdentity();
    await this._ipfsNode.ready;
    const ipfs = this._ipfsNode.getIPFS();

    this._orbitNode = await OrbitDB.createInstance(ipfs, {
      AccessControllers: AccessControllerFactory,
      identity,
      keystore: Keystore,
      /**
       * @todo : is there a case where this could not be the default? This be a constant, or configurable? and `colonyOrbitDB`?
       */
      path: 'colonyOrbitdb',
    });
  }

  async stop() {
    return this._orbitNode.stop();
  }
}

export default DDB;
