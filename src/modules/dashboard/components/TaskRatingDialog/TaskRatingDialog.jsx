/* @flow */

import type { FormikProps } from 'formik';

import React, { Fragment } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';

import Button from '~core/Button';
import Dialog from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection.jsx';
import { Checkbox, Form, InputLabel } from '~core/Fields';
import Heading from '~core/Heading';

import styles from './TaskRatingDialog.css';

const MSG = defineMessages({
  rateManager: {
    id: 'dashboard.TaskRatingDialog.rateManager',
    defaultMessage: 'Rate Manager',
  },
  endTaskRateManagerDescription: {
    id: 'dashboard.TaskRatingDialog.endTaskRateManagerDescription',
    defaultMessage:
      'Please rate the manager of this task based on the criteria below.',
  },
});

type FormValues = {
  colonyTokens: Array<string>,
};

type Props = {
  cancel: () => void,
  close: () => void,
};

const displayName = 'dashboard.TaskRatingDialog';

const validationSchema = yup.object().shape({});

const TaskRatingDialog = ({ cancel, close }: Props) => (
  <Dialog cancel={cancel} className={styles.main}>
    <Form
      initialValues={{
        rating: '',
      }}
      onSubmit={console.log}
      // validationSchema={validationSchema}
    >
      {({ isSubmitting }: FormikProps<FormValues>) => (
        <Fragment>
          <DialogSection>
            <div className={styles.contentWrapper}>
              <Heading appearance={{ size: 'medium' }} text={MSG.rateManager} />
              <p className={styles.descriptionText}>
                <FormattedMessage {...MSG.endTaskRateManagerDescription} />
              </p>
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

TaskRatingDialog.displayName = displayName;

export default TaskRatingDialog;
