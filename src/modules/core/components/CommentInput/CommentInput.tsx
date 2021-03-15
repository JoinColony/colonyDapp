import React, {
  useCallback,
  KeyboardEvent,
  SyntheticEvent,
  useRef,
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

<<<<<<< HEAD:src/modules/core/components/CommentInput/CommentInput.tsx
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
=======
import styles from './Comment.css';

const displayName = 'Comment';

const MSG = defineMessages({
  commentInputPlaceholder: {
    id: 'Comment.commentInputPlaceholder',
    defaultMessage: 'What would you like to say?',
  },
  commentInstuctions: {
    id: 'Comment.commentInstuctions',
    defaultMessage: `{sendCombo} to send {newLineCombo} for a new line`,
  },
  sendCombo: {
    id: 'Comment.sendCombo',
>>>>>>> Added ActionsPageComment as a core component:src/modules/core/components/Comment/Comment.tsx
    defaultMessage: `{isMac, select,
      true {⌘}
      other {Ctrl}
    }+Return`,
  },
  newLineCombo: {
<<<<<<< HEAD:src/modules/core/components/CommentInput/CommentInput.tsx
    id: 'CommentInput.newLineCombo',
=======
    id: 'Comment.newLineCombo',
>>>>>>> Added ActionsPageComment as a core component:src/modules/core/components/Comment/Comment.tsx
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
  callback?: (message: string) => void;
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

<<<<<<< HEAD:src/modules/core/components/CommentInput/CommentInput.tsx
const CommentInput = ({ transactionHash, colonyAddress, callback }: Props) => {
=======
const Comment = ({ transactionHash, colonyAddress }: Props) => {
>>>>>>> Added ActionsPageComment as a core component:src/modules/core/components/Comment/Comment.tsx
  const commentBoxRef = useRef<HTMLInputElement>(null);

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
        commentBoxRef?.current?.scrollIntoView({ behavior: 'smooth' });
        if (callback) {
          callback(message);
        }
      }),
    [transactionHash, colonyAddress, sendTransactionMessage, callback],
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
              placeholder={MSG.commentInputPlaceholder}
              minRows={1}
              maxRows={6}
              onKeyDown={(event) => handleKeyboardSubmit(event, handleSubmit)}
              disabled={isSubmitting}
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

<<<<<<< HEAD:src/modules/core/components/CommentInput/CommentInput.tsx
CommentInput.displayName = displayName;

export default CommentInput;
=======
Comment.displayName = displayName;

export default Comment;
>>>>>>> Added ActionsPageComment as a core component:src/modules/core/components/Comment/Comment.tsx
