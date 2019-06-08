/* @flow */

import React from 'react';
import { FormattedMessage } from 'react-intl';

import type { MessageProps } from '~immutable';

import Heading from '~core/Heading';
import Card from '~core/Card';
import MessageCardStatus from './MessageCardStatus.jsx';

import styles from './MessageCard.css';

const displayName = 'users.GasStation.MessageCard';

type Props = {|
  message: $ReadOnly<MessageProps>,
|};

const MessageCard = ({ message: { status, purpose } }: Props) => (
  <Card className={styles.main}>
    <button type="button" className={styles.button}>
      <div className={styles.summary}>
        <div className={styles.description}>
          <Heading
            appearance={{ theme: 'dark', size: 'normal', margin: 'none' }}
            text={{ id: 'message.generic.title' }}
          />
          <FormattedMessage id={`message.${purpose}.description`} />
        </div>
        <MessageCardStatus status={status} />
      </div>
    </button>
  </Card>
);

MessageCard.displayName = displayName;

export default MessageCard;
