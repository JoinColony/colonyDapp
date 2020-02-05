import { StringSchema, TestOptionsMessage } from 'yup';

declare module 'yup' {
  interface StringSchema {
    address(message?: TestOptionsMessage);
    ensAddress(message?: TestOptionsMessage);
  }
}
