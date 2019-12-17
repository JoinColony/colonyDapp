import { FormikProps } from 'formik';
import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';

import { SingleLineEdit, Form } from '~core/Fields';
import { useSetTaskTitleMutation, AnyTask } from '~data/index';

const MSG = defineMessages({
  placeholder: {
    id: 'dashboard.TaskTitle.placeholder',
    defaultMessage: 'Title',
  },
});

interface FormValues {
  title: string;
}

interface Props {
  draftId: AnyTask['id'];
  disabled: boolean;
  title: string | void;
}

const TaskTitle = ({ disabled, title: existingTitle = '', draftId }: Props) => {
  const [setTitle] = useSetTaskTitleMutation();
  const onSubmit = useCallback(
    ({ title = '' }: FormValues) => {
      if (title !== existingTitle) {
        setTitle({
          variables: {
            input: {
              title,
              id: draftId,
            },
          },
        });
      }
    },
    [draftId, existingTitle, setTitle],
  );

  return (
    <Form
      enableReinitialize
      onSubmit={onSubmit}
      initialValues={{ title: existingTitle }}
    >
      {({ submitForm }: FormikProps<any>) => (
        <SingleLineEdit
          maxLength={90}
          name="title"
          placeholder={MSG.placeholder}
          readOnly={disabled}
          onBlur={() => setTimeout(submitForm, 0)}
        />
      )}
    </Form>
  );
};

export default TaskTitle;
