/* @flow */

import type { ObjectSchema } from 'yup';
import OrbitDB from 'orbit-db';

import type {
  AccessController,
  Identity,
  IdentityProvider,
  OrbitDBAddress,
  OrbitDBStore,
  ResolverFn,
  StoreBlueprint,
} from '~types';

import { log } from '../../utils/debug';
import IPFSNode from '../ipfs';
import AccessControllerFactory from './AccessControllerFactory';

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

  static getAccessController<P: Object, AC: AccessController<*, *>>(
    storeName: string,
    { getAccessController }: StoreBlueprint<P, AC>,
    storeProps: P,
  ) {
    const accessController = getAccessController(storeProps);
    if (!accessController) {
      throw new Error(
        'Cannot instantiate an access controller, store blueprint invalid',
      );
    }

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
      if (store.busy) {
        return true;
      }
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
    identifier: StoreIdentifier,
  ): Promise<OrbitDBAddress | null> {
    log.verbose(`Getting store address for identifier`, identifier);
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

      log.verbose(
        `Resolved store address for identifier "${identifier}"`,
        addressString,
      );
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
    blueprint: StoreBlueprint<*, *>,
    storeProps: Object,
  ): Promise<T> {
    const { getName, type: StoreClass } = blueprint;
    const name = getName(storeProps);
    log.verbose(`Creating store "${name}"`, storeProps);
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
        // @NOTE: For now, if a store gets the same address, we'll override it locally
        overwrite: true,
      },
    );

    const { type, schema } = blueprint;
    const store: T = this._makeStore(orbitStore, { name, schema, type });
    await store.ready();

    return store;
  }

  async getStore<T: *>(
    blueprint: StoreBlueprint<*, *>,
    identifier: StoreIdentifier,
    storeProps: Object,
  ): Promise<T> {
    const { getName, type } = blueprint;
    const address = await this._getStoreAddress(identifier);
    if (!address) {
      throw new Error(
        `Address not found for store with identifier ${
          typeof identifier === 'string'
            ? identifier
            : JSON.stringify(identifier)
        }`,
      );
    }

    const cachedStore: ?T = this._getCachedStore(address);
    if (cachedStore) {
      log.verbose(`Getting store from cache`, address);
      await cachedStore.load();
      return cachedStore;
    }

    const expectedStoreName = getName(storeProps);
    if (!expectedStoreName) {
      throw new Error('Cannot define expected store name');
    }

    const name = address.path;
    if (name !== expectedStoreName) {
      throw new Error(
        // eslint-disable-next-line max-len
        `Expected name matching blueprint "${expectedStoreName}" for store "${name}"`,
      );
    }

    log.verbose(`Opening store "${name}" with address "${address.toString()}"`);
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

  async generateStoreAddress<P: Object, AC: AccessController<*, *>>(
    blueprint: StoreBlueprint<P, AC>,
    storeProps: P,
  ): Promise<string> {
    const { getName, type: StoreClass } = blueprint;
    const name = getName(storeProps);
    if (!name) {
      throw new Error('Store name is invalid or undefined');
    }

    log.verbose(`Generating address for store "${name}"`);
    const controller = this.constructor.getAccessController(
      name,
      blueprint,
      storeProps,
    );
    const address = await this._orbitNode.determineAddress(
      name,
      StoreClass.orbitType,
      // We might want to use more options in the future. Just add them here
      {
        /**
         * @NOTE: Only necessary to pass in the whole access controller object
         * to orbit-db without it getting on our way. Also, the `onlyDetermineAddress`
         * flag is used so we don't check for the contract permission whilst determining
         * store addresses (see {Colony,Task}AccessController)
         */
        accessController: { controller, onlyDetermineAddress: true },
        // @NOTE: For now, if a store gets the same address, we'll override it locally
        overwrite: true,
      },
    );

    return address && address.toString();
  }

  // Taken from https://github.com/orbitdb/orbit-db/commit/50dcd71411fbc96b1bcd2ab0625a3c0b76acbb7e
  async storeExists(identifier: StoreIdentifier): Promise<boolean> {
    const address = await this._getStoreAddress(identifier);
    /**
     * @todo Fix `DDB.storeExists` error modes
     * @body If there's no address, it should return an error. Also, this method is unused...
     */
    if (!address) {
      return false;
    }
    // eslint-disable-next-line no-underscore-dangle
    const cache = await this._orbitNode._loadCache(
      this._orbitNode.directory,
      address,
    );
    if (!cache) {
      return false;
    }
    const data = await cache.get(`${address.toString()}/_manifest`);
    return data !== undefined && data !== null;
  }

  async init() {
    const identity = await this._identityProvider.createIdentity();
    await this._ipfsNode.ready;
    const ipfs = this._ipfsNode.getIPFS();

    this._orbitNode = await OrbitDB.createInstance(ipfs, {
      AccessControllers: AccessControllerFactory,
      identity,
      keystore: this._identityProvider.keystore,
      /**
       * @todo : is there a case where this could not be the default? This be a constant, or configurable? and `colonyOrbitDB`?
       */
      path: 'colonyOrbitdb',
    });
  }

  async stop() {
    if (this._identityProvider) await this._identityProvider.close();
    return this._orbitNode.stop();
  }
}

export default DDB;
