/* @flow */

/*
 * This is a bare-bone implementation of the redux-form flow types.
 * This is needed because the flow types provided by this library are out of
 * date and will not work with the current flow version.
 *
 * This should be removed once these flow types are avaiable from the maintainer
 */
declare module 'redux-form' {
  declare export class Field {}
  declare export type FieldProps = any;
  declare export type FormProps = any;
  declare export function reduxForm(...*): *;
  declare export function reducer(...*): void;
}
