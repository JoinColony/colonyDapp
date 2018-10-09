/* eslint-env jest */

import { open as openWallet } from '@colony/purser-software';
import OrbitDB from 'orbit-db';
import ipfsNode from '../src/lib/ipfsNode';
import DDB from '../src/lib/database/DDB';
import PurserIdentity from '../src/lib/database/PurserIdentity';
import PurserIdentityProvider from '../src/lib/database/PurserIdentityProvider';

describe('Database setup', () => {
  test('Using purser', async () => {
    const wallet = await openWallet({
      // eslint-disable-next-line max-len
      mnemonic:
        'vibrant crane range exhaust guide culture total blossom genuine error manual lock',
    });

    const identityProvider = new PurserIdentityProvider(wallet);

    const ddb = await DDB.createDatabase(ipfsNode, identityProvider);

    /* eslint-disable no-underscore-dangle */
    expect(ddb._orbitNode).toBeInstanceOf(OrbitDB);
    expect(ddb._orbitNode.identity).toBeInstanceOf(PurserIdentity);
    /* eslint-enable no-underscore-dangle */
  });
});
