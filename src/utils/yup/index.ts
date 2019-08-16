import { Schema, ValidateOptions } from 'yup';

export const validate = <I extends any>(schema: Schema) => async (
  value: I,
  options: ValidateOptions = { strict: true },
): Promise<I> => schema.validate(value, options);

export const validateSync = <I extends any>(schema: Schema) => (
  value: I,
  options: ValidateOptions = { strict: true },
): I => schema.validateSync(value, options);
