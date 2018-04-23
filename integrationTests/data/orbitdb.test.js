/* eslint-env jest */
import * as orbit from '../../src/data/orbit'
import * as ipfs from '../../src/data/ipfs'

let ipfsNode = null;

beforeAll(async () => {
  ipfsNode = ipfs.getIPFS(ipfs.makeOptions({ repo: 'orbitTests' }));
  await ipfsNode.ready();
})

afterAll(async () => {
  await ipfsNode.stop();
})

describe('Orbitdb configuration', () => {
  test('Get default config', () => {
    const options = orbit.makeOptions();
    expect(options).toBeTruthy();
  });
});

describe('OrbitDB store management', () => {
  test('Get an orbitdb store', async () => {
    const orbitDB = await orbit.getOrbitDB(ipfsNode);

    const db = await orbitDB.keyvalue('some-testing')
    await db.put('key', 'value');
    expect(db.get('key')).toBe('value');
  })
})

