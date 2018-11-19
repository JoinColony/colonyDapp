import test from 'ava';

import DDBTestFactory from './utils/DDBTestFactory';

const factory = new DDBTestFactory('orbitdb.test');

test.before(async t => {
  const orbit1 = await factory.orbit('orbit1');
  await factory.ready();
  t.context = { orbit1 };
});

test.after.always(async () => {
  await factory.clear();
});

test('Get an orbitdb store', async t => {
  const { orbit1 } = t.context;
  const db = await orbit1.keyvalue(factory.name('get-store-test'));
  await db.put('key', 'value');
  t.is(db.get('key'), 'value');
});
