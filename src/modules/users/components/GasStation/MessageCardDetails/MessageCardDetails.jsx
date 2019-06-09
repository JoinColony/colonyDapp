/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { MessageProps } from '~immutable';

import CardList from '~core/CardList';
import Heading from '~core/Heading';
import Card from '~core/Card';
import { MessageCardStatus } from '../MessageCard';
import MessageCardControls from './MessageCardControls';
import { TransactionBackToList } from '../TransactionDetails';
import { getMainClasses } from '~utils/css';

import styles from './MessageCardDetails.css';

const displayName = 'users.GasStation.MessageCardDetails';

const MSG = defineMessages({
  returnToSummary: {
    id: 'users.GasStation.MessageCardDetails.returnToSummary',
    defaultMessage: 'See all pending actions',
  },
  messageHeading: {
    id: 'users.GasStation.MessageCardDetails.messageHeading',
    defaultMessage: 'Message:',
  },
});

type Props = {|
  message: $ReadOnly<MessageProps>,
  onClose: (event: SyntheticMouseEvent<HTMLButtonElement>) => void,
|};

const MessageCardDetails = ({
  message: { status, purpose, message: messageContent },
  message,
  onClose,
}: Props) => (
  <div>
    <TransactionBackToList onClose={onClose} />
    <CardList appearance={{ numCols: '1' }}>
      <Card className={styles.main}>
        <div className={styles.summary}>
          <div className={styles.description}>
            <Heading
              appearance={{ theme: 'dark', size: 'normal', margin: 'none' }}
              text={{ id: `message.${purpose}.title` }}
            />
            <FormattedMessage id={`message.${purpose}.description`} />
          </div>
          <MessageCardStatus status={status} />
        </div>
        <div
          className={getMainClasses({ theme: 'message' }, styles, {
            failed: status === 'failed',
            succeeded: status === 'succeeded',
          })}
        >
          <span className={styles.title}>
            <FormattedMessage {...MSG.messageHeading} />
          </span>
          {messageContent}
        </div>
      </Card>
    </CardList>
    {(status === 'created' || status === 'pending') && (
      <MessageCardControls message={message} />
    )}
  </div>
);

MessageCardDetails.displayName = displayName;

export default MessageCardDetails;
