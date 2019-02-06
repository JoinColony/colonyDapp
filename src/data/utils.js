/* @flow */

import type { ValidateOptions, Schema } from 'yup';
import nanoid from 'nanoid';
import type { EventPayload } from './types';

// @TODO: we should find a better solution for it :(
import { VERSION } from './constants';

export const validate = (schema: Schema) => async (
  value: {},
  options?: ValidateOptions = { strict: true },
) => schema.validate(value, options);

export const decoratePayload = <T: EventPayload>(args: *): T =>
  Object.assign(
    {},
    {
      id: nanoid(),
      timestamp: Date.now(),
      version: VERSION,
    },
    args,
  );
