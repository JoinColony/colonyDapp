import test from 'ava';
import * as yup from 'yup';
import { create as createWallet } from '@colony/purser-software';
import PurserIdentityProvider from '../src/lib/database/PurserIdentityProvider';
import { DocStore } from '../src/lib/database/stores';
import '../src/modules/validations';
import { DDB } from '../src/lib/database';

import createIPFSNode from './utils/createIPFSNode';

const docBlueprint = {
  getAccessController() {},
  name: 'drafts',
  schema: yup.object({
    id: yup.string(),
    title: yup.string().required(),
    specHash: yup.string(),
    dueDate: yup.date(),
    domainName: yup.string(),
    creator: yup.string().required(),
    assignee: yup.string(),
  }),
  type: DocStore,
};

test.before(async t => {
  const wallet = await createWallet();

  const identityProvider = new PurserIdentityProvider(wallet);
  const ipfs = await createIPFSNode();
  const ddb = new DDB(ipfs, identityProvider);
  await ddb.init();
  t.context = {
    ddb,
    ipfs,
    wallet,
  };
});

test.after.always(async t => {
  await t.context.ipfs.stop();
  await t.context.ddb.stop();
});

test('Can add and retrieve documents, if they match the schema', async t => {
  const { ddb } = t.context;
  const store = await ddb.createStore(docBlueprint);
  const firstDraft = {
    title: 'Zombies',
    creator: 'Zombie Jim',
  };
  const secondDraft = {
    title: 'Zombies2',
    creator: 'Zombie James',
  };

  const thirdDraft = {
    creator: 'Zombie James',
  };

  await store.add(firstDraft);
  await store.add(secondDraft);

  const all = store.all();
  const draft1 = store.get(all[0]._id);
  const draft2 = store.get(all[1]._id);

  try {
    await store.add(thirdDraft);
  } catch (e) {
    t.is(e.name, 'ValidationError');
  }

  t.is(all.length, 2);
  t.is(draft1.title, 'Zombies');
  t.is(draft2.title, 'Zombies2');
});

test('Can remove events using id', async t => {
  const { ddb } = t.context;

  const store = await ddb.createStore(docBlueprint);
  const firstDraft = {
    title: 'Zombies',
    creator: 'Zombie Jim',
  };
  await store.add(firstDraft);
  const all = store.all();
  await store.remove(all[0]._id);

  const none = store.all();
  t.is(none.length, 0);
});

test('Can update events using id', async t => {
  const { ddb } = t.context;

  const store = await ddb.createStore(docBlueprint);
  const firstDraft = {
    title: 'Zombies',
    creator: 'Zombie Jim',
  };
  await store.add(firstDraft);
  const all = store.all();
  const id = all[0]._id;
  await store.update(id, { title: 'mememe' });

  const draft1 = store.get(id);
  t.is(draft1.title, 'mememe');
});
