/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import type { TaskProps } from '~immutable';

import { Form, MultiLineEdit } from '~core/Fields';

const MSG = defineMessages({
  placeholder: {
    id: 'dashboard.TaskDescription.placeholder',
    defaultMessage: 'Description',
  },
});

type Props = {|
  isTaskCreator: boolean,
  ...TaskProps<{ colonyENSName: *, draftId: *, description: * }>,
|};

const TaskDescription = ({ description, isTaskCreator }: Props) => (
  // eslint-disable-next-line no-console
  <Form onSubmit={console.log} initialValues={{ description }}>
    <MultiLineEdit
      name="description"
      placeholder={MSG.placeholder}
      readOnly={!isTaskCreator}
    />
  </Form>
);

export default TaskDescription;
