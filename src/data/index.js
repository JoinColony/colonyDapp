/* @flow */

import { open as openWallet } from '@colony/purser-software';

import OrbitDB from 'orbit-db';

import PurserIdentityProvider from '../lib/database/PurserIdentityProvider';
import PurserAccessController from '../lib/database/PurserAccessController';
import ipfsNode from '../lib/ipfsNode';

(async function() {
  const wallet = await openWallet({
    mnemonic:
      // eslint-disable-next-line max-len
      'vibrant crane range exhaust guide culture total blossom genuine error manual lock',
  });

  const identityProvider = new PurserIdentityProvider(wallet);
  const identity = await identityProvider.createIdentity();

  await ipfsNode.ready;

  const orbitNode = new OrbitDB(ipfsNode.getIpfs(), identity, {
    path: 'colonyOrbitdb',
  });

  const accessController = new PurserAccessController(wallet);
  // Uncomment to create a store
  const kv = await orbitNode.kvstore('my-store', {
    accessController,
  });
  // const kv = await orbitNode.kvstore(
  //   '/orbitdb/QmcKkpwTvwE7tebFRLcHN9qChGUaX8kePovW7xYLcy3bkv/my-store',
  //   {
  //     accessController: acl,
  //   },
  // );

  // Uncomment to populate the store
  // await kv.put('foo', 'bar');
  await kv.load();
  const foo = await kv.get('foo');
  console.log(foo);
})();
