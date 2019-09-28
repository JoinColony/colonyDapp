import { ActionTypes, Action } from '~redux/index';
import { TaskDraftId } from '~immutable/index';
import { Address } from '~types/index';

export const taskFeedItemsSubStart = (
  colonyAddress: Address,
  draftId: TaskDraftId,
): Action<ActionTypes.TASK_FEED_ITEMS_SUB_START> => ({
  type: ActionTypes.TASK_FEED_ITEMS_SUB_START,
  payload: { colonyAddress, draftId },
  meta: { key: draftId },
});

export const taskFeedItemsSubStop = (
  colonyAddress: Address,
  draftId: TaskDraftId,
): Action<ActionTypes.TASK_FEED_ITEMS_SUB_STOP> => ({
  type: ActionTypes.TASK_FEED_ITEMS_SUB_STOP,
  payload: { colonyAddress, draftId },
  meta: { key: draftId },
});

export const taskSubStart = (
  colonyAddress: Address,
  draftId: TaskDraftId,
): Action<ActionTypes.TASK_SUB_START> => ({
  type: ActionTypes.TASK_SUB_START,
  payload: { colonyAddress, draftId },
  meta: { key: draftId },
});

export const taskSubStop = (
  colonyAddress: Address,
  draftId: TaskDraftId,
): Action<ActionTypes.TASK_SUB_STOP> => ({
  type: ActionTypes.TASK_SUB_STOP,
  payload: { colonyAddress, draftId },
  meta: { key: draftId },
});
