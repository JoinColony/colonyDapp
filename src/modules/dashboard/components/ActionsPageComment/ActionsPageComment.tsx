import React, { useCallback } from 'react';
// import * as yup from 'yup';
import { FormikProps, FormikBag } from 'formik';

import {
  useSendTransactionMessageMutation,
  TransactionMessagesDocument,
  TransactionQueryVariables,
} from '~data/index';
import { Form, Input } from '~core/Fields';
import Button from '~core/Button';

import styles from './ActionsPageComment.css';

const displayName = 'dashboard.ActionsPageComment';

type FormValues = {
  message: string;
};

interface Props {
  transactionHash?: string;
  /*
   * @TODO Add Address Type
   */
  colonyAddress?: string;
}

// const validationSchema = yup.object().shape({
//   comment: yup.string().trim().min(1).required(),
// });

const ActionsPageComment = ({
  transactionHash = '',
  colonyAddress = '',
}: Props) => {
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

  return (
    <div className={styles.main}>
      <Form
        initialValues={{ message: '' }}
        // validationSchema={validationSchema}
        onSubmit={onSubmit}
        // validateOnMount
      >
        {({ isSubmitting, isValid }: FormikProps<FormValues>) => (
          <>
            <Input
              elementOnly
              label="Transaction Message"
              // label={isMac ? MSG.placeholderMac : MSG.placeholderWinNix}
              name="message"
              /*
               * @NOTE We need two message descriptors here, and can't just use
               * selectors, since the placeholder prop doesn't support passing over
               * message descriptors values
               */
              // placeholder={isMac ? MSG.placeholderMac : MSG.placeholderWinNix}
              // appearance={{ colorSchema: 'transparent' }}
              // minRows={3}
              // maxRows={8}
              // onKeyDown={(event) => handleKeyboardSubmit(event, handleSubmit)}
              // disabled={!username || isSubmitting}
            />
            {/* <div className={styles.commentControls}> */}
            <Button
              loading={isSubmitting}
              disabled={!isValid}
              text={{ id: 'button.submit' }}
              type="submit"
              // style={{ width: styles.wideButton }}
            />
          </>
        )}
      </Form>
    </div>
  );
};

ActionsPageComment.displayName = displayName;

export default ActionsPageComment;
