import { FormikProps, FormikBag } from 'formik';
import React, { useCallback, KeyboardEvent, SyntheticEvent } from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import { OpenDialog } from '~core/Dialog/types';
import { ENTER } from '~types/index';
import withDialog from '~core/Dialog/withDialog';
import { Form, TextareaAutoresize } from '~core/Fields';
import Button from '~core/Button';
import unfinishedProfileOpener from '~users/UnfinishedProfile';
import {
  useLoggedInUser,
  useSendTaskMessageMutation,
  AnyTask,
} from '~data/index';

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
 * This a poor man's way of detecting the Mac os platform (even though
 * it has a bit of future proofing baked in), but it's a good alternative for
 * now, until we have time to come back and make a proper detector.
 */
const isMac: boolean = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

type FormValues = {
  comment: string;
};

interface Props extends FormikProps<FormValues> {
  openDialog: OpenDialog;
  draftId: AnyTask['id'];
  history: any;
}

const displayName = 'dashboard.TaskComments';

const validationSchema = yup.object().shape({
  comment: yup
    .string()
    .trim()
    .min(1)
    .required(),
});

const handleKeyboardSubmit = (
  capturedEvent: KeyboardEvent<any>,
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

const TaskComments = ({ draftId, history }: Props) => {
  const { username } = useLoggedInUser();

  const [sendComment] = useSendTaskMessageMutation();
  const onSubmit = useCallback(
    ({ comment: message }: FormValues, { resetForm }: FormikBag<any, any>) =>
      sendComment({
        variables: {
          input: {
            id: draftId,
            message,
          },
        },
      }).then(() => resetForm()),
    [draftId, sendComment],
  );

  const handleUnclaimedProfile = useCallback(() => {
    if (!username) {
      return unfinishedProfileOpener(history);
    }
    return false;
  }, [username, history]);

  return (
    <div
      className={styles.main}
      /*
       * This uses the onFocus handler instead of click and key
       * since this covers both normal usage (click and key
       * trigger a focus) and aria users who will focus this via
       * different means
       */
      onFocus={handleUnclaimedProfile}
      /*
       * The `role` and `tabIndex` props are set because we're breaking
       * standard and adding click and keyboard handlers to a non-interactive
       * element
       */
      role="textbox"
      tabIndex={0}
    >
      <Form
        initialValues={{ comment: '' }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        validateOnMount
      >
        {({
          isSubmitting,
          isValid,
          handleSubmit,
          values,
        }: FormikProps<FormValues>) => (
          <>
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
              disabled={!username || isSubmitting}
            />
            <div className={styles.commentControls}>
              <Button
                loading={isSubmitting}
                disabled={!username || !isValid}
                text={MSG.button}
                type="submit"
                style={{ width: styles.wideButton }}
              />
            </div>
          </>
        )}
      </Form>
    </div>
  );
};

TaskComments.displayName = displayName;

export default withDialog()(TaskComments) as any;
