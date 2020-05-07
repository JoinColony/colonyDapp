import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useHistory, useParams, Redirect } from 'react-router-dom';
import * as yup from 'yup';
import { FormikProps } from 'formik';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import Button from '~core/Button';
import { useDialog, ConfirmDialog } from '~core/Dialog';
import { Form, Input, InputLabel, Textarea, FormStatus } from '~core/Fields';
import Heading from '~core/Heading';
import Panel, { PanelSection } from '~core/Panel';
import { SpinnerLoader } from '~core/Preloaders';
import LevelTasksEdit from '~dashboard/LevelTasksEdit';
import {
  cacheUpdates,
  useColonyAddressQuery,
  useEditLevelMutation,
  useLevelQuery,
  useLoggedInUser,
  useRemoveLevelMutation,
} from '~data/index';
import CenteredTemplate from '~pages/CenteredTemplate';
import { useDataFetcher, useTransformer } from '~utils/hooks';

import BadgePicker from './BadgePicker';
import NumTotalSteps from './NumTotalSteps';
import { domainsAndRolesFetcher } from '../../fetchers';
import { getUserRoles } from '../../../transformers';
import { canAdminister } from '../../../users/checks';

import styles from './LevelEdit.css';
import InputStatus from '~core/Fields/InputStatus';

const MSG = defineMessages({
  heading: {
    id: 'dashboard.LevelEdit.heading',
    defaultMessage: 'Edit Level',
  },
  labelTitle: {
    id: 'dashboard.LevelEdit.labelTitle',
    defaultMessage: 'Level Title',
  },
  labelDescription: {
    id: 'dashboard.LevelEdit.labelDescription',
    defaultMessage: 'Level Description',
  },
  labelNumRequiredSteps: {
    id: 'dashboard.LevelEdit.labelNumRequiredSteps',
    defaultMessage: 'Set Requirement',
  },
  errorValidateNumStepsMax: {
    id: 'dashboard.LevelEdit.errorValidateNumStepsMax',
    defaultMessage: 'Can not be more than total steps',
  },
  explainerRequirement: {
    id: 'dashboard.LevelEdit.explainerRequirement',
    defaultMessage: `To complete the level and earn the achievement, users must complete {numRequiredSteps} of {numTotalSteps} tasks.`,
  },
  amountTotalSteps: {
    id: 'dashboard.LevelEdit.amountTotalSteps',
    defaultMessage: ' of {numTotalSteps} tasks',
  },
  badgeRequiredText: {
    id: 'dashboard.LevelEdit.badgeRequiredText',
    defaultMessage: 'A badge must be selected',
  },
  numRequiredStepsRequiredText: {
    id: 'dashboard.LevelEdit.numRequiredStepsRequiredText',
    defaultMessage: 'Number of required steps must be a number.',
  },
  confirmDeleteHeading: {
    id: 'dashboard.LevelEdit.confirmDeleteHeading',
    defaultMessage: 'Delete Level',
  },
  confirmDeleteText: {
    id: 'dashboard.LevelEdit.confirmDeleteText',
    defaultMessage: `Are you sure you would like to delete this level? All
      achievements will be deleted from your colony`,
  },
  buttonDeleteLevel: {
    id: 'dashboard.LevelEdit.buttonDeleteLevel',
    defaultMessage: 'Delete Level',
  },
});

interface FormValues {
  achievement: string;
  title: string;
  description: string;
  numRequiredSteps: string;
  numTotalSteps: number;
}

const validationSchema = yup.object({
  title: yup.string().required(),
  description: yup.string(),
  achievement: yup
    .string()
    .typeError(() => MSG.badgeRequiredText)
    .required(() => MSG.badgeRequiredText),
  numRequiredSteps: yup
    .number()
    .moreThan(0)
    .max(yup.ref('numTotalSteps'), () => MSG.errorValidateNumStepsMax)
    .typeError(() => MSG.numRequiredStepsRequiredText)
    .required(() => MSG.numRequiredStepsRequiredText),
});

const displayName = 'dashboard.LevelEdit';

