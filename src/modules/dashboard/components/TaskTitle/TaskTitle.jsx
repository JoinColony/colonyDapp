/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import type { TaskProps } from '~immutable';

import { SingleLineEdit, Form } from '~core/Fields';

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

const TaskTitle = ({ isTaskCreator, title }: Props) => (
  // eslint-disable-next-line no-console
  <Form onSubmit={console.log} initialValues={{ title }}>
    <SingleLineEdit
      maxLength={90}
      name="title"
      placeholder={MSG.placeholder}
      readOnly={!isTaskCreator}
    />
  </Form>
);

export default TaskTitle;
