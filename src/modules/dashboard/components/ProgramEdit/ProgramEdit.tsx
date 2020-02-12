import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import { FormikProps } from 'formik';
import { useHistory } from 'react-router';
import Button from '~core/Button';
import Heading from '~core/Heading';
import { Form, Input, Textarea, FormStatus } from '~core/Fields';
import {
  OneProgram,
  ProgramStatus,
  useEditProgramMutation,
  usePublishProgramMutation,
  useRemoveProgramMutation,
} from '~data/index';

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
    defaultMessage: 'Save Draft',
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
}

const validationSchema = yup.object({
  title: yup.string().required(),
  description: yup.string(),
});

const displayName = 'dashboard.ProgramEdit';

const ProgramEdit = ({
  colonyName,
  program: { id, description, status, title },
}: Props) => {
  const isDraft = status === ProgramStatus.Draft;

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
    await deleteProgram();
    history.push(`/colony/${colonyName}`);
  }, [colonyName, deleteProgram, history]);

  return (
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
      validateOnMount
    >
      {({
        dirty,
        isSubmitting,
        isValid,
        status: formStatus,
        values,
      }: FormikProps<FormValues>) => (
        <>
          <div className={styles.formActions}>
            <div className={styles.headingContainer}>
              <div>
                <Heading appearance={{ size: 'medium' }} text={MSG.pageTitle} />
              </div>
              <div className={styles.cancelButtonContainer}>
                <Button
                  appearance={{ theme: 'blue' }}
                  text={{ id: 'button.cancel' }}
                  linkTo={`/colony/${colonyName}`}
                />
              </div>
            </div>
            <div className={styles.actionButtons}>
              <Button
                appearance={{ theme: 'blue' }}
                disabled={!isValid || isSubmitting}
                loading={isPublishing}
                onClick={() => handlePublish(values)}
                text={MSG.buttonPublish}
                title={MSG.buttonPublishTitle}
              />
              <Button
                disabled={!dirty || !isValid || isPublishing}
                loading={isSubmitting}
                text={MSG.buttonSubmitText}
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
          <Button
            appearance={{ theme: 'dangerLink' }}
            onClick={handleDelete}
            text={MSG.buttonDelete}
          />
          <FormStatus status={formStatus} />
        </>
      )}
    </Form>
  );
};

ProgramEdit.displayName = displayName;

export default ProgramEdit;
