/* @flow */

import type { FormikProps } from 'formik';

import React, { Fragment } from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import { Form, FormStatus, TextareaAutoresize } from '~core/Fields';
import Button from '~core/Button';

import { ENTER } from './keyTypes';

import styles from './TaskComments.css';

const MSG = defineMessages({
  placeholderWinNix: {
    id: 'dashboard.TaskComments.placeholderWinNix',
    defaultMessage: "Type a comment and hit 'Ctrl'+'Return'",
  },
  placeholderMac: {
    id: 'dashboard.TaskComments.placeholderMac',
    defaultMessage: "Type a comment and hit '⌘'+'Return'",
  },
  button: {
    id: 'dashboard.TaskComments.button',
    defaultMessage: 'Comment',
  },
});

/*
 * @NOTE This a poor man's way of detecting the Mac os platform (even though
 * it has a bit of future proofing baked in), but it's a good alternative for
 * now, until we have time to come back and make a proper detector.
 */
const isMac: boolean = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

type FormValues = {
  comment: string,
};

const displayName = 'dashboard.TaskComments';

const validationSchema = yup.object().shape({
  comment: yup.string().required(),
});

const handleCommentSubmit = ({ comment }: FormValues) =>
  /* eslint-disable-next-line no-console */
  console.log(`[${displayName}]`, comment);

const handleKeyboardSubmit = (
  capturedEvent: SyntheticKeyboardEvent<*>,
  callback: (e: SyntheticEvent<any>) => any,
) => {
  const { key, ctrlKey, metaKey } = capturedEvent;
  /*
   * The meta key is interpreted on MacOS as the command ⌘ key
   */
  if ((ctrlKey || metaKey) && key === ENTER) {
    capturedEvent.preventDefault();
    return callback(capturedEvent);
  }
  return false;
};

const TaskComments = () => (
  <div className={styles.main}>
    <Form
      initialValues={{ comment: '' }}
      validationSchema={validationSchema}
      onSubmit={handleCommentSubmit}
    >
      {({
        isSubmitting,
        isValid,
        status,
        handleSubmit,
      }: FormikProps<FormValues>) => (
        <Fragment>
          <TextareaAutoresize
            elementOnly
            name="comment"
            /*
             * @NOTE We need two message descriptors here, and can't just use
             * selectors, since the placeholder prop doesn't support passing over
             * message descriptors values
             */
            placeholder={isMac ? MSG.placeholderMac : MSG.placeholderWinNix}
            appearance={{ colorSchema: 'transparent' }}
            minRows={3}
            maxRows={8}
            onKeyDown={event => handleKeyboardSubmit(event, handleSubmit)}
            disabled={isSubmitting}
          />
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
