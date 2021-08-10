import React, {
  useCallback,
  KeyboardEvent,
  SyntheticEvent,
  useRef,
  useState,
} from 'react';
import * as yup from 'yup';
import { FormikProps, FormikBag } from 'formik';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Form, TextareaAutoresize } from '~core/Fields';
import { SpinnerLoader } from '~core/Preloaders';

import {
  useSendTransactionMessageMutation,
  TransactionMessagesDocument,
  ColonyActionQueryVariables,
} from '~data/index';
import { Address, ENTER } from '~types/index';

import styles from './CommentInput.css';

const displayName = 'CommentInput';

const MSG = defineMessages({
  commentInputPlaceholder: {
    id: 'CommentInput.commentInputPlaceholder',
    defaultMessage: 'What would you like to say?',
  },
  commentInstuctions: {
    id: 'CommentInput.commentInstuctions',
    defaultMessage: `{sendCombo} to send {newLineCombo} for a new line`,
  },
  sendCombo: {
    id: 'CommentInput.sendCombo',
    defaultMessage: `{isMac, select,
      true {⌘}
      other {Ctrl}
    }+Return`,
  },
  newLineCombo: {
    id: 'CommentInput.newLineCombo',
    defaultMessage: 'Return',
  },
});

/*
 * This a poor man's way of detecting the Mac os platform (even though
 * it has a bit of future proofing baked in), but it's a good alternative for
 * now, until we have time to come back and make a proper detector.
 */
const isMac: boolean = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

const validationSchema = yup.object().shape({
  message: yup.string().trim().min(3).required(),
});

type FormValues = {
  message: string;
};

interface Props {
  transactionHash: string;
  colonyAddress: Address;
  disabled?: boolean;
  callback?: (message: string) => void;
  disabledInputPlaceholder?: boolean;
}

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

const CommentInput = ({
  transactionHash,
  colonyAddress,
  callback,
  disabled,
  disabledInputPlaceholder,
}: Props) => {
  const commentBoxRef = useRef<HTMLInputElement>(null);
  const [
    commentBoxInputRef,
    setCommentBoxInputRef,
  ] = useState<HTMLElement | null>(null);

  const [sendTransactionMessage] = useSendTransactionMessageMutation();

  const onSubmit = useCallback(
    (
      { message }: FormValues,
      { resetForm, setFieldError }: FormikBag<object, FormValues>,
    ) =>
      sendTransactionMessage({
        variables: {
          input: {
            transactionHash,
            message,
            colonyAddress,
          },
        },
        refetchQueries: [
          {
            query: TransactionMessagesDocument,
            variables: { transactionHash } as ColonyActionQueryVariables,
          },
        ],
      }).then(() => {
        /*
         * @NOTE We need to both reset and invalidate the form after reset
         * otherwise the `isValid` status never changes, and since we hook
         * into it to display the submission controls copy, we need that
         * to be invalid after submitting.
         *
         * When you start to change the field again (ie: start typing) the
         * validator runs again and clears out the error
         */
        resetForm({});
        setFieldError('messsage', '');
        commentBoxInputRef?.focus();
        commentBoxRef?.current?.scrollIntoView({ behavior: 'smooth' });
        if (callback) {
          callback(message);
        }
      }),
    [
      transactionHash,
      colonyAddress,
      sendTransactionMessage,
      commentBoxInputRef,
      callback,
    ],
  );

  return (
    <div className={styles.main}>
      <Form
        initialValues={{ message: '' }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        validateOnMount
        validateOnBlur
      >
        {({ isSubmitting, isValid, handleSubmit }: FormikProps<FormValues>) => (
          <div className={styles.commentBox} ref={commentBoxRef}>
            <TextareaAutoresize
              elementOnly
              label={MSG.commentInputPlaceholder}
              name="message"
              placeholder={
                disabledInputPlaceholder ? '' : MSG.commentInputPlaceholder
              }
              minRows={1}
              maxRows={6}
              onKeyDown={(event) => handleKeyboardSubmit(event, handleSubmit)}
              innerRef={(ref) => setCommentBoxInputRef(ref)}
              disabled={isSubmitting || disabled}
            />
            {isSubmitting && (
              <div className={styles.submitting}>
                <SpinnerLoader />
              </div>
            )}
            <div
              className={
                isValid
                  ? styles.sendInstructionsFadeIn
                  : styles.sendInstructions
              }
            >
              <FormattedMessage
                {...MSG.commentInstuctions}
                values={{
                  sendCombo: (
                    <b>
                      <FormattedMessage {...MSG.sendCombo} values={{ isMac }} />
                    </b>
                  ),
                  newLineCombo: (
                    <b>
                      <FormattedMessage {...MSG.newLineCombo} />
                    </b>
                  ),
                }}
              />
            </div>
          </div>
        )}
      </Form>
    </div>
  );
};

CommentInput.displayName = displayName;

export default CommentInput;
