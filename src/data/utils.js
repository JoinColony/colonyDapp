/* @flow */

import type { Schema } from 'yup';

import nanoid from 'nanoid';

import { validateSync } from '~utils/yup';

import type { Event } from './types';

// TODO: we should find a better solution for it :(
import { VERSION } from './constants';

// eslint-disable-next-line import/prefer-default-export
export const createEventCreator = <T: string>(type: T, schema?: Schema) => <P>(
  payload: P,
): Event<T> => {
  const maybeValidatedPayload: P = schema
    ? validateSync(schema)(payload)
    : payload;
  return {
    meta: {
      id: nanoid(),
      timestamp: Date.now(),
      version: VERSION,
    },
    payload: maybeValidatedPayload,
    type,
  };
};
