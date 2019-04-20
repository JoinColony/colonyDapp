import test from 'ava';
import * as yup from 'yup';
import { create as createWallet } from '@colony/purser-software';
import PurserIdentityProvider from '../src/lib/database/PurserIdentityProvider';
import { FeedStore } from '../src/lib/database/stores';
import '../src/modules/validations';
import { DDB } from '../src/lib/database';

import createIPFSNode from './utils/createIPFSNode';

const feedBlueprint = {
  getAccessController() {},
  defaultName: 'activity',
  schema: yup.object({
    userAction: yup.string().required(),
    colonyName: yup.string().required(),
  }),
  type: FeedStore,
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
  await t.context.ddb.stop();
});

test('The all() method returns events in the order added', async t => {
  const { ddb } = t.context;
  const store = await ddb.createStore(feedBlueprint);
  const firstActivity = {
    colonyName: 'Zombies',
    userAction: 'joinedColony',
  };
  const secondActivity = {
    colonyName: 'Zombies2',
    userAction: 'acceptedTask',
  };

  await store.add(firstActivity);
  await store.add(secondActivity);

  const events = store.all();

  t.is(events.length, 2);
  t.is(events[0].colonyName, 'Zombies');
  t.is(events[1].colonyName, 'Zombies2');
});

test('The all() method can limit to most recent events', async t => {
  const { ddb } = t.context;
  const store = await ddb.createStore(feedBlueprint);
  const firstActivity = {
    colonyName: 'Zombies',
    userAction: 'joinedColony',
  };
  const secondActivity = {
    colonyName: 'Zombies2',
    userAction: 'acceptedTask',
  };

  await store.add(firstActivity);
  await store.add(secondActivity);

  const events = store.all({ limit: 3 });
  const recent = store.all({ limit: 1 });

  t.is(events.length, 2);
  t.is(events[0].colonyName, 'Zombies');
  t.is(recent.length, 1);
  t.is(recent[0].colonyName, 'Zombies2');
});

test('Can remove events using hash', async t => {
  const { ddb } = t.context;

  const store = await ddb.createStore(feedBlueprint);
  const firstActivity = {
    colonyName: 'Zombies',
    userAction: 'joinedColony',
  };
  const secondActivity = {
    colonyName: 'Zombies2',
    userAction: 'acceptedTask',
  };

  const firstHash = await store.add(firstActivity);
  await store.add(secondActivity);

  const twoEvents = store.all();
  t.is(twoEvents.length, 2);

  await store.remove(firstHash);
  const oneEvent = store.all();
  t.is(oneEvent.length, 1);
  t.is(oneEvent[0].colonyName, 'Zombies2');
});

test('Can filter events with gt and gte, but not reverse', async t => {
  const { ddb } = t.context;

  const store = await ddb.createStore(feedBlueprint);
  const firstActivity = {
    colonyName: 'Zombies',
    userAction: 'joinedColony',
  };
  const secondActivity = {
    colonyName: 'Zombies2',
    userAction: 'acceptedTask',
  };
  const thirdActivity = {
    colonyName: 'Zombies3',
    userAction: 'acceptedTask',
  };
  const fourthActivity = {
    colonyName: 'Zombies4',
    userAction: 'acceptedTask',
  };

  const firstHash = await store.add(firstActivity);
  const secondHash = await store.add(secondActivity);
  await store.add(thirdActivity);
  await store.add(fourthActivity);

  const all = store.all();
  t.is(all.length, 4);

  const first = store.get({ gt: firstHash, limit: -1 });
  t.is(first.length, 3);
  t.is(first[0].colonyName, 'Zombies2');

  const second = store.get({ gte: secondHash, limit: -1 });
  t.is(second.length, 3);
  t.is(second[0].colonyName, 'Zombies2');

  // Does not reverse despite option
  const secondReverse = store.get({
    gte: secondHash,
    limit: -1,
    reverse: true,
  });
  t.is(secondReverse.length, 3);
  t.is(secondReverse[0].colonyName, 'Zombies2');
});
