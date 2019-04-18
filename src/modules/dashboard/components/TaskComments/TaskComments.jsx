/* @flow */

import type { FormikProps } from 'formik';

import React, { Fragment } from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import type { OpenDialog } from '~core/Dialog/types';
import type { UserType } from '~immutable';

import { ACTIONS } from '~redux';
import { useAsyncFunction } from '~utils/hooks';
import withDialog from '~core/Dialog/withDialog';
import { Form, FormStatus, TextareaAutoresize } from '~core/Fields';
import Button from '~core/Button';
import { unfinishedProfileOpener } from '~users/UnfinishedProfileDialog';

import { userDidClaimProfile } from '../../../users/checks';

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

// Can't seal this object because of withConsumerFactory
type Props = {
  currentUser: UserType,
  openDialog: OpenDialog,
  draftId: string,
  taskTitle: string,
} & FormikProps<FormValues>;

const displayName = 'dashboard.TaskComments';

const validationSchema = yup.object().shape({
  comment: yup.string().required(),
});

const TaskComments = ({
  openDialog,
  currentUser: {
    profile: { balance, walletAddress },
  },
  currentUser,
  taskTitle,
  draftId,
}: Props) => {
  const addComment = useAsyncFunction({
    submit: ACTIONS.TASK_COMMENT_ADD,
    success: ACTIONS.TASK_COMMENT_ADD_SUCCESS,
    error: ACTIONS.TASK_COMMENT_ADD_ERROR,
  });

  const didClaimProfile = userDidClaimProfile(currentUser);

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

  const handleCommentSubmit = ({ comment }: FormValues, actions) => {
    addComment({
      commentData: {
        body: comment,
        author: walletAddress,
      },
      draftId,
      taskTitle,
    }).then(() => {
      actions.setSubmitting(false);
      actions.resetForm({});
    });
  };

  const handleUnclaimedProfile = () => {
    if (!didClaimProfile) {
      return unfinishedProfileOpener(openDialog, balance);
    }
    return false;
  };

  return (
    <div
      className={styles.main}
      /*
       * @NOTE We're ussing the onFocus handler instead of click and key since this covers both
       * normal usage (click and key trigger a focus) and aria users who will focus this via
       * different means
       */
      onFocus={handleUnclaimedProfile}
      /*
       * @NOTE The `role` and `tabIndex` props are set because we're breaking
       * standard and adding click and keyboard handlers to a non-interactive
       * element
       */
      role="textbox"
      tabIndex={0}
    >
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
          values,
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
              value={values.comment || ''}
              disabled={!didClaimProfile || isSubmitting}
            />
            <FormStatus status={status} />
            <div className={styles.commentControls}>
              <Button
                loading={isSubmitting}
                disabled={!didClaimProfile || !isValid}
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
};

TaskComments.displayName = displayName;

export default withDialog()(TaskComments);
