/* @flow */

// TODO add more to this as we use it (currently incomplete).

import { IsValid, Validate } from 'yup';

declare module 'yup' {
  declare export type ValidateOptions = {
    strict?: boolean,
    abortEarly?: boolean,
    stripUnknown?: boolean,
    recursive?: boolean,
    context?: {},
  };

  declare export type IsValid = (value: any, options?: ValidateOptions) => Promise<true>;

  declare export type Validate = (value: any, options?: ValidateOptions) => Promise<any>;

  declare export interface Schema {
    isValid: IsValid;
    validate: Validate;
    shape(props?: Object): *;
  }

  declare export interface ObjectSchema extends Schema {
    fields: {
      [fieldName: string]: Schema,
    };
  }

  declare export function object(props?: Object): ObjectSchema;

  declare export function mixed(any): Schema;
  declare export function setLocale(any): void;
  declare export function addMethod(...any): void;
  declare export function array(any): Function;
  declare export function number(any): Function;
  declare export function required(any): Function;
  declare export function string(any): Function;
}
