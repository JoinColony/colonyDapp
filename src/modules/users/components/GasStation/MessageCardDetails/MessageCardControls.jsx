/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import type { InProps } from './MessageCardControls';

import Button from '~core/Button';
import Alert from '~core/Alert';

import styles from './MessageCardControls.css';

const displayName = 'users.GasStation.MessageCardDetails.MessageCardControls';

const MSG = defineMessages({
  walletPromptText: {
    id:
      // eslint-disable-next-line max-len
      'users.GasStation.MessageCardDetails.MessageCardControls.walletPromptText',
    defaultMessage: `Please finish the transaction on {walletType, select,
      metamask {Metamask}
      hardware {your hardware wallet}
    }`,
  },
});

type Props = {|
  walletNeedsAction?: 'metamask' | 'hardware',
|} & InProps;

const MessageCardControls = ({ walletNeedsAction }: Props) => (
  <div className={styles.main}>
    <Button text={{ id: 'button.confirm' }} type="submit" />
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

MessageCardControls.displayName = displayName;

export default MessageCardControls;
