import { StringSchema, TestOptionsMessage } from 'yup';

declare module 'yup' {
  interface StringSchema<T> {
    address(message?: TestOptionsMessage): StringSchema<T>;
    ensAddress(message?: TestOptionsMessage): StringSchema<T>;
  }
}
