import React, { useCallback, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';

import { FormikProps } from 'formik';
import { useHistory } from 'react-router';
import Button from '~core/Button';
import { useDialog, ConfirmDialog } from '~core/Dialog';
import Heading from '~core/Heading';
import { Form, Input, Textarea, FormStatus } from '~core/Fields';
import {
  OneProgram,
  ProgramStatus,
  useEditProgramMutation,
  usePublishProgramMutation,
  useRemoveProgramMutation,
} from '~data/index';

import EditLevels from './EditLevels';

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
  confirmDeleteButton: {
    id: 'dashboard.ProgramEdit.confirmDeleteButton',
    defaultMessage: 'Confirm',
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
  program: { id, description, levelIds, levels, status, title },
  toggleEditMode,
}: Props) => {
  const isDraft = status === ProgramStatus.Draft;

  const openDialog = useDialog(ConfirmDialog);
  const [canPublish, setCanPublish] = useState(false);
  const history = useHistory();

  const [editProgram] = useEditProgramMutation();
  const [publishProgram, { loading: isPublishing }] = usePublishProgramMutation(
    {
      variables: { input: { id } },
    },
  );
  const [deleteProgram] = useRemoveProgramMutation({
    variables: { input: { id } },
  });

  // As an alternative to `validateOnMount`
  const checkCanPublish = useCallback(async (values: FormValues) => {
    const result = await validationSchema.isValid(values);
    setCanPublish(result);
  }, []);

  const handleUpdate = useCallback(
    async (values: FormValues) => {
      editProgram({
        variables: { input: { ...values, id } },
      });
    },
    [editProgram, id],
  );

  const handlePublish = useCallback(
    async (values: FormValues) => {
      // Save the values first
      const { errors } = await editProgram({
        variables: { input: { ...values, id } },
      });
      if (!errors) {
        await publishProgram();
      }
    },
    [editProgram, id, publishProgram],
  );

  const handleDelete = useCallback(async () => {
    await openDialog({
      appearance: { theme: 'danger' },
      heading: MSG.confirmDeleteHeading,
      children: <FormattedMessage {...MSG.confirmDeleteText} />,
      confirmButtonText: MSG.confirmDeleteButton,
    }).afterClosed();
    await deleteProgram();
    history.push(`/colony/${colonyName}`);
  }, [colonyName, deleteProgram, history, openDialog]);

  const cancelButtonActionProps = isDraft
    ? {
        linkTo: `/colony/${colonyName}`,
      }
    : {
        onClick: toggleEditMode,
      };

  return (
    <>
      <Form
        enableReinitialize
        // Use `key` to force form to reinitialize on route change
        key={id}
        initialValues={
          {
            description: description || '',
            title: title || '',
          } as FormValues
        }
        onSubmit={handleUpdate}
        validationSchema={validationSchema}
      >
        {({
          dirty,
          isSubmitting,
          isValid,
          status: formStatus,
          values,
        }: FormikProps<FormValues>) => {
          checkCanPublish(values);
          return (
            <>
              <div className={styles.formActions}>
                <div className={styles.headingContainer}>
                  <div>
                    <Heading
                      appearance={{ size: 'medium' }}
                      text={MSG.pageTitle}
                    />
                  </div>
                  <div className={styles.cancelButtonContainer}>
                    <Button
                      appearance={{ theme: 'blue' }}
                      text={{ id: 'button.cancel' }}
                      {...cancelButtonActionProps}
                    />
                  </div>
                </div>
                <div className={styles.actionButtons}>
                  <Button
                    appearance={{ theme: 'blue' }}
                    disabled={!isValid || isSubmitting || !canPublish}
                    loading={isPublishing}
                    onClick={() => handlePublish(values)}
                    text={MSG.buttonPublish}
                    title={MSG.buttonPublishTitle}
                  />
                  <Button
                    disabled={!dirty || !isValid || isPublishing}
                    loading={isSubmitting}
                    text={
                      isDraft ? MSG.buttonSubmitTextDraft : MSG.buttonSubmitText
                    }
                    type="submit"
                  />
                </div>
              </div>
              <Input
                appearance={{
                  theme: 'fat',
                  colorSchema: isDraft ? 'info' : undefined,
                }}
                label={MSG.controlLabelTitle}
                name="title"
                status={isDraft ? MSG.draftStatusText : undefined}
              />
              <br />
              <Textarea
                appearance={{ resizable: 'vertical' }}
                label={MSG.controlLabelDescription}
                name="description"
              />
              <FormStatus status={formStatus} />
            </>
          );
        }}
      </Form>
      <div className={styles.levelsContainer}>
        <EditLevels levelIds={levelIds} levels={levels} programId={id} />
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
