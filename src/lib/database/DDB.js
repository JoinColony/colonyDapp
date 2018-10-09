/* @flow */

import OrbitDB from 'orbit-db';
import IPFSNode from '../ipfsNode/IPFSNode';
import type { Identity, IdentityProvider, OrbitDBStore } from './types';

class DDB {
  _orbitNode: OrbitDB;

  _stores: Map<string, OrbitDBStore>;

  static async createDatabase(
    ipfsNode: IPFSNode,
    identityProvider: IdentityProvider,
  ): Promise<DDB> {
    const identity = await identityProvider.createIdentity();
    await ipfsNode.ready;
    return new DDB(ipfsNode, identity);
  }

  constructor(ipfsNode: IPFSNode, identity: Identity) {
    this._stores = new Map();
    this._orbitNode = new OrbitDB(ipfsNode.getIPFS(), identity, {
      // TODO: is there a case where this could not be the default?
      path: 'colonyOrbitdb',
    });
  }

  // ddb.createStore(DDB.KV_STORE, 'user-chris', {
  //  schema: {}
  // })
}

export default DDB;
