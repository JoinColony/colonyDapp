/* @flow */

import type { Schema } from 'yup';

import nanoid from 'nanoid';

import { validateSync } from '~utils/yup';

import type { EventPayload, EventCreator, Event } from './types';

// @TODO: we should find a better solution for it :(
import { VERSION } from './constants';

export const decoratePayload = <I: *>(args: I): EventPayload<I> => ({
  id: nanoid(),
  timestamp: Date.now(),
  version: VERSION,
  ...args,
});

export const createEventCreator = <T: string, I: *, E: Event<*, *>>(
  type: T,
  schema?: Schema,
): EventCreator<I, E> => (args: I): {| ...E |} => {
  const maybeValidatedArgs: I = schema ? validateSync(schema)(args) : args;
  return {
    type,
    payload: decoratePayload<I>(maybeValidatedArgs),
  };
};
