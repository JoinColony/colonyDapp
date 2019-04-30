/* @flow */

import nanoid from 'nanoid';

import type { Event } from './types';

/**
 * @todo : we should find a better solution for it :(
 */
import { VERSION } from './constants';

// eslint-disable-next-line import/prefer-default-export
export const createEvent = <T: string, P: $PropertyType<Event<T>, 'payload'>>(
  type: T,
  payload: P,
): Event<T> => ({
  meta: {
    id: nanoid(),
    timestamp: Date.now(),
    userAddress: '', // This will get set by the EventStore from the Orbit Entry
    version: VERSION,
  },
  payload,
  type,
});
