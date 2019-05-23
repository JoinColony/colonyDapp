/* @flow */

import type { FormikProps } from 'formik';

import { ContentState, EditorState } from 'draft-js';

// $FlowFixMe upgrade react
import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';

import type { TaskProps } from '~immutable';

import { pipe, mapPayload, mergePayload } from '~utils/actions';
import { MultiLineEdit, ActionForm } from '~core/Fields';
import { ACTIONS } from '~redux';

const MSG = defineMessages({
  placeholder: {
    id: 'dashboard.TaskDescription.placeholder',
    defaultMessage: 'Description',
  },
});

type Props = {|
  disabled: boolean,
  ...TaskProps<{ colonyAddress: *, draftId: *, description: * }>,
|};

const TaskDescription = ({
  description,
  disabled,
  colonyAddress,
  draftId,
}: Props) => {
  const transform = useCallback(
    pipe(
      mapPayload(({ description: editor }) => ({
        description: editor.getCurrentContent().getPlainText(),
      })),
      mergePayload({ colonyAddress, draftId }),
    ),
    [colonyAddress, draftId],
  );
  return (
    <ActionForm
      enableReinitialize
      initialValues={{
        description: EditorState.createWithContent(
          ContentState.createFromText(description || ''),
        ),
      }}
      submit={ACTIONS.TASK_SET_DESCRIPTION}
      success={ACTIONS.TASK_SET_DESCRIPTION_SUCCESS}
      error={ACTIONS.TASK_SET_DESCRIPTION_ERROR}
      transform={transform}
    >
      {({ submitForm }: FormikProps<*>) => (
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
