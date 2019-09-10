import { ObjectSchema } from 'yup';
import OrbitDB from 'orbit-db';

import {
  AccessController,
  Identity,
  IdentityProvider,
  OrbitDBAddress,
  OrbitDBStore,
  ResolverFn,
  StoreBlueprint,
} from '~types/index';

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
  private readonly identityProvider: IdentityProvider<Identity>;

  private readonly ipfsNode: IPFSNode;

  readonly stores: Map<string, any>;

  private orbitNode: OrbitDB;

  private resolver: ResolverFn | null;

  static getAccessController<
    P extends object,
    AC extends AccessController<any, any>
  >(
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

  constructor(ipfsNode: IPFSNode, identityProvider: any) {
    if (!ipfsNode.pinner) {
      throw new Error('No pinner connected - but we need it!');
    }

    this.ipfsNode = ipfsNode;
    this.stores = new Map();
    this.resolver = null;
    this.identityProvider = identityProvider;
  }

  /**
   * @todo Optimise `DDB.busy` getter for open stores
   * @body An improvement can be made if we limit the stores to the ones that are open (once we actually close stores) This eslint rule doesn't make much sense in this case
   */
  get busy() {
    // eslint-disable-next-line no-restricted-syntax
    for (const [, store] of this.stores) {
      if (store.busy) {
        return true;
      }
    }
    return false;
  }

  private makeStore(
    orbitStore: any,
    {
      name,
      schema,
      type: StoreClass,
    }: { name: string; schema?: ObjectSchema; type: any },
  ) {
    const store = new StoreClass(
      orbitStore,
      name,
      this.ipfsNode.pinner,
      schema,
    );
    const { root, path } = store.address;
    this.stores.set(`${root}/${path}`, store);
    return store;
  }

  private getCachedStore(address: OrbitDBAddress) {
    const { root, path } = address;
    return this.stores.has(`${root}/${path}`)
      ? this.stores.get(`${root}/${path}`)
      : null;
  }

  private async getStoreAddress(
    identifier: StoreIdentifier,
  ): Promise<OrbitDBAddress | null> {
    log.verbose(`Getting store address for identifier`, identifier);
    if (typeof identifier == 'string') {
      // If it's already a valid address we parse it
      if (isValidAddress(identifier)) {
        return parseAddress(identifier);
      }
      // Otherwise it might be something to pass into the resolver
      const addressString =
        typeof this.resolver == 'function'
          ? await this.resolver(identifier)
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
    this.resolver = resolverFn;
  }

  async createStore<T extends any>(
    blueprint: StoreBlueprint<any, any>,
    storeProps: object,
  ): Promise<T> {
    const { getName, type: StoreClass } = blueprint;
    const name = getName(storeProps);
    log.verbose(`Creating store "${name}"`, storeProps);
    if (!name) throw new Error('Store name is invalid or undefined');

    /**
     * @NOTE: Only necessary to pass in the whole access controller object
     * to orbit-db without it getting on our way
     */
    const storeAccessController = DDB.getAccessController(
      name,
      blueprint,
      storeProps,
    );
    const orbitStore: OrbitDBStore = await this.orbitNode.create(
      name,
      StoreClass.orbitType, // We might want to use more options in the future. Just add them here
      {
        accessController: { controller: storeAccessController },
        // @NOTE: For now, if a store gets the same address, we'll override it locally
        overwrite: true,
      },
    );

    const { type, schema } = blueprint;
    const store: T = this.makeStore(orbitStore, { name, schema, type });
    await store.ready();

    return store;
  }

  async getStore<T extends any>(
    blueprint: StoreBlueprint<any, any>,
    identifier: StoreIdentifier,
    storeProps: object,
  ): Promise<T> {
    const { getName, type } = blueprint;
    const address = await this.getStoreAddress(identifier);
    if (!address) {
      throw new Error(
        `Address not found for store with identifier ${
          typeof identifier === 'string'
            ? identifier
            : JSON.stringify(identifier)
        }`,
      );
    }

    const cachedStore: T | null = this.getCachedStore(address);
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
    if (name.toLowerCase() !== expectedStoreName.toLowerCase()) {
      throw new Error( // eslint-disable-next-line max-len
        `Expected name matching blueprint "${expectedStoreName}" for store "${name}"`,
      );
    }

    log.verbose(`Opening store "${name}" with address "${address.toString()}"`);

    /**
     * @NOTE: Only necessary to pass in the whole access controller object
     * to orbit-db without it getting on our way
     */
    const storeAccessController = DDB.getAccessController(
      name,
      blueprint,
      storeProps,
    );
    // @ts-ignore
    const orbitStore: any = await this.orbitNode.open(address, {
      accessController: { controller: storeAccessController },
    });
    if (orbitStore.type !== type.orbitType) {
      throw new Error(
        `Expected ${type.orbitType} for store ${name}, got ${orbitStore.type}`,
      );
    }
    const { schema } = blueprint;
    const store: T = this.makeStore(orbitStore, { name, type, schema });

    await store.load();
    return store;
  }

  async generateStoreAddress<
    P extends object,
    AC extends AccessController<any, any>
  >(blueprint: StoreBlueprint<P, AC>, storeProps: P): Promise<string> {
    const { getName, type: StoreClass } = blueprint;
    const name = getName(storeProps);
    if (!name) {
      throw new Error('Store name is invalid or undefined');
    }

    log.verbose(`Generating address for store "${name}"`);
    const controller = DDB.getAccessController(name, blueprint, storeProps);
    const address = await this.orbitNode.determineAddress(
      name,
      StoreClass.orbitType, // We might want to use more options in the future. Just add them here
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

  async init() {
    const identity = await this.identityProvider.createIdentity();
    await this.ipfsNode.ready;
    const ipfs = this.ipfsNode.getIPFS();

    this.orbitNode = await OrbitDB.createInstance(ipfs, {
      AccessControllers: AccessControllerFactory,
      identity,
      keystore: this.identityProvider.keystore,

      /**
       * @todo : is there a case where this could not be the default? This be a constant, or configurable? and `colonyOrbitDB`?
       */
      path: 'colonyOrbitdb',
    });
  }

  async stop() {
    if (this.identityProvider) await this.identityProvider.close();
    return this.orbitNode.stop();
  }
}

export default DDB;
