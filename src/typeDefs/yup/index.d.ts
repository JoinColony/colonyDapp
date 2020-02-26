import { NumberSchema, Ref, StringSchema, TestOptionsMessage } from 'yup';

declare module 'yup' {
  interface NumberSchema<T> {
    notEqualTo(ref: Ref, message?: TestOptionsMessage): NumberSchema<T>;
  }

  interface StringSchema<T> {
    address(message?: TestOptionsMessage): StringSchema<T>;
    ensAddress(message?: TestOptionsMessage): StringSchema<T>;
  }
}
