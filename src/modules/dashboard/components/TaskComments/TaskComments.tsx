import { FormikProps } from 'formik';
import React, { useCallback, KeyboardEvent, SyntheticEvent } from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import { mergePayload } from '~utils/actions';
import { OpenDialog } from '~core/Dialog/types';
import { Address, ENTER } from '~types/index';
import { ActionTypes } from '~redux/index';
import withDialog from '~core/Dialog/withDialog';
import { ActionForm, TextareaAutoresize } from '~core/Fields';
import { OnSuccess } from '~core/Fields/Form/ActionForm';
import Button from '~core/Button';
import unfinishedProfileOpener from '~users/UnfinishedProfile';
import { useLoggedInUser } from '~data/helpers';

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
  colonyAddress: Address;
  openDialog: OpenDialog;
  draftId: string;
  history: any;
  taskTitle: string;
}

const displayName = 'dashboard.TaskComments';

const validationSchema = yup.object().shape({
  comment: yup.string().required(),
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

const TaskComments = ({
  taskTitle,
  colonyAddress,
  draftId,
  history,
}: Props) => {
  const { username, walletAddress } = useLoggedInUser();

  const onSuccess: OnSuccess = useCallback(
    (result, { resetForm, setStatus }) => {
      setStatus({});
      // @ts-ignore proper formik typings!
      resetForm({ comment: '' });
    },
    [],
  );

  const transform = useCallback(
    mergePayload({ colonyAddress, author: walletAddress, draftId, taskTitle }),
    [colonyAddress, draftId],
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
      <ActionForm
        submit={ActionTypes.TASK_COMMENT_ADD}
        success={ActionTypes.TASK_COMMENT_ADD_SUCCESS}
        error={ActionTypes.TASK_COMMENT_ADD_ERROR}
        initialValues={{ comment: '' }}
        validationSchema={validationSchema}
        onSuccess={onSuccess}
        transform={transform}
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
              /*
               * This is an UGLY silent restriction placed on the
               * comment textarea; it's needed because the Trezor
               * wallet can't sign messages with payloads larger
               * than 1024 bytes, and all other wallets submit to
               * this limitation.
               *
               * The value below represents the max numbers of
               * characters you can comment with; the rest
               * up until 1024 represent the json data we wrap the comment with.
               * ie: {"comment":"aaa...","author":"0x1234...1234"}
               */
              maxLength={956}
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
      </ActionForm>
    </div>
  );
};

TaskComments.displayName = displayName;

export default withDialog()(TaskComments) as any;
