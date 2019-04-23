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
  defaultName: 'drafts',
  schema: yup.object({
    doc: yup.object({
      id: yup.string(),
      title: yup.string().required(),
      specHash: yup.string(),
      dueDate: yup.date(),
      domainName: yup.string(),
      creator: yup.string().required(),
      assignee: yup.string(),
    }),
    meta: yup.object({
      colonyENSName: yup.string(),
    }),
  }),
  type: DocStore,
};

test.before(async t => {
  const wallet = await createWallet();
  const ipfsNode = await createIPFSNode();

  const identityProvider = new PurserIdentityProvider(wallet);
  const ddb = new DDB(ipfsNode, identityProvider);
  await ddb.init();

  t.context = {
    ddb,
    ipfsNode,
    wallet,
  };
});

test.after.always(async t => {
  await t.context.ipfsNode.stop();
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
    // missing required `title`, not valid
    creator: 'Zombie James',
  };

  await store.insertOne(firstDraft);
  await store.insertOne(secondDraft);

  const all = store.getAll();
  const draft1 = store.getOne(all[0]._id);
  const draft2 = store.getOne(all[1]._id);

  try {
    await store.insertOne(thirdDraft);
  } catch (e) {
    t.is(e.name, 'ValidationError');
  }

  t.is(all.length, 2);
  t.is(draft1.title, 'Zombies');
  t.is(draft2.title, 'Zombies2');
});

test('Can remove documents using id', async t => {
  const { ddb } = t.context;

  const store = await ddb.createStore(docBlueprint);
  const firstDraft = {
    title: 'Zombies',
    creator: 'Zombie Jim',
  };
  await store.insertOne(firstDraft);
  const all = store.getAll();
  await store.removeOne(all[0]._id);

  const none = store.getAll();
  t.is(none.length, 0);
});

test('Can update documents using id', async t => {
  const { ddb } = t.context;

  const store = await ddb.createStore(docBlueprint);
  const firstDraft = {
    title: 'Zombies',
    creator: 'Zombie Jim',
  };
  await store.insertOne(firstDraft);
  const all = store.getAll();
  const id = all[0]._id;
  await store.updateOne(id, { title: 'mememe' });

  const draft1 = store.getOne(id);
  t.is(draft1.title, 'mememe');
});

test('Can upsert documents using id', async t => {
  const { ddb } = t.context;

  const store = await ddb.createStore(docBlueprint);
  const firstDraft = {
    title: 'original title',
    creator: 'original creator',
  };
  await store.insertOne(firstDraft); // inserting will generate the id for us
  const all = store.getAll();
  const draft1Id = all[0]._id;
  await store.upsertOne(draft1Id, { title: 'changed title' });

  const draft1 = store.getOne(draft1Id);
  t.is(draft1.creator, 'original creator');
  t.is(draft1.title, 'changed title');
  t.is(draft1._id, draft1Id);

  await store.upsertOne('new', {
    title: 'newly-upserted title',
    creator: 'newly-upserted creator',
  });
  const draft2 = store.getOne('new');
  t.is(draft2.title, 'newly-upserted title');
  t.is(draft2.creator, 'newly-upserted creator');
  t.is(draft2._id, 'new');

  // partial upserting without required fields should be allowed here,
  // because the document exists
  await store.upsertOne('new', {
    domainName: 'some domain name',
  });
  const draft2Updated = store.getOne('new');
  t.is(draft2Updated.title, 'newly-upserted title');
  t.is(draft2Updated.creator, 'newly-upserted creator');
  t.is(draft2Updated.domainName, 'some domain name');
  t.is(draft2Updated._id, 'new');
});
