import { FormikProps } from 'formik';
import React from 'react';
import * as yup from 'yup';

import { MessageType } from '~immutable/index';
import Button from '~core/Button';
import { ActionForm } from '~core/Fields';
import MetaMaskWalletInteraction from '../MetaMaskWalletInteraction';
import { ActionTypes } from '~redux/index';
import styles from './MessageCardControls.css';

interface Props {
  message: MessageType;
}

interface FormValues {
  id: string;
}

const displayName = 'users.GasStation.MessageCardControls';

const validationSchema = yup.object().shape({
  id: yup.string(),
});

const MessageCardControls = ({ message: { id } }: Props) => (
  <div className={styles.main}>
    <ActionForm
      submit={ActionTypes.MESSAGE_SIGN}
      success={ActionTypes.MESSAGE_SIGNED}
      error={ActionTypes.MESSAGE_ERROR}
      validationSchema={validationSchema}
      initialValues={{ id }}
    >
      {({ isSubmitting }: FormikProps<FormValues>) => (
        <Button
          text={{ id: 'button.confirm' }}
          type="submit"
          loading={isSubmitting}
        />
      )}
    </ActionForm>
    <div className={styles.alert}>
      <MetaMaskWalletInteraction />
    </div>
  </div>
);

MessageCardControls.displayName = displayName;

export default MessageCardControls;
