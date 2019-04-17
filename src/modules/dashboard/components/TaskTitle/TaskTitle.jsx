/* @flow */

// $FlowFixMe upgrade react
import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';

import type { TaskProps } from '~immutable';

import { mergePayload } from '~utils/actions';
import { ACTIONS } from '~redux';

import { SingleLineEdit, ActionForm } from '~core/Fields';

const MSG = defineMessages({
  placeholder: {
    id: 'dashboard.TaskTitle.placeholder',
    defaultMessage: 'Title',
  },
});

type Props = {|
  isTaskCreator: boolean,
  ...TaskProps<{ colonyAddress: *, draftId: *, title: * }>,
|};

const TaskTitle = ({ isTaskCreator, title, colonyAddress, draftId }: Props) => {
  const transform = useCallback(mergePayload({ colonyAddress, draftId }), [
    colonyAddress,
    draftId,
  ]);
  return (
    <ActionForm
      submit={ACTIONS.TASK_SET_TITLE}
      error={ACTIONS.TASK_SET_TITLE_ERROR}
      success={ACTIONS.TASK_SET_TITLE_SUCCESS}
      transform={transform}
      initialValues={{ title }}
    >
      <SingleLineEdit
        maxLength={90}
        name="title"
        placeholder={MSG.placeholder}
        readOnly={!isTaskCreator}
      />
    </ActionForm>
  );
};

export default TaskTitle;
