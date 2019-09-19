import React from 'react';
import { FormattedMessage } from 'react-intl';

import { MessageType } from '~immutable/index';
import Heading from '~core/Heading';
import Card from '~core/Card';
import MessageCardStatus from './MessageCardStatus';
import styles from './MessageCard.css';

const displayName = 'users.GasStation.MessageCard';

interface Props {
  message: MessageType;
  idx: number;
  onClick?: (idx: number) => void;
}

const MessageCard = ({ message: { status, purpose }, onClick, idx }: Props) => (
  <Card className={styles.main}>
    <button
      type="button"
      className={styles.button}
      onClick={() => onClick && onClick(idx)}
      disabled={!onClick}
    >
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
    </button>
  </Card>
);

MessageCard.displayName = displayName;

export default MessageCard;
