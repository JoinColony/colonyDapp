import { FormikProps } from 'formik';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';

import Button from '~core/Button';
import Dialog from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection';
import { Form, Input } from '~core/Fields';
import Heading from '~core/Heading';
import StarRatingRadio from './StarRatingRadio';

import styles from './TaskRatingDialogs.css';

const MSG = defineMessages({
  rateManager: {
    id: 'dashboard.ManagerRatingDialog.rateManager',
    defaultMessage: 'Rate Manager',
  },
  rateManagerDescription: {
    id: 'dashboard.ManagerRatingDialog.rateManagerDescription',
    defaultMessage:
      'Please rate the manager of this task based on the criteria below.',
  },
  submitWork: {
    id: 'dashboard.ManagerRatingDialog.submitWork',
    defaultMessage: 'Submit Work',
  },
  submitWorkDescription: {
    id: 'dashboard.ManagerRatingDialog.submitWorkDescription',
    defaultMessage: `
      Are you ready to submit your work? You will not be able to re-submit so
      be sure you have talked to the task creator to confirm that your work
      will be accepted.
    `,
  },
  workDescriptionLabel: {
    id: 'dashboard.ManagerRatingDialog.workDescriptionLabel',
    defaultMessage: 'Work Description',
  },
  workDescriptionHelp: {
    id: 'dashboard.ManagerRatingDialog.workDescriptionHelp',
    defaultMessage: `
      (Please enter a short description or URL of the work you are submitting)
    `,
  },
  workDescriptionError: {
    id: 'dashboard.ManagerRatingDialog.workDescriptionError',
    defaultMessage: 'You must enter a brief description for the submitted work',
  },
  managerRatingTitle: {
    id: 'dashboard.ManagerRatingDialog.managerRatingTitle',
    defaultMessage: `{value, select,
      3 {Above and beyond}
      2 {Good}
      1 {Unacceptable}
    }`,
  },
  managerRatingDescription: {
    id: 'dashboard.ManagerRatingDialog.managerRatingDescription',
    defaultMessage: `{value, select,
      3 {The manager went above and beyond in their role.}
      2 {The manager performed their role well and as expected.}
      1 {Warning: this may result in a reputation penalty to the manager.}
    }`,
  },
});

interface FormValues {
  rating: 1 | 2 | 3;
  workDescription: string;
}

interface Props {
  cancel: () => void;
  close: () => void;

  /*
   * Based on this display the input to write the work submission description
   */
  submitWork: boolean;
}

const displayName = 'dashboard.ManagerRatingDialog';

const validationSchema = yup.object().shape({
  rating: yup.string().required(),
});

/*
 * In case we also have the work description input field, validate against that too.
 *
 * We need to do it this way since otherwise, in the case where the work isn't already submitted
 * it would always throw an error since the Input field wouldn't actually show up
 */
const validationSchemaExtended = validationSchema.shape({
  workDescription: yup.string().required(MSG.workDescriptionError),
});

const ManagerRatingDialog = ({ close, cancel, submitWork }: Props) => (
  <Dialog cancel={cancel}>
    <Form
      initialValues={{
        rating: '',
        workDescription: '',
      }}
      onSubmit={close}
      validationSchema={
        submitWork ? validationSchemaExtended : validationSchema
      }
    >
      {({
        isSubmitting,
        isValid,
        values: { rating },
      }: FormikProps<FormValues>) => (
        <>
          {submitWork && (
            <DialogSection appearance={{ border: 'bottom' }}>
              <section className={styles.workSubmittedSection}>
                <Heading
                  appearance={{ size: 'medium' }}
                  text={MSG.submitWork}
                />
                <p className={styles.descriptionText}>
                  <FormattedMessage {...MSG.submitWorkDescription} />
                </p>
                <div className={styles.workDescription}>
                  <Input
                    appearance={{ theme: 'fat' }}
                    label={MSG.workDescriptionLabel}
                    help={MSG.workDescriptionHelp}
                    name="workDescription"
                  />
                </div>
              </section>
            </DialogSection>
          )}
          <DialogSection>
            <div className={styles.contentWrapper}>
              <Heading appearance={{ size: 'medium' }} text={MSG.rateManager} />
              <p className={styles.descriptionText}>
                <FormattedMessage {...MSG.rateManagerDescription} />
              </p>
              <section className={styles.ratingSection}>
                {[3, 2, 1].map((value: 1 | 2 | 3) => (
                  <StarRatingRadio
                    /*
                     * Value is unique here, you won't have
                     * two ratings values be the same
                     */
                    key={value}
                    checked={rating === value}
                    name="rating"
                    value={value}
                    title={MSG.managerRatingTitle}
                    titleValues={{ value }}
                    description={MSG.managerRatingDescription}
                    descriptionValues={{ value }}
                  />
                ))}
              </section>
            </div>
          </DialogSection>
          <DialogSection appearance={{ align: 'right' }}>
            <Button
              className={styles.customCancelButton}
              onClick={cancel}
              text={{ id: 'button.cancel' }}
            />
            <Button
              appearance={{ theme: 'primary', size: 'large' }}
              disabled={!isValid}
              loading={isSubmitting}
              text={{ id: 'button.confirm' }}
              type="submit"
            />
          </DialogSection>
        </>
      )}
    </Form>
  </Dialog>
);

ManagerRatingDialog.displayName = displayName;

export default ManagerRatingDialog;
