/* @flow */

import type { ColonyClient as ColonyClientType } from '@colony/colony-js-client';
import type { WalletObjectType } from '@colony/purser-core/flowtypes';
import type { EventStore, FeedStore } from '../../../lib/database/stores';
import type { DDB } from '../../../lib/database';
import type {
  Command,
  CreateTaskDraftCommandArgs,
  UpdateTaskDraftCommandArgs,
} from './types';

import { getColonyStore, createTaskStore, getTaskStore } from '../../stores';
import {
  createCommentStoreCreatedEvent,
  createTaskStoreCreatedEvent,
  createDraftCreatedEvent,
  createDraftUpdatedEvent,
} from '../events';

import {
  validate,
  CreateTaskDraftCommandArgsSchema,
  UpdateTaskDraftCommandArgsSchema,
} from './schemas';

export const createTask = (
  ddb: DDB,
  colonyClient: ColonyClientType,
  wallet: WalletObjectType,
): Command<CreateTaskDraftCommandArgs> => ({
  async execute(args: CreateTaskDraftCommandArgs) {
    const {
      colonyAddress,
      colonyENSName,
      draftId,
      domainId,
      creator,
      specificationHash,
      title,
      meta,
    } = await validate(CreateTaskDraftCommandArgsSchema)(args);

    // @TODO: Put it on state somehow
    const {
      taskStore,
      commentsStore,
    }: {
      taskStore: EventStore,
      commentsStore: FeedStore,
    } = (await createTaskStore(colonyClient, ddb, wallet)({
      colonyAddress,
      colonyENSName,
    }): {
      taskStore: any,
      commentsStore: any,
    });

    await taskStore.init(
      createCommentStoreCreatedEvent({
        commentsStoreAddress: commentsStore.address.toString(),
        draftId,
      }),
    );

    await taskStore.append(
      createDraftCreatedEvent({
        draftId,
        domainId,
        creator,
        specificationHash,
        title,
        meta,
      }),
    );

    const colonyStore: EventStore = (await getColonyStore(
      colonyClient,
      ddb,
      wallet,
    )(colonyENSName): any);

    await colonyStore.append(
      createTaskStoreCreatedEvent({
        taskStoreAddress: taskStore.address.toString(),
        draftId,
        domainId,
      }),
    );

    return Promise.all([
      commentsStore.load(),
      taskStore.load(),
      colonyStore.load(),
    ]);
  },
});

export const updateTaskDraft = (
  ddb: DDB,
  colonyClient: ColonyClientType,
  wallet: WalletObjectType,
): Command<UpdateTaskDraftCommandArgs> => ({
  async execute(args: UpdateTaskDraftCommandArgs) {
    const {
      colonyAddress,
      colonyENSName,
      taskStoreAddress,
      specificationHash,
      title,
      meta,
    } = await validate(UpdateTaskDraftCommandArgsSchema)(args);

    // @TODO: Put it on state somehow
    const taskStore: EventStore = (await getTaskStore(
      colonyClient,
      ddb,
      wallet,
    )({
      taskStoreAddress,
      colonyAddress,
      colonyENSName,
    }): any);

    await taskStore.append(
      createDraftUpdatedEvent({
        specificationHash,
        title,
        meta,
      }),
    );

    await taskStore.load();
  },
});
