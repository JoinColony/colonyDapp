import { create as createWallet } from '@colony/purser-software';
import IPFSNode from '../src/lib/ipfs';
import PurserIdentityProvider from '../src/lib/database/PurserIdentityProvider';
import { UserActivity as schema } from '../src/lib/database/schemas';
import DDB from '../src/lib/database/DDB';

let wallet;
let identityProvider;
let ddb;

beforeAll(async () => {
  DDB.registerSchema('userActivity', schema);

  wallet = await createWallet();

  identityProvider = new PurserIdentityProvider(wallet);
  const ipfs = new IPFSNode();
  ddb = await DDB.createDatabase(ipfs, identityProvider);
});

describe('FeedStore database type', () => {
  test('The all() method returns events in the order added', async () => {
    const store = await ddb.createStore('feed', 'userActivity');
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

    expect(events.length).toBe(2);
    expect(events[0].colonyName).toBe('Zombies');
    expect(events[1].colonyName).toBe('Zombies2');
  });
  test('The all() method can limit to most recent events', async () => {
    const store = await ddb.createStore('feed', 'userActivity');
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

    expect(events.length).toBe(2);
    expect(events[0].colonyName).toBe('Zombies');
    expect(recent.length).toBe(1);
    expect(recent[0].colonyName).toBe('Zombies2');
  });

  test('Can remove events using hash', async () => {
    const store = await ddb.createStore('feed', 'userActivity');
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
    expect(twoEvents.length).toBe(2);

    await store.remove(firstHash);
    const oneEvent = store.all();
    expect(oneEvent.length).toBe(1);
    expect(oneEvent[0].colonyName).toBe('Zombies2');
  });
  test('Can filter events with gt and gte, but not reverse', async () => {
    const store = await ddb.createStore('feed', 'userActivity');
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
    expect(all.length).toBe(4);

    const first = store.get({ gt: firstHash, limit: -1 });
    expect(first.length).toBe(3);
    expect(first[0].colonyName).toBe('Zombies2');

    const second = store.get({ gte: secondHash, limit: -1 });
    expect(second.length).toBe(3);
    expect(second[0].colonyName).toBe('Zombies2');

    // Does not reverse despite option
    const secondReverse = store.get({
      gte: secondHash,
      limit: -1,
      reverse: true,
    });
    expect(secondReverse.length).toBe(3);
    expect(secondReverse[0].colonyName).toBe('Zombies2');
  });
});
