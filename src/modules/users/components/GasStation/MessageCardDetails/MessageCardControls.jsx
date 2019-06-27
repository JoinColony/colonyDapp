/* @flow */

import type { FormikProps } from 'formik';

import React from 'react';
import * as yup from 'yup';

import type { MessageProps } from '~immutable';

import Button from '~core/Button';
import { ActionForm } from '~core/Fields';
import WalletInteraction from '../WalletInteraction';
import { ACTIONS } from '~redux';
import { useSelector } from '~utils/hooks';

import { walletTypeSelector } from '../../../selectors';

import styles from './MessageCardControls.css';

type Props = {|
  message: MessageProps,
|};

type FormValues = {|
  id: string,
|};

const displayName = 'users.GasStation.MessageCardControls';

const validationSchema = yup.object().shape({
  id: yup.string(),
});

const MessageCardControls = ({ message: { id } }: Props) => {
  const walletType = useSelector(walletTypeSelector);
  return (
    <div className={styles.main}>
      <ActionForm
        submit={ACTIONS.MESSAGE_SIGN}
        success={ACTIONS.MESSAGE_SIGNED}
        error={ACTIONS.MESSAGE_ERROR}
        validationSchema={validationSchema}
        initialValues={{ id }}
        transform={(action: *) => ({
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
      {walletType !== 'software' && (
        <div className={styles.alert}>
          <WalletInteraction walletType={walletType} />
        </div>
      )}
    </div>
  );
};

MessageCardControls.displayName = displayName;

export default MessageCardControls;
