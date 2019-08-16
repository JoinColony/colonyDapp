import { Schema as SchemaType } from 'yup';
import { ContextName } from '~context/index';

/*
 * The specification for a data command.
 *
 * D: Dependencies the command depend on to be executed. Those will be
 * passed to execute via prepare, which uses the context to set them up.
 *
 * M: Metadata needed to locate the right store or colony contract.
 *
 * A: Optional object type for the arguments the execute function will
 * will be called with.
 *
 * R: Return type for the execute function.
 */
export type Command<D, M, A, R> = {
  context: ContextName[];

  /*
   * Script to execute the command for the given argument
   * (this usually performs a write of some kind).
   */
  execute: (deps: D, args: A) => Promise<R>;
  name: string;
  prepare: (context: any, metadata: M) => Promise<D>;
  schema?: SchemaType;
};
