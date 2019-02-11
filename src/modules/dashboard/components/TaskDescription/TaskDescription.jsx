/* @flow */

import React, { Fragment } from 'react';
import { defineMessages } from 'react-intl';

import { SingleLineEdit, MultiLineEdit } from '~core/Fields';

const MSG = defineMessages({
  taskTitlePlaceholder: {
    id: 'dashboard.TaskDescription.taskTitlePlaceholder',
    defaultMessage: 'Title',
  },
  taskDescriptionPlaceholder: {
    id: 'dashboard.TaskDescription.taskDescriptionPlaceholder',
    defaultMessage: 'Description',
  },
});

type Props = {|
  isTaskCreator: boolean,
|};

const TaskDescription = ({ isTaskCreator }: Props) => (
  <Fragment>
    <SingleLineEdit
      maxLength={90}
      name="taskTitle"
      placeholder={MSG.taskTitlePlaceholder}
      readOnly={!isTaskCreator}
    />
    <MultiLineEdit
      name="taskDescription"
      placeholder={MSG.taskDescriptionPlaceholder}
      readOnly={!isTaskCreator}
    />
  </Fragment>
);

export default TaskDescription;
