import React from 'react';
import { defineMessages } from 'react-intl';

import { FormSection, InputLabel } from '~core/Fields';
import UserAvatar from '~core/UserAvatar';
import UserMention from '~core/UserMention';
import { useLoggedInUser } from '~data/index';

import styles from './LockedStreaming.css';

export const MSG = defineMessages({
  type: {
    id: 'dashboard.ExpenditurePage.LockedStreaming.type',
    defaultMessage: 'Expenditure type',
  },
  owner: {
    id: 'dashboard.ExpenditurePage.LockedStreaming.owner',
    defaultMessage: 'Owner',
  },
  starts: {
    id: 'dashboard.ExpenditurePage.LockedStreaming.starts',
    defaultMessage: 'Starts',
  },
  ends: {
    id: 'dashboard.ExpenditurePage.LockedStreaming.ends',
    defaultMessage: 'Ends',
  },
});

const displayName = 'dashboard.ExpenditurePage.LockedStreaming';

const LockedStreaming = () => {
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
          <span className={styles.expenditure}>Streaming</span>
        </div>
      </FormSection>
      <FormSection appearance={{ border: 'bottom' }}>
        <div className={styles.userContainer}>
          <InputLabel
            label={MSG.owner}
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
          {/* Mock - insert proper value */}
          <span className={styles.value}>
            {new Date().toLocaleDateString()}
          </span>
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
          {/* Mock - insert proper value */}
          <span className={styles.value}>When cancelled</span>
        </div>
      </FormSection>
    </div>
  );
};

LockedStreaming.displayName = displayName;

export default LockedStreaming;
