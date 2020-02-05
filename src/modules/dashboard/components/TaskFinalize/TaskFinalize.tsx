import React, { useCallback, useState } from 'react';
import { defineMessages } from 'react-intl';

import Button from '~core/Button';
import { ActionTypes } from '~redux/index';
import { mergePayload } from '~utils/actions';
import { AnyTask } from '~data/index';
import { Address } from '~types/index';
import { useAsyncFunction } from '~utils/hooks';

const MSG = defineMessages({
  finalizeTask: {
    id: 'dashboard.Task.finalizeTask',
    defaultMessage: 'Finalize task',
  },
});

const displayName = 'dashboard.TaskFinalize';

interface Props {
  draftId: AnyTask['id'];
  colonyAddress: Address;
}

const TaskFinalize = ({ draftId, colonyAddress }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const transform = useCallback(
    mergePayload({
      colonyAddress,
      draftId,
    }),
    [colonyAddress, draftId],
  );
  const finalizeTask = useAsyncFunction({
    submit: ActionTypes.TASK_FINALIZE,
    error: ActionTypes.TASK_FINALIZE_ERROR,
    success: ActionTypes.TASK_FINALIZE_SUCCESS,
    transform,
  });
  const handleOnClick = async () => {
    setIsLoading(true);
    try {
      await finalizeTask({});
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  return (
    <Button
      text={MSG.finalizeTask}
      onClick={handleOnClick}
      loading={isLoading}
    />
  );
};

TaskFinalize.displayName = displayName;

export default TaskFinalize;
