/* eslint-env jest */
/* eslint-disable no-underscore-dangle, dot-notation */

import createSandbox from 'jest-sandbox';

import { ROOT_DOMAIN } from '~constants';
import { EventTypes, Versions } from '~data/constants';
import PinnerConnector from '~lib/ipfs/PinnerConnector';
import { OrbitDBStore } from '~lib/database/types';

import createMockOrbitStore from './mockOrbitStore';
import EventStore from '../EventStore';

describe('EventStore', () => {
  const sandbox = createSandbox();
  const mockOrbitStore = createMockOrbitStore(sandbox);

  const mockPinner: any = {
    requestReplication: sandbox.fn(() => ({ count: 5 })),
  };

  beforeEach(() => {
    sandbox.clear();
  });

  const name = 'colony-store';
  const type = 'eventlog';

  test('It creates a EventStore', () => {
    const store = new EventStore(
      mockOrbitStore as OrbitDBStore,
      name,
      mockPinner as PinnerConnector,
    );
    expect(store.orbitStore).toBe(mockOrbitStore);
    expect(store.name).toBe(name);
    expect(EventStore.orbitType).toBe(type);
  });

  test('It performs migrations for events with a migration', () => {
    const oldEntry = {
      identity: {
        id: 'user address',
      },
      payload: {
        value: {
          type: EventTypes.TASK_CREATED,
          payload: {
            creatorAddress: 'creator address',
            draftId: 'draft id',
          },
          meta: {
            id: 'old event',
            timestamp: 123,
            version: Versions.V1,
          },
        },
      },
    };

    const store = new EventStore(
      mockOrbitStore as OrbitDBStore,
      name,
      mockPinner as PinnerConnector,
    );
    mockOrbitStore.get.mockReturnValueOnce(oldEntry);

    const newEvent = store.getEvent('');

    expect(newEvent.meta).toHaveProperty('version', Versions.V2);
    expect(newEvent.payload).toHaveProperty('domainId', ROOT_DOMAIN);
  });

  test('It does not perform migrations for events without a migration', () => {
    const oldEntry = {
      identity: {
        id: 'user address',
      },
      payload: {
        value: {
          type: EventTypes.FINALIZED,
          payload: {
            ipfsHash: '',
          },
          meta: {
            id: 'old event',
            timestamp: 123,
            userAddress: 'user address',
            version: Versions.V1,
          },
        },
      },
    };

    const store = new EventStore(
      mockOrbitStore as OrbitDBStore,
      name,
      mockPinner as PinnerConnector,
    );
    mockOrbitStore.get.mockReturnValueOnce(oldEntry);

    const newEvent = store.getEvent('');

    expect(newEvent.type).toEqual(oldEntry.payload.value.type);
    expect(newEvent.payload).toEqual(oldEntry.payload.value.payload);
    expect(newEvent.meta).toEqual(oldEntry.payload.value.meta);
  });
});
