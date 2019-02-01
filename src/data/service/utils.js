/* @flow */

import type { ValidateOptions, Schema } from 'yup';

// eslint-disable-next-line import/prefer-default-export
export const validate = (schema: Schema) => async (
  value: {},
  options?: ValidateOptions = { strict: true },
) => schema.validate(value, options);
