import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormikProps, FormikConfig } from 'formik';
import { defineMessages } from 'react-intl';

import Button from '~core/Button';
import { Input, Textarea, FormStatus, UnsavedGuard } from '~core/Fields';
import Heading from '~core/Heading';
import Panel, { PanelSection } from '~core/Panel';
import {
  ProgramStatus,
  usePublishProgramMutation,
  OneProgram,
  EditProgramMutationFn,
} from '~data/index';

import styles from './ProgramEditForm.css';

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

interface Props<V> {
  colonyName: string;
  editProgram: EditProgramMutationFn;
  formikProps: FormikProps<V>;
  isDraft: boolean;
  levelIds: OneProgram['levelIds'];
  programId: OneProgram['id'];
  programStatus: OneProgram['status'];
  toggleEditMode: () => void;
  validationSchema: FormikConfig<V>['validationSchema'];
}

const displayName = 'dashboard.ProgramEdit.ProgramEditForm';

const ProgramEditForm = <V extends object>({
  colonyName,
  editProgram,
  isDraft,
  formikProps: {
    dirty,
    isValid,
    isSubmitting,
    status: formStatus,
    values: formValues,
  },
  levelIds,
  programId,
  programStatus,
  toggleEditMode,
  validationSchema,
}: Props<V>) => {
  const [canPublish, setCanPublish] = useState(false);

  const [publishProgram, { loading: isPublishing }] = usePublishProgramMutation(
    {
      variables: { input: { id: programId } },
    },
  );

  const handlePublish = useCallback(
    async (values: V) => {
      // Save the values first
      const { errors } = await editProgram({
        variables: { input: { ...values, id: programId } },
      });
      if (!errors) {
        await publishProgram();
      }
    },
    [editProgram, programId, publishProgram],
  );

  useEffect(() => {
    const checkCanPublish = async () => {
      return validationSchema.isValid(formValues);
    };
    const result = checkCanPublish();
    setCanPublish(result && levelIds.length > 0);
  }, [formValues, levelIds.length, validationSchema]);

  const cancelButtonActionProps = useMemo(
    () =>
      isDraft
        ? {
            linkTo: `/colony/${colonyName}`,
          }
        : {
            onClick: toggleEditMode,
          },
    [colonyName, isDraft, toggleEditMode],
  );
  return (
    <>
      <UnsavedGuard />
      <div className={styles.formActions}>
        <div className={styles.headingContainer}>
          <div>
            <Heading appearance={{ size: 'medium' }} text={MSG.pageTitle} />
          </div>
        </div>
        <div>
          <Button
            appearance={{ theme: 'blue' }}
            text={{ id: 'button.cancel' }}
            {...cancelButtonActionProps}
          />
          {programStatus === ProgramStatus.Draft && (
            <Button
              disabled={!isValid || isSubmitting || !canPublish}
              loading={isPublishing}
              onClick={() => handlePublish(formValues)}
              text={MSG.buttonPublish}
              title={MSG.buttonPublishTitle}
            />
          )}
          <Button
            disabled={!dirty || !isValid || isPublishing}
            loading={isSubmitting}
            text={isDraft ? MSG.buttonSubmitTextDraft : MSG.buttonSubmitText}
            type="submit"
          />
        </div>
      </div>
      <Panel>
        <PanelSection>
          <Input
            appearance={{
              colorSchema: 'grey',
              statusSchema: 'info',
              theme: 'fat',
            }}
            label={MSG.controlLabelTitle}
            name="title"
            status={isDraft ? MSG.draftStatusText : undefined}
          />
          <br />
          <Textarea
            appearance={{
              colorSchema: 'grey',
              resizable: 'vertical',
              theme: 'fat',
            }}
            label={MSG.controlLabelDescription}
            name="description"
            maxLength={4000}
          />
        </PanelSection>
      </Panel>
      <FormStatus status={formStatus} />
    </>
  );
};

ProgramEditForm.displayName = displayName;

export default ProgramEditForm;
