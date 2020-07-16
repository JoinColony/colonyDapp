import React, { useCallback, useState } from 'react';
import { defineMessages } from 'react-intl';

import Card from '~core/Card';
import Chat from '~core/Chat';
import Button from '~core/Button';

import styles from './CoinMachineChat.css';

const displayName = 'dashboard.CoinMachine.CoinMachineChat';

const MSG = defineMessages({
  hideComments: {
    id: 'dashboard.CoinMachine.CoinMachineChat.hideComments',
    defaultMessage:
      '{commentsHidden, select, true {Show} false {Hide}} comments',
  },
});

const CoinMachineChat = () => {
  const [commentsHidden, setCommentsHidden] = useState<boolean>(false);

  const toggleComments = useCallback(
    () => setCommentsHidden((hidden) => !hidden),
    [],
  );

  return (
    <div className={styles.main}>
      <span className={styles.toggleCommentsButton}>
        <Button
          appearance={{ theme: 'blue' }}
          onClick={toggleComments}
          text={MSG.hideComments}
          textValues={{ commentsHidden }}
        />
      </span>
      {!commentsHidden && (
        <Card className={styles.card}>
          <Chat room="temp" />
        </Card>
      )}
    </div>
  );
};

CoinMachineChat.displayName = displayName;

export default CoinMachineChat;
