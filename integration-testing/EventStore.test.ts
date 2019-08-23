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
  // @ts-ignore
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

test.after.always(async (t: any) => {
  await Promise.all([t.context.ipfsNode.stop(), t.context.ddb.stop()]);
});

test('The all() method returns events in the order added', async t => {
  const { ddb } = t.context as any;
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
  const { ddb } = t.context as any;
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
