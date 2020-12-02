import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { ParsedEvent } from '~data/index';
import TransactionMeta from '../TransactionMeta';
import styles from './ActionsPageEvent.css';
import UserPermissions from '~dashboard/UserPermissions';
import TextDecorator from '~lib/TextDecorator';
import UserMention from '~core/UserMention';

const displayName = 'dashboard.ActionsPage.ActionsPageEvent';

const MSG = defineMessages({
  eventTitle: {
    id: 'dashboard.ActionsPage.ActionsPageEvent.eventTitle',
    defaultMessage: `{from} paid {value} from {team} to {to}.`,
  },
});

interface Props {
  event: ParsedEvent;
  transactionHash?: string | null;
  createdAt?: number;
}

const ActionsPageEvent = ({ createdAt, transactionHash }: Props) => {
  // Mocked roles - Please make me smarter
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
          <FormattedMessage
            {...MSG.eventTitle}
            values={{
              from: <Decorate>@Harley</Decorate>,
              to: <Decorate>@Luke</Decorate>,
              value: '25,000 xDAI',
              team: 'Dev',
            }}
          />
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
