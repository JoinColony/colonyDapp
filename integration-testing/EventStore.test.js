import test from 'ava';
import { create as createWallet } from '@colony/purser-software';

import '../src/modules/validations';

import { DDB } from '../src/lib/database';
import PurserIdentityProvider from '../src/data/PurserIdentityProvider';
import { PermissiveAccessController } from '../src/data/accessControllers';
import { EventStore } from '../src/lib/database/stores';

import createIPFSNode from './utils/createIPFSNode';

const storeBlueprint = {
  getAccessController: () => new PermissiveAccessController(),
  getName: () => 'activity',
  type: EventStore,
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
  await Promise.all([t.context.ipfsNode.stop(), t.context.ddb.stop()]);
});

test('The all() method returns events in the order added', async t => {
  const { ddb } = t.context;
  const store = await ddb.createStore(storeBlueprint);
  const firstActivity = {
    colonyName: 'Zombies',
    userAction: 'joinedColony',
  };
  const secondActivity = {
    colonyName: 'Zombies2',
    userAction: 'acceptedTask',
  };

  await store.append(firstActivity);
  await store.append(secondActivity);

  const events = store.all();

  t.is(events.length, 2);
  t.is(events[0].colonyName, 'Zombies');
  t.is(events[1].colonyName, 'Zombies2');
  await store.drop();
});

test('The all() method can limit to most recent events', async t => {
  const { ddb } = t.context;
  const store = await ddb.createStore(storeBlueprint);
  const firstActivity = {
    colonyName: 'Zombies',
    userAction: 'joinedColony',
  };
  const secondActivity = {
    colonyName: 'Zombies2',
    userAction: 'acceptedTask',
  };

  await store.append(firstActivity);
  await store.append(secondActivity);

  const events = store.all({ limit: 3 });
  const recent = store.all({ limit: 1 });

  t.is(events.length, 2);
  t.is(events[0].colonyName, 'Zombies');
  t.is(recent.length, 1);
  t.is(recent[0].colonyName, 'Zombies2');
  await store.drop();
});

test('Can filter events with gt and gte, but not reverse', async t => {
  const { ddb } = t.context;
  const store = await ddb.createStore(storeBlueprint);
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

  const firstHash = await store.append(firstActivity);
  const secondHash = await store.append(secondActivity);
  await store.append(thirdActivity);
  await store.append(fourthActivity);

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
  await store.drop();
});
