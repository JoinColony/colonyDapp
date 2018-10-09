/* eslint-env jest */

import DDBTestFactory from './utils/DDBTestFactory';

const factory = new DDBTestFactory('orbitdb.test');
let orbit1 = null;

beforeAll(async () => {
  orbit1 = await factory.orbit('orbit1');
  await factory.ready();
}, DDBTestFactory.TIMEOUT);

afterAll(async () => {
  await factory.clear();
}, DDBTestFactory.TIMEOUT);

describe('OrbitDB store management', () => {
  test('Get an orbitdb store', async () => {
    const db = await orbit1.keyvalue(factory.name('get-store-test'));
    await db.put('key', 'value');
    expect(db.get('key')).toBe('value');
  });
});
