/* @flow */

import type {
  AccessController,
  OrbitDBAddress,
  OrbitDBStore,
  StoreBlueprint,
} from '~types';

import Cache from 'lru-cache';
import assert from 'assert';
import { isValidAddress } from 'orbit-db';

type StoreIdentifier = string | OrbitDBAddress;

const assertStoreNameMatchesAddress = (
  { getName }: StoreBlueprint<*, *>,
  address: OrbitDBAddress,
  storeProps: P,
) => {
  const expectedName = getName(storeProps);
  const name = address.path;
  assert(
    expectedName && expectedName === name,
    `Expected name "${expectedName}". Address path gave us "${name}".`,
  );
};

const assertStoreTypeIsCorrect = (
  { type }: StoreBlueprint<*, *>,
  orbitStore: OrbitDBStore,
) =>
  assert(
    orbitStore.type === type.orbitType,
    `Expected ${type.orbitType} for store ${orbitStore.address.path}, got ${
      orbitStore.type
    }`,
  );

function closeStoreOnCacheEviction(_, cachedStore) {
  return cachedStore.orbitStore
    .close()
    .then(() => console.info(`Store "${cachedStore.address}" was closed...`));
}

class StoreLocator {
  _ddb: DDB;

  _stores: Cache;

  constructor(ddb: DDB) {
    this._ddb = ddb;
    this._stores = new Map();
    this._stores = new Cache({
      dispose: closeStoreOnCacheEviction,
      maxAge: Number(process.env.CACHED_STORE_LIFESPAN_MS) || 15 * 60 * 1000,
      max: Number(process.env.OPEN_STORES_THRESHOLD) || 20,
      updateAgeOnGet: true,
    });
  }

  _isStoreCached(identifier: StoreIdentifier) {
    return this._stores.has(identifier);
  }

  _getStoreFromCache(identifier: StoreIdentifier) {
    return this._stores.has(identifier) ? this._stores.get(identifier) : null;
  }

  _cacheStore<T>(identifier: StoreIdentifier, store: T) {
    // FIXME Can we use localForage to write the identifier, name and address to indexedDB?
    /**
     * If the identifier used is a valid OrbitDBAddress, we don't need to add it to the cache
     */
    if (!isValidAddress(identifier) && store.name !== identifier)
      this._stores.set(identifier, store);

    /**
     * Allow the store to be resolved by name as well
     */
    this._stores.set(store.name, store);

    /**
     * And finally, per store address :)
     */
    this._stores.set(store.address, store);
  }

  async _makeStore<P, AC>(
    identifier: StoreIdentifier,
    orbitStore: *,
    blueprint: StoreBlueprint<P, AC>,
    waitUntilReady?: boolean,
  ) {
    // FIXME use DDB
    const { type: StoreClassWrapper, schema } = blueprint;
    const store: T = new StoreClassWrapper(
      orbitStore,
      orbitStore.address.name,
      this._ipfsNode.pinner,
      schema,
    );
    this._cacheStore<T>(identifier, store);
    await store.load();
    if (waitUntilReady) await store.ready();
    return store;
  }

  async createStore<T: *>(
    blueprint: StoreBlueprint<*, *>,
    dependencies: *,
    storeProps: Object,
  ): Promise<T> {
    const { getAccessController, getName, type: StoreClass } = blueprint;
    const name = getName(storeProps);
    if (!name) throw new Error('Store name is invalid or undefined');

    /**
     * @NOTE: Only necessary to pass in the whole access controller object
     * to orbit-db without it getting on our way
     */
    const storeAccessController = getAccessController(dependencies, storeProps);
    const orbitStore: OrbitDBStore = await this._orbitNode.create(
      name,
      StoreClass.orbitType,
      // We might want to use more options in the future. Just add them here
      {
        accessController: { controller: storeAccessController },
        overwrite: false,
      },
    );

    return this._makeStore(name, orbitStore, blueprint, true);
  }

  async openStore<T: *>(
    identifier: StoreIdentifier,
    blueprint: StoreBlueprint<*, *>,
    dependencies: *,
    storeProps: Object,
  ): Promise<T> {
    const { getAccessController, resolver } = blueprint;
    if (this._isStoreCached(identifier)) {
      const store: T = this._getStoreFromCache(identifier);
      await store.load();
      return store;
    }

    const address = isValidAddress(identifier)
      ? identifier
      : await resolver(dependencies)(storeProps);
    if (!address) {
      throw new Error(
        // eslint-disable-next-line max-len
        `Address not found for store with identifier "${identifier}" or props "${JSON.stringify(
          storeProps,
        )}"`,
      );
    }

    /**
     * Just being cautious, that's never too much
     */
    assertStoreNameMatchesAddress(blueprint, address, storeProps);

    const storeAccessController = getAccessController(dependencies, storeProps);
    const orbitStore: OrbitDBStore = await this._orbitNode.open(address, {
      /**
       * @NOTE: Only necessary to pass in the whole access controller object
       * to orbit-db without it getting on our way
       */
      accessController: { controller: storeAccessController },
      overwrite: false,
    });
    assertStoreTypeIsCorrect(blueprint, orbitStore);

    return this._makeStore(identifier, orbitStore, blueprint);
  }

  async generateStoreAddress<P: Object, AC: AccessController<*, *>>(
    blueprint: StoreBlueprint<P, AC>,
    dependencies: *,
    storeProps: P,
  ): Promise<OrbitDBAddress> {
    const {
      getAccessController,
      getName,
      type: StoreClass,
      deterministicAddress,
    } = blueprint;
    if (!deterministicAddress) {
      throw new Error('This store address isnt deterministic');
    }

    const name = getName(storeProps);
    if (!name) {
      throw new Error('Store name is invalid or undefined');
    }

    return this._orbitNode.determineAddress(
      name,
      StoreClass.orbitType,
      // We might want to use more options in the future. Just add them here
      {
        /**
         * @NOTE: Only necessary to pass in the whole access controller object
         * to orbit-db without it getting on our way
         */
        accessController: {
          controller: getAccessController(dependencies, storeProps),
        },
        overwrite: false,
      },
    );
  }

  // async init() {
  //   const identity = await this._identityProvider.createIdentity();
  //   await this._ipfsNode.ready;
  //   const ipfs = this._ipfsNode.getIPFS();
  //
  //   this._orbitNode = await OrbitDB.createInstance(ipfs, {
  //     AccessControllers: AccessControllerFactory,
  //     identity,
  //     keystore: Keystore,
  //     /**
  //      * @todo : is there a case where this could not be the default? This be a constant, or configurable? and `colonyOrbitDB`?
  //      */
  //     path: 'colonyOrbitdb',
  //   });
  // }

  async stop() {
    this._stores.reset();
    this._stores = null;
    return this._orbitNode.stop();
  }
}

export default StoreLocator;
