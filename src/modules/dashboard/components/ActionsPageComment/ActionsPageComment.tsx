import React, { useCallback } from 'react';
import * as yup from 'yup';
import { FormikProps, FormikBag } from 'formik';
import { defineMessages } from 'react-intl';

import { Form, Input } from '~core/Fields';
import Button from '~core/Button';

import {
  useSendTransactionMessageMutation,
  TransactionMessagesDocument,
  TransactionQueryVariables,
  useLoggedInUser,
} from '~data/index';
import { Address } from '~types/index';

import styles from './ActionsPageComment.css';

const displayName = 'dashboard.ActionsPageComment';

const MSG = defineMessages({
  commentInputPlaceholder: {
    id: 'dashboard.ActionsPageComment.commentInputPlaceholder',
    defaultMessage: 'What would you like to say?',
  },
});

const validationSchema = yup.object().shape({
  message: yup.string().trim().min(1).required(),
});

type FormValues = {
  message: string;
};

interface Props {
  transactionHash: string;
  colonyAddress: Address;
}

const ActionsPageComment = ({ transactionHash, colonyAddress }: Props) => {
  const { username, ethereal } = useLoggedInUser();

  const [sendTransactionMessage] = useSendTransactionMessageMutation();

  const onSubmit = useCallback(
    ({ message }: FormValues, { resetForm }: FormikBag<object, FormValues>) =>
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
            variables: { transactionHash } as TransactionQueryVariables,
          },
        ],
      }).then(() => resetForm()),
    [transactionHash, colonyAddress, sendTransactionMessage],
  );

  const canSendMessage = !!username && !ethereal;

  return (
    <div className={styles.main}>
      <Form
        initialValues={{ message: '' }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, isValid }: FormikProps<FormValues>) => (
          <>
            <Input
              elementOnly
              label={MSG.commentInputPlaceholder}
              name="message"
              placeholder={MSG.commentInputPlaceholder}
              disabled={!canSendMessage || isSubmitting}
            />
            <Button
              loading={isSubmitting}
              disabled={!canSendMessage || isSubmitting || !isValid}
              text={{ id: 'button.submit' }}
              type="submit"
            />
          </>
        )}
      </Form>
    </div>
  );
};

ActionsPageComment.displayName = displayName;

export default ActionsPageComment;
