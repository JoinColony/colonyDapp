import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { FormSection, InputLabel } from '~core/Fields';
import UserAvatar from '~core/UserAvatar';
import UserMention from '~core/UserMention';
import { useLoggedInUser } from '~data/index';

import styles from './LockedStreaming.css';

export const MSG = defineMessages({
  type: {
    id: 'dashboard.ExpenditurePage.Streaming.LockedStreaming.type',
    defaultMessage: 'Expenditure type',
  },
  streaming: {
    id: 'dashboard.ExpenditurePage.Streaming.LockedStreaming.streaming',
    defaultMessage: 'Streaming',
  },
  to: {
    id: 'dashboard.ExpenditurePage.Streaming.LockedStreaming.to',
    defaultMessage: 'To',
  },
  starts: {
    id: 'dashboard.ExpenditurePage.Streaming.LockedStreaming.starts',
    defaultMessage: 'Starts',
  },
  ends: {
    id: 'dashboard.ExpenditurePage.Streaming.LockedStreaming.ends',
    defaultMessage: 'Ends',
  },
});

interface Props {
  startDate: string;
  endDate: string;
}

const displayName = 'dashboard.ExpenditurePage.Streaming.LockedStreaming';

const LockedStreaming = ({ startDate, endDate }: Props) => {
  const { username, walletAddress } = useLoggedInUser();

  return (
    <div className={styles.container}>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.settingsRow}>
          <InputLabel
            label={MSG.type}
            appearance={{
              direction: 'horizontal',
            }}
          />
          <span className={styles.expenditure}>
            <FormattedMessage {...MSG.streaming} />
          </span>
        </div>
      </FormSection>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.userContainer}>
          <InputLabel
            label={MSG.to}
            appearance={{
              direction: 'horizontal',
            }}
          />
          <div className={styles.userAvatarContainer}>
            <UserAvatar address={walletAddress} size="xs" notSet={false} />
            <div className={styles.userName}>
              <UserMention username={username || ''} />
            </div>
          </div>
        </div>
      </FormSection>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.settingsRow}>
          <InputLabel
            label={MSG.starts}
            appearance={{
              direction: 'horizontal',
            }}
          />
          <span className={styles.value}>{startDate}</span>
        </div>
      </FormSection>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.settingsRow}>
          <InputLabel
            label={MSG.ends}
            appearance={{
              direction: 'horizontal',
            }}
          />
          <span className={styles.value}>{endDate}</span>
        </div>
      </FormSection>
    </div>
  );
};

LockedStreaming.displayName = displayName;

export default LockedStreaming;
