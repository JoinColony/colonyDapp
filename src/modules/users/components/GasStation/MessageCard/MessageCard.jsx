/* @flow */

import React from 'react';
import { FormattedMessage } from 'react-intl';

import Heading from '~core/Heading';
import Card from '~core/Card';

import styles from './MessageCard.css';

const displayName = 'users.GasStation.MessageCard';

const MessageCard = () => (
  <Card className={styles.main}>
    <button type="button" className={styles.button}>
      <div className={styles.summary}>
        <div className={styles.description}>
          <Heading
            appearance={{ theme: 'dark', size: 'normal', margin: 'none' }}
            text={{ id: 'message.generic.title' }}
          />
          <FormattedMessage id="message.generic.description" />
        </div>
        {/*
         * @TODO Implement the message status UI
         */}
        <div className={styles.statusPlaceholder}>
          <span />
        </div>
      </div>
    </button>
  </Card>
);

MessageCard.displayName = displayName;

export default MessageCard;
