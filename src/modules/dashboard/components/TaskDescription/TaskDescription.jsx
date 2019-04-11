/* @flow */

import type { FormikProps } from 'formik';

import { ContentState, EditorState } from 'draft-js';

import React from 'react';
import { defineMessages } from 'react-intl';

import type { TaskProps } from '~immutable';

import { mergePayload } from '~utils/actions';
import { MultiLineEdit, ActionForm } from '~core/Fields';
import { ACTIONS } from '~redux';

const MSG = defineMessages({
  placeholder: {
    id: 'dashboard.TaskDescription.placeholder',
    defaultMessage: 'Description',
  },
});

type Props = {|
  isTaskCreator: boolean,
  ...TaskProps<{ colonyName: *, draftId: *, description: * }>,
|};

const TaskDescription = ({
  description,
  isTaskCreator,
  colonyName,
  draftId,
}: Props) => (
  <ActionForm
    initialValues={{
      description: EditorState.createWithContent(
        ContentState.createFromText(description || ''),
      ),
    }}
    submit={ACTIONS.TASK_SET_DESCRIPTION}
    success={ACTIONS.TASK_SET_DESCRIPTION_SUCCESS}
    error={ACTIONS.TASK_SET_DESCRIPTION_ERROR}
    transform={(originalAction: *) =>
      mergePayload({
        description: originalAction.payload.description
          .getCurrentContent()
          .getPlainText(),
        colonyName,
        draftId,
      })()(originalAction)
    }
  >
    {({ submitForm }: FormikProps<*>) => (
      <MultiLineEdit
        name="description"
        placeholder={MSG.placeholder}
        readOnly={!isTaskCreator}
        onEditorBlur={() => submitForm()}
      />
    )}
  </ActionForm>
);

export default TaskDescription;
