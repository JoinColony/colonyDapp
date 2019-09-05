import React, { useCallback } from 'react';
import { FormikProps } from 'formik';
import { defineMessages } from 'react-intl';

import { TaskProps } from '~immutable/index';
import { pipe, mergePayload } from '~utils/actions';
import { MultiLineEdit, ActionForm } from '~core/Fields';
import { ActionTypes } from '~redux/index';

const MSG = defineMessages({
  placeholder: {
    id: 'dashboard.TaskDescription.placeholder',
    defaultMessage: 'Description',
  },
});

interface Props extends TaskProps<'colonyAddress' | 'draftId' | 'description'> {
  disabled: boolean;
}

const TaskDescription = ({
  description,
  disabled,
  colonyAddress,
  draftId,
}: Props) => {
  const transform = useCallback(
    pipe(mergePayload({ colonyAddress, draftId })),
    [colonyAddress, draftId],
  );

  return (
    <ActionForm
      enableReinitialize
      initialValues={{
        description,
      }}
      submit={ActionTypes.TASK_SET_DESCRIPTION}
      success={ActionTypes.TASK_SET_DESCRIPTION_SUCCESS}
      error={ActionTypes.TASK_SET_DESCRIPTION_ERROR}
      transform={transform}
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
    </ActionForm>
  );
};

export default TaskDescription;
