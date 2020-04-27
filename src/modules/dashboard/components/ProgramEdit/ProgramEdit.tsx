import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';

import { useHistory } from 'react-router';
import Button from '~core/Button';
import { useDialog, ConfirmDialog } from '~core/Dialog';
import { Form } from '~core/Fields';
import {
  OneProgram,
  ProgramStatus,
  useEditProgramMutation,
  useRemoveProgramMutation,
} from '~data/index';

import ProgramLevelsEdit from '../ProgramLevelsEdit';
import ProgramEditForm from './ProgramEditForm';

import styles from './ProgramEdit.css';

const MSG = defineMessages({
  buttonDelete: {
    id: 'dashboard.ProgramEdit.buttonDelete',
    defaultMessage: 'Delete program',
  },
  buttonPublish: {
    id: 'dashboard.ProgramEdit.buttonPublish',
    defaultMessage: 'Publish',
  },
  buttonPublishTitle: {
    id: 'dashboard.ProgramEdit.buttonPublishTitle',
    defaultMessage: 'Save and Publish',
  },
  buttonSubmitText: {
    id: 'dashboard.ProgramEdit.buttonSubmitText',
    defaultMessage: 'Save',
  },
  buttonSubmitTextDraft: {
    id: 'dashboard.ProgramEdit.buttonSubmitTextDraft',
    defaultMessage: 'Save Draft',
  },
  confirmDeleteHeading: {
    id: 'dashboard.ProgramEdit.confirmDeleteHeading',
    defaultMessage: 'Delete Program',
  },
  confirmDeleteText: {
    id: 'dashboard.ProgramEdit.confirmDeleteText',
    defaultMessage: `Are you sure you would like to delete this program? All
      levels and achievements will be deleted from your colony.`,
  },
  controlLabelTitle: {
    id: 'dashboard.ProgramEdit.controlLabelTitle',
    defaultMessage: 'Program Title',
  },
  controlLabelDescription: {
    id: 'dashboard.ProgramEdit.controlLabelDescription',
    defaultMessage: 'Program Description',
  },
  draftStatusText: {
    id: 'dashboard.ProgramEdit.draftStatusText',
    defaultMessage: 'Draft. Only admins can see and edit this program.',
  },
  pageTitle: {
    id: 'dashboard.ProgramEdit.pageTitle',
    defaultMessage: 'Edit Program',
  },
});

interface FormValues {
  title: string;
  description: string;
  publish?: boolean;
}

interface Props {
  colonyName: string;
  program: OneProgram;
  toggleEditMode: () => void;
}

const validationSchema = yup.object({
  title: yup.string().required(),
  description: yup.string(),
});

const displayName = 'dashboard.ProgramEdit';

const ProgramEdit = ({
  colonyName,
  program: { id: programId, description, levelIds, status, title },
  program,
  toggleEditMode,
}: Props) => {
  const isDraft = status === ProgramStatus.Draft;

  const openDialog = useDialog(ConfirmDialog);
  const history = useHistory();

  const [editProgram] = useEditProgramMutation();
  const [deleteProgram] = useRemoveProgramMutation({
    variables: { input: { id: programId } },
  });

  const handleUpdate = useCallback(
    async (values: FormValues) => {
      editProgram({
        variables: { input: { ...values, id: programId } },
      });
    },
    [editProgram, programId],
  );

  const handleDelete = useCallback(async () => {
    await openDialog({
      appearance: { theme: 'danger' },
      heading: MSG.confirmDeleteHeading,
      children: <FormattedMessage {...MSG.confirmDeleteText} />,
      confirmButtonText: { id: 'button.delete' },
    }).afterClosed();
    await deleteProgram();
    history.push(`/colony/${colonyName}`);
  }, [colonyName, deleteProgram, history, openDialog]);

  return (
    <>
      <Form
        enableReinitialize
        // Use `key` to force form to reinitialize on route change
        key={programId}
        initialValues={
          {
            description: description || '',
            title: title || '',
          } as FormValues
        }
        onSubmit={handleUpdate}
        saveGuard
        validationSchema={validationSchema}
      >
        {(formikProps) => (
          <ProgramEditForm<FormValues>
            colonyName={colonyName}
            editProgram={editProgram}
            formikProps={formikProps}
            isDraft={isDraft}
            levelIds={levelIds}
            programId={programId}
            programStatus={status}
            toggleEditMode={toggleEditMode}
            validationSchema={validationSchema}
          />
        )}
      </Form>
      <div className={styles.levelsContainer}>
        <ProgramLevelsEdit colonyName={colonyName} program={program} />
      </div>
      <Button
        appearance={{ theme: 'dangerLink' }}
        onClick={handleDelete}
        text={MSG.buttonDelete}
      />
    </>
  );
};

ProgramEdit.displayName = displayName;

export default ProgramEdit;
