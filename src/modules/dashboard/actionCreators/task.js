/* @flow */

import { ACTIONS } from '~redux';

import type { TaskDraftId } from '~immutable';
import type { Action } from '~redux';
import type { Address } from '~types';

export const fetchTask = (
  colonyAddress: Address,
  draftId: TaskDraftId,
): Action<typeof ACTIONS.TASK_FETCH> => ({
  type: ACTIONS.TASK_FETCH,
  payload: { colonyAddress, draftId },
  meta: { key: draftId },
});

export const fetchTaskByColonyAddressAndDraftId = ([colonyAddress, draftId]: [
  Address,
  TaskDraftId,
]) => fetchTask(colonyAddress, draftId);

export const taskFeedItemsSubStart = (
  colonyAddress: Address,
  draftId: TaskDraftId,
): Action<typeof ACTIONS.TASK_FEED_ITEMS_SUB_START> => ({
  type: ACTIONS.TASK_FEED_ITEMS_SUB_START,
  payload: { colonyAddress, draftId },
  meta: { key: draftId },
});

export const taskFeedItemsSubStop = (
  colonyAddress: Address,
  draftId: TaskDraftId,
): Action<typeof ACTIONS.TASK_FEED_ITEMS_SUB_STOP> => ({
  type: ACTIONS.TASK_FEED_ITEMS_SUB_STOP,
  payload: { colonyAddress, draftId },
  meta: { key: draftId },
});

export const taskSubStart = (
  colonyAddress: Address,
  draftId: TaskDraftId,
): Action<typeof ACTIONS.TASK_SUB_START> => ({
  type: ACTIONS.TASK_SUB_START,
  payload: { colonyAddress, draftId },
  meta: { key: draftId },
});

export const taskSubStop = (
  colonyAddress: Address,
  draftId: TaskDraftId,
): Action<typeof ACTIONS.TASK_SUB_STOP> => ({
  type: ACTIONS.TASK_SUB_STOP,
  payload: { colonyAddress, draftId },
  meta: { key: draftId },
});
