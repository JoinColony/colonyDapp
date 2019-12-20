import { FormikProps } from 'formik';
import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';

import { MultiLineEdit, Form } from '~core/Fields';
import { useSetTaskDescriptionMutation, AnyTask } from '~data/index';

const MSG = defineMessages({
  placeholder: {
    id: 'dashboard.TaskDescription.placeholder',
    defaultMessage: 'Description',
  },
});

interface FormValues {
  description: string;
}

interface Props {
  draftId: AnyTask['id'];
  description: string | void;
  disabled: boolean;
}

const TaskDescription = ({
  description: existingDescription = '',
  disabled,
  draftId,
}: Props) => {
  const [setTaskDescription] = useSetTaskDescriptionMutation();

  const onSubmit = useCallback(
    ({ description: inputDescriptionVal = '' }: FormValues) => {
      const description = inputDescriptionVal.trim();
      // Only fire mutation if the description has changed.
      if (description !== existingDescription) {
        setTaskDescription({
          variables: {
            input: {
              description,
              id: draftId,
            },
          },
        });
      }
    },
    [draftId, existingDescription, setTaskDescription],
  );

  return (
    <Form
      enableReinitialize
      initialValues={{
        description: existingDescription,
      }}
      onSubmit={onSubmit}
    >
      {({ submitForm }: FormikProps<any>) => (
        <MultiLineEdit
          name="description"
          placeholder={MSG.placeholder}
          readOnly={disabled}
          onEditorBlur={() => {
            /*
             * Defer the form submission to let formik finish first.
             */
            setTimeout(submitForm, 0);
          }}
        />
      )}
    </Form>
  );
};

export default TaskDescription;
