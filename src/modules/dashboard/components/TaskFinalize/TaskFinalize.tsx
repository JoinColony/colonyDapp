import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';

import { ActionButton } from '~core/Button';
import { ActionTypes } from '~redux/index';
import { mergePayload } from '~utils/actions';
import { AnyTask } from '~data/index';
import { Address } from '~types/index';

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
  const transform = useCallback(
    mergePayload({
      colonyAddress,
      draftId,
    }),
    [colonyAddress, draftId],
  );
  return (
    <ActionButton
      text={MSG.finalizeTask}
      submit={ActionTypes.TASK_FINALIZE}
      error={ActionTypes.TASK_FINALIZE_ERROR}
      success={ActionTypes.TASK_FINALIZE_SUCCESS}
      transform={transform}
    />
  );
};

TaskFinalize.displayName = displayName;

export default TaskFinalize;
