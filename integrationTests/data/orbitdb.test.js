/* eslint-env jest */
import { sleep } from '../../src/utils/time';
import * as orbit from '../../src/data/orbit';
import { Pinner } from './pinner.mock';
import Factory from './factory';

let factory = null;
let pinner = null
let orbit1 = null;
let orbit2 = null;

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

beforeAll(async () => {
  factory = new Factory('orbitdb.test');
  pinner = await factory.pinner();
  orbit1 = await factory.orbit('orbit1');
  await sleep(600); // prevent nodes with same keys
  orbit2 = await factory.orbit('orbit2');
  await factory.ready();
}, Factory.TIMEOUT);

afterAll(async () => {
  await factory.clear();
}, Factory.TIMEOUT);

describe('Orbitdb configuration', () => {
  test('Get default config', () => {
    const options = orbit.makeOptions();
    expect(options).toBeTruthy();
  });
});

describe('OrbitDB store management', () => {
  test('Get an orbitdb store', async () => {
    const db = await orbit1.keyvalue(factory.name('get-store-test'));
    await db.put('key', 'value');
    expect(db.get('key')).toBe('value');
  })
})

describe('OrtbiDB peers management', () => {
  test('an orbitdb store will be seen by the other node', async () => {
    const db = await orbit1.keyvalue(factory.name('share-store-test'));
    await pinner.pinKVStore(db.address);
    const db2 = await orbit2.keyvalue(db.address);

    await db.put('hello', 'world');

    expect(await retry(() => db2.get('hello'), 10)).toBe('world');
  }, 120000);
})
