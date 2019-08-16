import { FormikProps } from 'formik';
import React from 'react';
import * as yup from 'yup';

import { MessageProps, WALLET_CATEGORIES } from '~immutable/index';
import Button from '~core/Button';
import { ActionForm } from '~core/Fields';
import WalletInteraction from '../WalletInteraction';
import { ActionTypes } from '~redux/index';
import { useSelector } from '~utils/hooks';
import { walletTypeSelector } from '../../../selectors';
import styles from './MessageCardControls.css';

interface Props {
  message: MessageProps;
}

interface FormValues {
  id: string;
}

const displayName = 'users.GasStation.MessageCardControls';

const validationSchema = yup.object().shape({
  id: yup.string(),
});

const MessageCardControls = ({ message: { id } }: Props) => {
  const walletType = useSelector(walletTypeSelector);
  return (
    <div className={styles.main}>
      <ActionForm
        submit={ActionTypes.MESSAGE_SIGN}
        success={ActionTypes.MESSAGE_SIGNED}
        error={ActionTypes.MESSAGE_ERROR}
        validationSchema={validationSchema}
        initialValues={{ id }}
        transform={(action: any) => ({
          ...action,
          meta: { id },
        })}
      >
        {({ isSubmitting }: FormikProps<FormValues>) => (
          <Button
            text={{ id: 'button.confirm' }}
            type="submit"
            loading={isSubmitting}
          />
        )}
      </ActionForm>
      {walletType !== WALLET_CATEGORIES.SOFTWARE && (
        <div className={styles.alert}>
          <WalletInteraction walletType={walletType} />
        </div>
      )}
    </div>
  );
};

MessageCardControls.displayName = displayName;

export default MessageCardControls;
