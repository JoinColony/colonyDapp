/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import type { TaskProps } from '~immutable';

import { SingleLineEdit, ActionForm } from '~core/Fields';
import { ACTIONS } from '~redux';

const MSG = defineMessages({
  placeholder: {
    id: 'dashboard.TaskTitle.placeholder',
    defaultMessage: 'Title',
  },
});

type Props = {|
  isTaskCreator: boolean,
  ...TaskProps<{ colonyENSName: *, draftId: *, title: * }>,
|};

const TaskTitle = ({ isTaskCreator, title, colonyENSName, draftId }: Props) => (
  <ActionForm
    submit={ACTIONS.TASK_SET_TITLE}
    error={ACTIONS.TASK_SET_TITLE_ERROR}
    success={ACTIONS.TASK_SET_TITLE_SUCCESS}
    transform={(originalAction: *) => ({
      ...originalAction,
      payload: {
        ...originalAction.payload,
        colonyENSName,
        draftId,
      },
    })}
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

export default TaskTitle;
