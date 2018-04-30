/* eslint-env jest */
import * as orbit from '../../src/data/orbit'
import * as ipfs from '../../src/data/ipfs'
import { Pinner } from "./pinner.mock"

let ipfsNode = null;
let ipfsNode2 = null;
let pinner = null

beforeAll(async () => {
  pinner = await Pinner();

  ipfsNode = ipfs.getIPFS(ipfs.makeOptions({
    repo: '/tmp/tests/orbit/ipfs1',
    bootstrap: pinner.bootstrap()
  }));
  await ipfsNode.ready();

  ipfsNode2 = ipfs.getIPFS(ipfs.makeOptions({
    repo: '/tmp/tests/orbit/ipfs2',
    bootstrap: pinner.bootstrap()
  }));
  await ipfsNode2.ready();

  await Promise.all([pinner.waitForMe(ipfsNode), pinner.waitForMe(ipfsNode2)]);
}, 240000)

afterAll(async () => {
  // await ipfsNode.stop();
  // await ipfsNode2.stop();
  // await pinner.stop();
}, 240000)

describe('Orbitdb configuration', () => {
  test('Get default config', () => {
    const options = orbit.makeOptions();
    expect(options).toBeTruthy();
  });
});

describe('OrbitDB store management', () => {
  test('Get an orbitdb store', async () => {
    const orbitDB = await orbit.getOrbitDB(ipfsNode, { path: '/tmp/tests/orbit/orbit1' });

    const db = await orbitDB.keyvalue('some-testing')
    await db.put('key', 'value');
    expect(db.get('key')).toBe('value');
  })
})

// https://stackoverflow.com/a/39914235
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retry(f, attempts) {
  let r = f()
  console.log('GOT=', r);

  while (!r && attempts > 0) {
    await sleep(500);
    r = f();
    attempts--;
    console.log('Retried, GOT=', r);
  }

  return r
}

describe('OrtbiDB peers management', () => {
  test('an orbitdb store will be seen by the other node', async () => {
    const orbitDB = await orbit.getOrbitDB(ipfsNode, { path: '/tmp/tests/orbit/orbit1' });
    await sleep(2000);
    const db = await orbitDB.keyvalue('some-testing')

    await pinner.pinKVStore(db.address);

    const orbitDB2 = await orbit.getOrbitDB(ipfsNode2, { path: '/tmp/tests/orbit/orbit2' });
    await sleep(2000);
    const db2 = await orbitDB2.keyvalue(db.address);

    await db.put('hello', 'world');

    expect(await retry(() => db2.get('hello'), 10)).toBe('world');
  }, 120000);
})

