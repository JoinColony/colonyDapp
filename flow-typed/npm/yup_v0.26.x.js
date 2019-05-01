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

  declare export type ValidateSync = (value: any, options?: ValidateOptions) => any;

  declare export type ValidateSyncAt = (path: string, value: any, options?: ValidateOptions) => any;

  declare export interface Schema {
    isValid: IsValid;
    isValidSync: IsValid;
    validate: Validate;
    validateSync: ValidateSync;
    validateSyncAt: ValidateSyncAt;
    shape(props?: Object): *;
  }

  declare export interface ObjectSchema extends Schema {
    fields: {
      [fieldName: string]: Schema,
    };
  }

  declare export interface Ref {
    [key: string]: any;
   }

  declare export interface DateSchema extends Schema {
    min(limit: Date | string | Ref, message?: string): DateSchema;
    max(limit: Date | string | Ref, message?: string): DateSchema;
    default(value: any): Schema;
}

  declare export function object(props?: Object): ObjectSchema;
  declare export function mixed(any): Schema;
  declare export function setLocale(any): void;
  declare export function addMethod(...any): void;
  declare export function array(any): Function;
  declare export function number(any): Function;
  declare export function required(any): Function;
  declare export function string(any): Function;
  declare export function date(any): DateSchema;
  declare export function boolean(any): Function;
  declare export function ref(path: string, options?: { contextPrefix: string }): Ref;
}
