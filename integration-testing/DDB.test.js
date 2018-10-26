/* eslint-env jest */

import { create as createWallet } from '@colony/purser-software';
import OrbitDB from 'orbit-db';
import IPFSNode from '../src/lib/ipfs';
import DDB from '../src/lib/database/DDB';
import PurserIdentity from '../src/lib/database/PurserIdentity';
import PurserIdentityProvider from '../src/lib/database/PurserIdentityProvider';

let ipfsNode;

beforeAll(() => {
  ipfsNode = new IPFSNode();
});

describe('Database setup', () => {
  test('Using purser', async () => {
    const wallet = await createWallet();

    const identityProvider = new PurserIdentityProvider(wallet);

    const ddb = await DDB.createDatabase(ipfsNode, identityProvider);

    /* eslint-disable no-underscore-dangle */
    expect(ddb._orbitNode).toBeInstanceOf(OrbitDB);
    expect(ddb._orbitNode.identity).toBeInstanceOf(PurserIdentity);
    /* eslint-enable no-underscore-dangle */
  });
});
