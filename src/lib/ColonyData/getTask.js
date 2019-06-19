/* @flow */

import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import type { Address, XtremeQuery3000 } from '~types';
import type { TaskDraftId, TaskType } from '~immutable';
import type { ColonyManager, DDB, Wallet, Event } from '~data/types';

import {
  getCommentsStore,
  getCommentsStoreAddress,
  getTaskStore,
  getTaskStoreAddress,
} from '~data/stores';
import { TASK_EVENT_TYPES } from '~data/constants';
import { CONTEXT } from '~context/constants';

import { taskReducer } from '../../modules/dashboard/data/reducers';
import { EventStore } from '~lib/database/stores';

type Metadata = {|
  colonyAddress: Address,
  draftId: TaskDraftId,
|};

type Context = {|
  colonyManager: ColonyManager,
  ddb: DDB,
  wallet: Wallet,
|};

type Args = {|
  comments?: boolean,
|};

const {
  COMMENT_POSTED,
  DOMAIN_SET,
  DUE_DATE_SET,
  PAYOUT_SET,
  SKILL_SET,
  TASK_CANCELLED,
  TASK_CLOSED,
  TASK_CREATED,
  TASK_DESCRIPTION_SET,
  TASK_FINALIZED,
  TASK_TITLE_SET,
  WORK_INVITE_SENT,
  WORK_REQUEST_CREATED,
  WORKER_ASSIGNED,
  WORKER_UNASSIGNED,
} = TASK_EVENT_TYPES;

const taskEventTypes = new Set([
  COMMENT_POSTED,
  DOMAIN_SET,
  DUE_DATE_SET,
  PAYOUT_SET,
  SKILL_SET,
  TASK_CANCELLED,
  TASK_CLOSED,
  TASK_CREATED,
  TASK_DESCRIPTION_SET,
  TASK_FINALIZED,
  TASK_TITLE_SET,
  WORK_INVITE_SENT,
  WORK_REQUEST_CREATED,
  WORKER_ASSIGNED,
  WORKER_UNASSIGNED,
]);

const taskFilter = ({ type }: Event<*>) => taskEventTypes.has(type);
const taskSort = (a: Event<*>, b: Event<*>) =>
  a.meta.timestamp - b.meta.timestamp;

// eslint-disable-next-line import/prefer-default-export
export const getTask: XtremeQuery3000<
  { taskStore: EventStore, commentsStore: EventStore },
  Metadata,
  Args,
  TaskType,
> = Object.freeze({
  name: 'getTask',
  context: [CONTEXT.COLONY_MANAGER, CONTEXT.WALLET, CONTEXT.DDB_INSTANCE],
  async prepare(
    { colonyManager, ddb, wallet }: Context,
    metadata: Metadata,
    { comments }: Args,
  ) {
    const deps = {};
    const colonyClient = await colonyManager.getColonyClient(
      metadata.colonyAddress,
    );

    deps.taskStore = await getTaskStore(colonyClient, ddb, wallet)({
      ...metadata,
      taskStoreAddress: await getTaskStoreAddress(colonyClient, ddb, wallet)(
        metadata,
      ),
    });

    if (comments) {
      deps.commentsStore = await getCommentsStore(ddb)({
        ...metadata,
        commentsStoreAddress: await getCommentsStoreAddress(ddb)(metadata),
      });
    }

    return deps;
  },
  async executeAsync({ taskStore, commentsStore }: *, args: *) {
    return (args.comments
      ? [...taskStore.all(), ...commentsStore.all()]
      : taskStore.all()
    )
      .filter(taskFilter)
      .sort(taskSort);
  },
  executeObservable({ taskStore, commentsStore }: *, args: *) {
    if (args.comments) {
      const combined = combineLatest(
        taskStore.observable,
        commentsStore.observable,
      );
      return combined.pipe(
        map(([taskEvents, commentsEvents]) =>
          taskEvents
            .concat(commentsEvents)
            .filter(taskFilter)
            .sort(taskSort),
        ),
      );
    }
    return taskStore.observable.pipe(
      map(taskEvents => taskEvents.filter(taskFilter).sort(taskSort)),
    );
  },
  reducer: taskReducer,
  seed: { invites: [], requests: [] },
});
