/* @flow */

import ipfsNode from '../context/ipfsNodeContext';
import { DDB } from '../lib/database/index';
import PurserIdentityProvider from '../lib/database/PurserIdentityProvider';

// I don't know what it does so I'll disable it for now
// self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', async () => {
  console.log(ipfsNode);
  await ipfsNode.ready;

  const wallet = {
    signMessage: () => 'foo',
    address: '0xb77d57f4959eafa0339424b83fcfaf9c15407461',
  };

  const identityProvider = new PurserIdentityProvider(wallet);
  const ddb = new DDB(ipfsNode, identityProvider);
  await ddb.init();
  console.log(ddb);
});

// The simplest Service Worker: A passthrough script
self.addEventListener('fetch', event => {
  console.log(event);
  event.respondWith(fetch(event.request));
});
