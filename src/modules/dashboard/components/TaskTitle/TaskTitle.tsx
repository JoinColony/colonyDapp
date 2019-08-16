import { FormikProps } from 'formik';
import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';

import { TaskProps } from '~immutable/index';
import { mergePayload } from '~utils/actions';
import { ActionTypes } from '~redux/index';
import { SingleLineEdit, ActionForm } from '~core/Fields';

const MSG = defineMessages({
  placeholder: {
    id: 'dashboard.TaskTitle.placeholder',
    defaultMessage: 'Title',
  },
});

interface Props extends TaskProps<'colonyAddress' | 'draftId' | 'title'> {
  disabled: boolean;
}

const TaskTitle = ({ disabled, title, colonyAddress, draftId }: Props) => {
  const transform = useCallback(mergePayload({ colonyAddress, draftId }), [
    colonyAddress,
    draftId,
  ]);
  return (
    <ActionForm
      enableReinitialize
      submit={ActionTypes.TASK_SET_TITLE}
      error={ActionTypes.TASK_SET_TITLE_ERROR}
      success={ActionTypes.TASK_SET_TITLE_SUCCESS}
      transform={transform}
      initialValues={{ title }}
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
    </ActionForm>
  );
};

export default TaskTitle;
