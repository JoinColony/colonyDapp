---
# Colony dApp Database Library

---
## Background

The data layer of the Colony dApp comprises:

* Ethereum
    * Colony Network contract
    * Colony contracts
    * Other contracts, e.g. tokens
* IPFS
    * Decentralised Database stores ('the DDB', currently powered by [OrbitDB](https://github.com/orbitdb/))
    * File storage


### Why not use a faster/better database like <Postgres/MongoDB/AWS Bezostore/A series of highly-trained messenger pigeons>?

Because of the C-word (centralised!). We're using a database stored on IPFS, because it has the properties we need for the dApp (immutable, trustless, decentralised) to function as intended through the whole data layer.


### If it's all on IPFS, how does the data stay available?

IPFS only guarantees that certain data will always be available at a certain address, not that the data will always be kept (i.e. there is garbage collection for unused data). To avoid this, we use a pinning service ([pinion](https://github.com/JoinColony/pinion)), which will 'pin' any requested IPFS content, so that it stays available. Additionally, other connected peers on IPFS will keep some content available.


-----
## Stores

### Store types

- [ ] TODO write me


### Access controllers

- [ ] TODO write me


### Resolvers

- [ ] TODO write me


### Miscellaneous

#### How can operations/replication time be minimised?
- [ ] TODO write me

#### Similar commands across different store types
See [here](https://github.com/JoinColony/colonyDapp/blob/5a3a120e6720ff17f73874b7f1058803653f078b/src/lib/database/commands.js#L5).

---
## Usage

```js
// context: 'DDB' -> static DDB class
// context: 'ddb' -> a DDB class instance (with a wallet, IPFS node and resolvers)

// Defining a store blueprint
const myStore: StoreBlueprint = {
  getAccessController({ walletAddress }: StoreProps = {}) {
    return new EthereumWalletAccessController(walletAddress);
  },
  name: 'myStore',
  schema: yup.object({
    myField: yup.string(),
    myOtherField: yup.string(),
  }),
  type: KVStore,
};

// Creating a store
function* createMyStore(walletAddress: string): Saga<void> {
  const ddb: DDB = yield getContext('ddb');
  yield call([ddb, ddb.createStore], myStore, {
    walletAddress,
  });
}

// Getting a store
function* getMyStore(storeAddress: string): Saga<KVStore> {
  const ddb: DDB = yield getContext('ddb');
  return yield call([ddb, ddb.getStore], myStore, storeAddress);
}

// Loading a store
function* someSaga() {
  // ...
  yield call([store, store.load]);
  // ...
}

// Setting a value in a store (this depends on the store type)
function* someSaga() {
  // ...
  yield call([store, store.set], { myField: 'some value' });
  // ...
}
```

