/* @flow */

import type { Address } from '~types';

/*
 * The specification for a store command.
 *
 * `I`: Object type indicating the arguments the command methods
 * will be called with.
 */
export type Command<I: *> = {
  /*
   * Script to execute the command for the given argument
   * (this usually performs a write of some kind).
   */
  execute: (args: I) => Promise<*>,
};

export type Query<I: *, R: *> = {
  execute: (args: I) => Promise<R>,
};

export type CreateColonyCommandArgs = {
  address: Address,
  colonyId: string,
  ensName: string,
  name: string,
  description: string,
  guideline: string,
  website: string,
  token: string,
};

export type UpdateColonyProfileCommandArgs = {
  name: string,
  ensName: string,
  description: string,
  guideline: string,
  website: string,
};

export type UploadColonyAvatarCommandArgs = {
  address: Address,
  ensName: string,
  avatar: string,
};

export type RemoveColonyAvatarCommandArgs = {
  address: Address,
  ensName: string,
};

export type CreateDomainCommandArgs = {
  address: Address,
  ensName: string,
  domainId: number,
};

export type CreateTaskDraftCommandArgs = {
  colonyAddress: Address,
  creator: string,
  domainId: number,
  draftId: string,
  specificationHash: string,
  taskId: string,
  title: string,
};

export type UpdateTaskDraftCommandArgs = {
  specificationHash: string,
  taskId: string,
  title: string,
};