const LevelEdit = () => {
  const { colonyName, levelId, programId } = useParams<{
    colonyName: string;
    levelId: string;
    programId: string;
  }>();
  const history = useHistory();
  const { walletAddress } = useLoggedInUser();

  const openDialog = useDialog(ConfirmDialog);

  const { data: colonyAddressData } = useColonyAddressQuery({
    variables: { name: colonyName },
  });
  const { data } = useLevelQuery({ variables: { id: levelId } });
  const [editLevel] = useEditLevelMutation();
  const [deleteLevel] = useRemoveLevelMutation({
    update: cacheUpdates.removeLevel(programId),
    variables: { input: { id: levelId } },
  });

  const handleUpdate = useCallback(
    ({ achievement, title, description, numRequiredSteps }: FormValues) =>
      editLevel({
        variables: {
          input: {
            id: levelId,
            achievement,
            title,
            description,
            numRequiredSteps: parseInt(numRequiredSteps, 10),
          },
        },
      }),
    [editLevel, levelId],
  );

  const handleDelete = useCallback(async () => {
    await openDialog({
      appearance: { theme: 'danger' },
      heading: MSG.confirmDeleteHeading,
      children: <FormattedMessage {...MSG.confirmDeleteText} />,
      confirmButtonText: { id: 'button.delete' },
    }).afterClosed();
    await deleteLevel();
    history.push(`/colony/${colonyName}/program/${programId}`);
  }, [colonyName, deleteLevel, history, openDialog, programId]);

  const { data: domains, isFetching: isFetchingDomains } = useDataFetcher(
    domainsAndRolesFetcher,
    [colonyAddressData && colonyAddressData.colonyAddress],
    [colonyAddressData && colonyAddressData.colonyAddress],
  );
  const userRoles = useTransformer(getUserRoles, [
    domains,
    ROOT_DOMAIN_ID,
    walletAddress,
  ]);

  if (!data || isFetchingDomains) return <SpinnerLoader />;

  const levelUrl = `/colony/${colonyName}/program/${programId}/level/${levelId}`;
  if (!canAdminister(userRoles)) {
    return <Redirect to={levelUrl} />;
  }

  const {
    achievement,
    description,
    numRequiredSteps,
    stepIds,
    steps,
    title,
  } = data.level;
  const numTotalSteps = stepIds.length;

  return (
    <CenteredTemplate>
      <div className={styles.main}>
        <Form
          key={levelId}
          initialValues={
            {
              achievement,
              description: description || '',
              title: title || '',
              numRequiredSteps: numRequiredSteps
                ? numRequiredSteps.toString()
                : '',
              numTotalSteps,
            } as FormValues
          }
          onSubmit={handleUpdate}
          validationSchema={validationSchema}
        >
          {({
            dirty,
            errors,
            isSubmitting,
            isValid,
            status: formStatus,
          }: FormikProps<FormValues>) => (
            <>
              <div className={styles.formActions}>
                <div className={styles.headingContainer}>
                  <Heading appearance={{ size: 'medium' }} text={MSG.heading} />
                </div>
                <div>
                  <Button
                    appearance={{ theme: 'blue' }}
                    text={{ id: 'button.cancel' }}
                    onClick={history.goBack}
                  />
                  <Button
                    disabled={!dirty || !isValid}
                    loading={isSubmitting}
                    text={{ id: 'button.save' }}
                    type="submit"
                  />
                </div>
              </div>
              <Panel>
                <PanelSection>
                  <FormStatus status={formStatus} />
                  <Input
                    appearance={{ colorSchema: 'grey', theme: 'fat' }}
                    label={MSG.labelTitle}
                    maxLength={90}
                    name="title"
                  />
                  <Textarea
                    appearance={{
                      colorSchema: 'grey',
                      resizable: 'vertical',
                      theme: 'fat',
                    }}
                    label={MSG.labelDescription}
                    name="description"
                    maxLength={4000}
                  />
                </PanelSection>
                <PanelSection>
                  <BadgePicker name="achievement" />
                </PanelSection>
                <PanelSection>
                  <div className={styles.numRequiredStepsText}>
                    <InputLabel label={MSG.labelNumRequiredSteps} />
                    <p>
                      <FormattedMessage
                        {...MSG.explainerRequirement}
                        values={{
                          numRequiredSteps: numRequiredSteps || 0,
                          numTotalSteps,
                        }}
                      />
                    </p>
                  </div>
                  <div className={styles.numRequiredStepsInput}>
                    <span className={styles.requiredStepsInputContainer}>
                      <Input
                        appearance={{ theme: 'underlined', size: 'medium' }}
                        elementOnly
                        label={MSG.labelNumRequiredSteps}
                        name="numRequiredSteps"
                      />
                    </span>
                    <span className={styles.requiredStepsExtensionText}>
                      <FormattedMessage
                        {...MSG.amountTotalSteps}
                        values={{ numTotalSteps }}
                      />
                    </span>
                    <NumTotalSteps name="numTotalSteps" value={numTotalSteps} />
                  </div>
                  <InputStatus error={errors.numRequiredSteps} />
                </PanelSection>
                <PanelSection>
                  <Button
                    appearance={{ theme: 'dangerLink' }}
                    onClick={handleDelete}
                    text={MSG.buttonDeleteLevel}
                  />
                </PanelSection>
              </Panel>
            </>
          )}
        </Form>
        <div className={styles.levelTasksContainer}>
          <LevelTasksEdit levelId={levelId} levelSteps={steps} />
        </div>
      </div>
    </CenteredTemplate>
  );
};

LevelEdit.displayName = displayName;

export default LevelEdit;
