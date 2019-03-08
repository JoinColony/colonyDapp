/* @flow */

import type { Schema as SchemaType } from 'yup';

/*
 * The specification for a data command.
 *
 * C: Optional object type indicating the context the command will
 * be executed with.
 *
 * A: Optional object type for the arguments the execute function will
 * will be called with.
 *
 * R: Return type for the execute function.
 */
export type Command<C: ?Object, A: ?Object, R> = C => {|
  /*
   * Script to execute the command for the given argument
   * (this usually performs a write of some kind).
   */
  execute: (args: A) => Promise<R>,
  schema?: SchemaType,
|};
