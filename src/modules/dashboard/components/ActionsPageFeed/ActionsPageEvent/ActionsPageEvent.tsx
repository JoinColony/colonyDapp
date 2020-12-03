import React from 'react';

import { TransactionMeta } from '~dashboard/ActionsPage';
import UserPermissions from '~dashboard/UserPermissions';
import UserMention from '~core/UserMention';

import TextDecorator from '~lib/TextDecorator';

import styles from './ActionsPageEvent.css';

const displayName = 'dashboard.ActionsPageFeed.ActionsPageEvent';

interface Props {
  eventName?: string;
  transactionHash: string;
  createdAt: Date;
}

const ActionsPageEvent = ({ createdAt, transactionHash, eventName }: Props) => {
  // @TODO Mocked roles - Please make me smarter
  const roles = [1, 2, 3];
  const directRoles = [1, 2, 3];

  const { Decorate } = new TextDecorator({
    username: (usernameWithAtSign) => (
      <UserMention username={usernameWithAtSign.slice(1)} />
    ),
  });

  return (
    <div className={styles.main}>
      <div className={styles.rectContainer}>
        <span className={styles.rect} />
      </div>
      <div className={styles.content}>
        <div className={styles.text}>
          {eventName && <Decorate>{eventName}</Decorate>}
        </div>
        <div className={styles.details}>
          <UserPermissions
            roles={roles}
            directRoles={directRoles}
            appearance={{ padding: 'none' }}
          />
          {transactionHash && (
            <TransactionMeta
              transactionHash={transactionHash}
              createdAt={createdAt}
            />
          )}
        </div>
      </div>
    </div>
  );
};

ActionsPageEvent.displayName = displayName;

export default ActionsPageEvent;
