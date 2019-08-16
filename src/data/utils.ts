import nanoid from 'nanoid';

import { AllEvents, Event } from './types/index';
import { Address } from '~types/strings';

/**
 * @todo Find a better solution for data versioning
 */
import { VERSION } from './constants';

export const createEvent = <
  T extends AllEvents['type'],
  P extends Event<T>['payload']
>(
  type: T,
  payload?: P,
): {
  payload: P;
  meta: {
    userAddress: Address;
    id: string;
    version: number;
    timestamp: number;
  };
  type: T;
} => ({
  meta: {
    id: nanoid(),
    timestamp: Date.now(),
    userAddress: '', // This will get set by the EventStore from the Orbit Entry
    version: VERSION,
  },
  payload,
  type,
});
