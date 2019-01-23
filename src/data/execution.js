/* @flow */

import type { ObjectSchema } from 'yup';

import { call } from 'redux-saga/effects';

/*
 * The specification for a store command.
 *
 * `A`: Object type indicating the arguments the command methods
 * will be called with.
 */
export type CommandSpec<A: Object> = {
  /*
   * The schema the argument `A` will be checked against.
   */
  schema: ObjectSchema,
  /*
   * Script to execute the command for the given argument
   * (this usually performs a write of some kind).
   */
  executor?: (spec: CommandSpec<A>, argument: A) => Promise<void>,
};

export type QuerySpec<A: Object, R: *> = {
  execute: (argument: A) => Promise<R>,
};

export type EventCommandSpec = CommandSpec;

// TODO validate the spec and make sure it has what we need
const validateCommandSpec = (spec: CommandSpec<*>) => Boolean(spec);

// TODO
const defaultExecutor = async () => null;
const addEvent = async () => null;

export const executeCommand = async (spec: CommandSpec<*>, argument: *) => {
  validateCommandSpec(spec);
  const { executor = defaultExecutor } = spec;
  return executor(spec, argument);
};

/*
 * Given a command spec and argument for the command,
 * validate that the argument matches the spec's schema.
 */
export const validateCommand = async (
  { schema }: CommandSpec<*>,
  argument: *,
) => schema.validate(argument);

/*
 * Executor for event commands.
 */
export const eventCommandExecutor = async (
  spec: EventCommandSpec<*>,
  argument: *,
) => {
  await validateCommand(spec, argument);
  const { getPayload, getStore, isUnique, type } = spec;
  const event = { type, payload: getPayload(argument) };
  const store = getStore(argument);

  if (isUnique) {
    // TODO check that the event is unique in the store
  }

  // `addEvent` is a command to take an eventStore and add an event to it
  return addEvent(store, event);
};

// TODo think about this
export const createStoreExecutor = async (
  spec: CommandSpec<*>,
  argument: *,
) => {
  await validateCommand(spec, argument);
  // const store =
};

export function* executeCommands(
  commands: CommandSpec<*>[],
  initialArgument: *,
) {
  // TODO iterate through commands, combine argument with return of each execution
  // execute(command, { ...argument })
}

/*
 * For use in sagas!
 * Given a command spec and argument for the command,
 * validate the spec and execute the command with its preferred
 * executor script.
 */
export const execute = (spec: CommandSpec<*> | CommandSpec<*>[], argument: *) =>
  call(Array.isArray(spec) ? executeCommand : executeCommands, spec, argument);

export default execute;
