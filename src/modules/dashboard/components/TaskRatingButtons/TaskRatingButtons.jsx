/* @flow */

// $FlowFixMe
import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';

import type { TaskType } from '~immutable';
import type { Address } from '~types';

import { ActionButton, DialogActionButton } from '~core/Button';
import { ACTIONS } from '~redux';
import { mergePayload } from '~utils/actions';

import {
  managerCanEndTask,
  managerCanRateWorker,
  managerCanRevealWorkerRating,
  workerCanEndTask,
  workerCanRateManager,
  workerCanRevealManagerRating,
} from '../../checks';

const MSG = defineMessages({
  rateWorker: {
    id: 'dashboard.Task.rateWorker',
    defaultMessage: 'Rate Worker',
  },
  rateManager: {
    id: 'dashboard.Task.rateManager',
    defaultMessage: 'Rate Manager',
  },
  revealRating: {
    id: 'dashboard.Task.revealRating',
    defaultMessage: 'Reveal Rating',
  },
  submitWork: {
    id: 'dashboard.Task.submitWork',
    defaultMessage: 'Submit Work',
  },
});

type Props = {| address: Address, task: TaskType |};

const TaskRatingButtons = ({
  task: { colonyAddress, draftId },
  task,
  address,
}: Props) => {
  const transform = useCallback(mergePayload({ colonyAddress, draftId }), [
    colonyAddress,
    draftId,
  ]);

  return (
    <>
      {/* Worker misses deadline and rates manager */}
      {workerCanRateManager(task, address) && (
        <DialogActionButton
          dialog="ManagerRatingDialog"
          dialogProps={{
            submitWork: false,
          }}
          text={MSG.rateManager}
          submit={ACTIONS.TASK_WORKER_RATE_MANAGER}
          success={ACTIONS.TASK_WORKER_RATE_MANAGER_SUCCESS}
          error={ACTIONS.TASK_WORKER_RATE_MANAGER_ERROR}
          transform={transform}
        />
      )}
      {/* Worker submits work, ends task + rates before deadline */}
      {workerCanEndTask(task, address) && (
        <DialogActionButton
          dialog="ManagerRatingDialog"
          dialogProps={{
            submitWork: true,
          }}
          text={MSG.submitWork}
          submit={ACTIONS.TASK_WORKER_END}
          success={ACTIONS.TASK_WORKER_END_SUCCESS}
          error={ACTIONS.TASK_WORKER_END_ERROR}
          transform={transform}
        />
      )}
      {/* Worker misses deadline and manager ends task + rates */}
      {managerCanEndTask(task, address) && (
        <DialogActionButton
          dialog="WorkerRatingDialog"
          options={{
            workSubmitted: false,
          }}
          text={MSG.rateWorker}
          submit={ACTIONS.TASK_MANAGER_END}
          success={ACTIONS.TASK_MANAGER_END_SUCCESS}
          error={ACTIONS.TASK_MANAGER_END_ERROR}
          transform={transform}
        />
      )}
      {/* Worker makes deadline and manager rates worker */}
      {managerCanRateWorker(task, address) && (
        <DialogActionButton
          dialog="WorkerRatingDialog"
          options={{
            workSubmitted: true,
          }}
          text={MSG.rateWorker}
          submit={ACTIONS.TASK_MANAGER_RATE_WORKER}
          success={ACTIONS.TASK_MANAGER_RATE_WORKER_SUCCESS}
          error={ACTIONS.TASK_MANAGER_RATE_WORKER_ERROR}
          transform={transform}
        />
      )}
      {/* Manager reveal rating of worker */}
      {managerCanRevealWorkerRating(task, address) && (
        <ActionButton
          text={MSG.revealRating}
          submit={ACTIONS.TASK_MANAGER_REVEAL_WORKER_RATING}
          success={ACTIONS.TASK_MANAGER_REVEAL_WORKER_RATING_SUCCESS}
          error={ACTIONS.TASK_MANAGER_REVEAL_WORKER_RATING_ERROR}
          transform={transform}
        />
      )}
      {/* Worker reveal rating of manager */}
      {workerCanRevealManagerRating(task, address) && (
        <ActionButton
          text={MSG.revealRating}
          submit={ACTIONS.TASK_WORKER_REVEAL_MANAGER_RATING}
          success={ACTIONS.TASK_WORKER_REVEAL_MANAGER_RATING_SUCCESS}
          error={ACTIONS.TASK_WORKER_REVEAL_MANAGER_RATING_ERROR}
          transform={transform}
        />
      )}
    </>
  );
};

export default TaskRatingButtons;
