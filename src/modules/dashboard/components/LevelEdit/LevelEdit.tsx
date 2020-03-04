import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';
import { FormikProps } from 'formik';

import Button from '~core/Button';
import Heading from '~core/Heading';
import { Form, Input, InputLabel, Textarea, FormStatus } from '~core/Fields';
import { SpinnerLoader } from '~core/Preloaders';
import CenteredTemplate from '~pages/CenteredTemplate';
import { useLevelQuery, useEditLevelMutation } from '~data/index';

import styles from './LevelEdit.css';

import BadgePicker from './BadgePicker';

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
  achievement: yup.string(),
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
              <FormStatus status={formStatus} />
              <Input
                appearance={{ theme: 'fat' }}
                label={MSG.labelTitle}
                name="title"
              />
              <Textarea
                appearance={{ resizable: 'vertical' }}
                label={MSG.labelDescription}
                name="description"
              />
              <BadgePicker name="achievement" />
              <div className={styles.numRequiredStepsInput}>
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
                <InputLabel label={MSG.labelAmountRequiredSteps} />
                <Input
                  elementOnly
                  appearance={{ theme: 'underlined' }}
                  name="numRequiredSteps"
                />
                <FormattedMessage
                  {...MSG.amountTotalSteps}
                  values={{ numTotalSteps }}
                />
              </div>
            </>
          )}
        </Form>
      </div>
    </CenteredTemplate>
  );
};

LevelEdit.displayName = displayName;

export default LevelEdit;
