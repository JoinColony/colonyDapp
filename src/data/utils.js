/* @flow */

import nanoid from 'nanoid';

import type { Event } from './types';

// TODO: we should find a better solution for it :(
import { VERSION } from './constants';

// eslint-disable-next-line import/prefer-default-export
export const createEventCreator = <T: string>(type: T) => <P>(
  payload: P,
): Event<T> => ({
  meta: {
    id: nanoid(),
    timestamp: Date.now(),
    version: VERSION,
  },
  payload,
  type,
});
