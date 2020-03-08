import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';
import { FormikProps } from 'formik';

import Button from '~core/Button';
import { Form, Input, InputLabel, Textarea, FormStatus } from '~core/Fields';
import Heading from '~core/Heading';
import Panel, { PanelSection } from '~core/Panel';
import { SpinnerLoader } from '~core/Preloaders';
import LevelTasksEdit from '~dashboard/LevelTasksEdit';
import { useLevelQuery, useEditLevelMutation } from '~data/index';
import CenteredTemplate from '~pages/CenteredTemplate';

import BadgePicker from './BadgePicker';

import styles from './LevelEdit.css';

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
  labelAmountRequiredSteps: {
    id: 'dashboard.LevelEdit.labelAmountRequiredSteps',
    defaultMessage: 'Amount',
  },
  amountTotalSteps: {
    id: 'dashboard.LevelEdit.amountTotalSteps',
    defaultMessage: ' of {numTotalSteps} tasks',
  },
  badgeRequiredText: {
    id: 'dashboard.LevelEdit.badgeRequiredText',
    defaultMessage: 'A badge must be selected',
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
    .min(0)
    .max(yup.ref('numTotalSteps'), () => MSG.errorValidateNumStepsMax),
});

const displayName = 'dashboard.LevelEdit';

const LevelEdit = () => {
  const { colonyName, levelId, programId } = useParams();

  const { data } = useLevelQuery({ variables: { id: levelId } });
  const [editLevel] = useEditLevelMutation();

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

  if (!data) return <SpinnerLoader />;

  const {
    achievement,
    description,
    numRequiredSteps,
    stepIds,
    title,
  } = data.level;
  const numTotalSteps = stepIds.length;

  return (
    <CenteredTemplate>
      <div className={styles.main}>
        <Form
          enableReinitialize
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
                    linkTo={`/colony/${colonyName}/program/${programId}`}
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
                        label={MSG.labelAmountRequiredSteps}
                        appearance={{ theme: 'underlined' }}
                        name="numRequiredSteps"
                      />
                    </span>
                    <span className={styles.requiredStepsExtensionText}>
                      <FormattedMessage
                        {...MSG.amountTotalSteps}
                        values={{ numTotalSteps }}
                      />
                    </span>
                  </div>
                </PanelSection>
              </Panel>
            </>
          )}
        </Form>
        <div className={styles.levelTasksContainer}>
          <LevelTasksEdit levelId={levelId} />
        </div>
      </div>
    </CenteredTemplate>
  );
};

LevelEdit.displayName = displayName;

export default LevelEdit;
