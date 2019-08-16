/* eslint-env jest */
/* eslint-disable no-underscore-dangle */

import createSandbox from 'jest-sandbox';

import createMockOrbitStore from './mockOrbitStore';
import EventStore from '../EventStore';
import PinnerConnector from '~lib/ipfs/PinnerConnector';
import { OrbitDBStore } from '~lib/database/types';

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
    expect(store._orbitStore).toBe(mockOrbitStore);
    expect(store._name).toBe(name);
    expect(EventStore.orbitType).toBe(type);
  });
});
