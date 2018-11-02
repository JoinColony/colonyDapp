/* @flow */

import type { FormikProps } from 'formik';

import React, { Fragment } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';

import { Form, FormStatus, Textarea } from '~core/Fields';
import Button from '~core/Button';

import styles from './TaskComments.css';

const MSG = defineMessages({
  placeholder: {
    id: 'dashboard.TaskComments.placeholder',
    defaultMessage: "Type a comment and hit 'Ctrl'+'Return'",
  },
  button: {
    id: 'dashboard.TaskComments.button',
    defaultMessage: 'Comment',
  },
});

type FormValues = {
  comment: string,
};

const displayName = 'dashboard.TaskComments';

const validationSchema = yup.object().shape({
  comment: yup.string().required(),
});

const TaskComments = () => (
  <div className={styles.main}>
    <Form
      initialValues={{ comment: '' }}
      validationSchema={validationSchema}
      onSubmit={({ comment }: FormValues) =>
        /* eslint-disable-next-line no-console */
        console.log(`[${displayName}]`, comment)
      }
    >
      {({ isSubmitting, isValid, status }: FormikProps<FormValues>) => (
        <Fragment>
          <Textarea elementOnly name="comment" placeholder={MSG.placeholder} />
          <FormStatus status={status} />
          <div className={styles.commentControls}>
            <Button
              loading={isSubmitting}
              disabled={!isValid}
              text={MSG.button}
              type="submit"
              style={{ width: styles.wideButton }}
            />
          </div>
        </Fragment>
      )}
    </Form>
  </div>
);

TaskComments.displayName = displayName;

export default TaskComments;
