import React, {
  useCallback,
  KeyboardEvent,
  SyntheticEvent,
  useRef,
  useState,
} from 'react';
import * as yup from 'yup';
import { FormikProps, FormikBag } from 'formik';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';
import PubNub from 'pubnub';

import { Form, TextareaAutoresize } from '~core/Fields';
import { SpinnerLoader } from '~core/Preloaders';

import { ENTER } from '~types/index';
import { MessageType } from './PubNubSingleMessage';

import styles from './PubNubCommentInput.css';

const displayName = 'users.UserProfilePubNumComments.PubNubCommentInput';

const MSG = defineMessages({
  commentInputPlaceholder: {
    id: `users.UserProfilePubNumComments.PubNubCommentInput.commentInputPlaceholder`,
    defaultMessage: 'What would you like to say?',
  },
  commentInstuctions: {
    id: 'users.UserProfilePubNumComments.PubNubCommentInput.commentInstuctions',
    defaultMessage: `{sendCombo} to send {newLineCombo} for a new line`,
  },
  newLineCombo: {
    id: 'users.UserProfilePubNumComments.PubNubCommentInput.newLineCombo',
    defaultMessage: 'Shift+Return',
  },
  sendCombo: {
    id: 'users.UserProfilePubNumComments.PubNubCommentInput.sendCombo',
    defaultMessage: 'Return',
  },
});

const validationSchema = yup.object().shape({
  message: yup.string().trim().min(3).required(),
});

type FormValues = {
  message: string;
};

interface Props {
  disabled?: boolean;
  callback?: (message: string) => void;
  disabledInputPlaceholder?: MessageDescriptor | string;
  client: PubNub;
  channel: string;
}

const handleKeyboardSubmit = (
  capturedEvent: KeyboardEvent<any>,
  callback: (e: SyntheticEvent<any>) => any,
) => {
  const { key, shiftKey } = capturedEvent;

  /*
   * The meta key is interpreted on MacOS as the command ⌘ key
   */
  if (!shiftKey && key === ENTER) {
    capturedEvent.preventDefault();
    return callback(capturedEvent);
  }

  return false;
};

const PubNubCommentInput = ({
  client,
  channel,
  callback,
  disabled,
  disabledInputPlaceholder,
}: Props) => {
  const commentBoxRef = useRef<HTMLInputElement>(null);
  const [
    commentBoxInputRef,
    setCommentBoxInputRef,
  ] = useState<HTMLElement | null>(null);

  // const { handleSubmit } = useMessageInputContext();

  const onSubmit = useCallback(
    (
      { message }: FormValues,
      { resetForm, setFieldError }: FormikBag<object, FormValues>,
    ) =>
      client
        .publish({
          channel,
          message: {
            text: message,
            type: MessageType.Text,
          },
        })
        .then(() => {
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
    [client, channel, commentBoxInputRef, callback],
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
                disabledInputPlaceholder || MSG.commentInputPlaceholder
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
                      <FormattedMessage {...MSG.sendCombo} />
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

PubNubCommentInput.displayName = displayName;

export default PubNubCommentInput;
