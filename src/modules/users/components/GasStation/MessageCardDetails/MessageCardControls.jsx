/* @flow */

import type { FormikProps } from 'formik';

import React from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import type { MessageProps } from '~immutable';

import Button from '~core/Button';
import Alert from '~core/Alert';
import { ActionForm } from '~core/Fields';
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

const MSG = defineMessages({
  walletPromptText: {
    id: 'users.GasStation.MessageCardControls.walletPromptText',
    defaultMessage: `Please finish the transaction on {walletType, select,
      metamask {Metamask}
      hardware {your hardware wallet}
    }`,
  },
});

const validationSchema = yup.object().shape({
  id: yup.string(),
});

const MessageCardControls = ({ message: { id } }: Props) => {
  const walletType = useSelector(walletTypeSelector);
  const walletNeedsAction = walletType !== 'software' ? walletType : undefined;
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
      {walletNeedsAction && (
        <div className={styles.alert}>
          <Alert
            appearance={{ theme: 'info' }}
            text={MSG.walletPromptText}
            textValues={{
              walletType: walletNeedsAction,
            }}
          />
        </div>
      )}
    </div>
  );
};

MessageCardControls.displayName = displayName;

export default MessageCardControls;
