/* @flow */

import React from 'react';
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
  ...TaskProps<{ colonyName: *, draftId: *, title: * }>,
|};

const TaskTitle = ({ isTaskCreator, title, colonyName, draftId }: Props) => (
  <ActionForm
    submit={ACTIONS.TASK_SET_TITLE}
    error={ACTIONS.TASK_SET_TITLE_ERROR}
    success={ACTIONS.TASK_SET_TITLE_SUCCESS}
    transform={mergePayload({ colonyName, draftId })}
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
