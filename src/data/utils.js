/* @flow */

import nanoid from 'nanoid';

import type { Event } from './types';

/**
 * @todo : we should find a better solution for it :(
 */
import { VERSION } from './constants';

/*
 * TODO these types aren't fully working! :(
 * The argument of the created function (payload) seems to
 * not be typed, so we don't know if we're calling the
 * action creators with the right arguments.
 */
// eslint-disable-next-line import/prefer-default-export
export const createEventCreator = <T: string>(type: T) => <P>(
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
