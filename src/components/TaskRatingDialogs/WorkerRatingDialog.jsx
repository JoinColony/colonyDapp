/* @flow */

import type { FormikProps } from 'formik';

import React, { Fragment } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';

import Button from '~components/core/Button';
import Dialog from '~components/core/Dialog';
import DialogSection from '~components/core/Dialog/DialogSection.jsx';
import { Form } from '~components/core/Fields';
import Heading from '~components/core/Heading';

import StarRatingRadio from './StarRatingRadio.jsx';

import styles from './TaskRatingDialogs.css';

const MSG = defineMessages({
  rateWorker: {
    id: 'dashboard.WorkerRatingDialog.rateWorker',
    defaultMessage: 'Rate Worker',
  },
  rateWorkerDescription: {
    id: 'dashboard.WorkerRatingDialog.rateWorkerDescription',
    defaultMessage:
      "Please rate the worker's performance based on the criteria below.",
  },
  endTask: {
    id: 'dashboard.WorkerRatingDialog.endTask',
    defaultMessage: 'End Task',
  },
  endTaskDescription: {
    id: 'dashboard.WorkerRatingDialog.endTaskDescription',
    defaultMessage: `
      Are you sure you want to end the task? The worker will not be able to
      submit their work after you do this. Be sure to talk to the worker and
      confirm that the task is ready to be completed.
    `,
  },
  workerRatingTitle: {
    id: 'dashboard.WorkerRatingDialog.workerRatingTitle',
    defaultMessage: `{value, select,
      3 {Above and beyond}
      2 {Good}
      1 {Unacceptable}
    }`,
  },
  workerRatingDescription: {
    id: 'dashboard.WorkerRatingDialog.workerRatingDescription',
    defaultMessage: `{value, select,
      3 {The worker will receive their payout and 1.5x reputation.}
      2 {The worker will receive their payout and reputation.}
      1 {The worker will receive no tokens and a reputation penalty.}
    }`,
  },
});

type FormValues = {
  rating: number,
};

type Props = {|
  cancel: () => void,
  close: () => void,
  /*
   * Based on this display the input to write the work submission description
   */
  workSubmitted: boolean,
|};

const displayName = 'dashboard.WorkerRatingDialog';

const validationSchema = yup.object().shape({
  rating: yup.string().required(),
});

const WorkerRatingDialog = ({ close, cancel, workSubmitted }: Props) => (
  <Dialog cancel={cancel}>
    <Form
      initialValues={{
        rating: '',
      }}
      onSubmit={close}
      validationSchema={validationSchema}
    >
      {({
        isSubmitting,
        isValid,
        values: { rating },
      }: FormikProps<FormValues>) => (
        <Fragment>
          {!workSubmitted && (
            <DialogSection appearance={{ border: 'bottom' }}>
              <section className={styles.workSubmittedSection}>
                <Heading appearance={{ size: 'medium' }} text={MSG.endTask} />
                <p className={styles.descriptionText}>
                  <FormattedMessage {...MSG.endTaskDescription} />
                </p>
              </section>
            </DialogSection>
          )}
          <DialogSection>
            <div className={styles.contentWrapper}>
              <Heading appearance={{ size: 'medium' }} text={MSG.rateWorker} />
              <p className={styles.descriptionText}>
                <FormattedMessage {...MSG.rateWorkerDescription} />
              </p>
              <section className={styles.ratingSection}>
                {[3, 2, 1].map(value => (
                  <StarRatingRadio
                    /*
                     * @NOTE Value is unique here, you won't have
                     * two ratings values be the same
                     */
                    key={value}
                    checked={parseInt(rating, 10) === value}
                    name="rating"
                    value={value}
                    title={MSG.workerRatingTitle}
                    titleValues={{ value }}
                    description={MSG.workerRatingDescription}
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
        </Fragment>
      )}
    </Form>
  </Dialog>
);

WorkerRatingDialog.displayName = displayName;

export default WorkerRatingDialog;
