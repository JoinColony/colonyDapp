import { FormikProps } from 'formik';
import React from 'react';
import * as yup from 'yup';

import { MessageType, WalletKind } from '~immutable/index';
import Button from '~core/Button';
import { ActionForm } from '~core/Fields';
import WalletInteraction from '../WalletInteraction';
import { ActionTypes } from '~redux/index';
import { useSelector } from '~utils/hooks';
import { walletKindSelector } from '../../../selectors';
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

const MessageCardControls = ({ message: { id } }: Props) => {
  const walletKind = useSelector(walletKindSelector);
  return (
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
      {walletKind !== WalletKind.Software && (
        <div className={styles.alert}>
          <WalletInteraction walletKind={walletKind} />
        </div>
      )}
    </div>
  );
};

MessageCardControls.displayName = displayName;

export default MessageCardControls;
