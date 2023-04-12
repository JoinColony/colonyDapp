import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import UserAvatar from '~core/UserAvatar';
import UserMention from '~core/UserMention';
import { AnyUser } from '~data/index';

import styles from './NewRecipient.css';

export const MSG = defineMessages({
  newRecipient: {
    id: 'dashboard.EditIncorporationDialog.NewRecipient.newRecipient',
    defaultMessage: 'New recipient',
  },
  none: {
    id: 'dashboard.EditIncorporationDialog.NewRecipient.none',
    defaultMessage: 'None',
  },
});

const displayName = 'dashboard.EditIncorporationDialog.NewRecipient';

interface Props {
  newValue?: AnyUser;
}

const NewRecipient = ({ newValue }: Props) => {
  if (!newValue) {
    return (
      <div className={styles.row}>
        <FormattedMessage {...MSG.none} />
      </div>
    );
  }
  return (
    <div className={styles.row}>
      <div className={styles.valueContainer}>
        <div className={styles.userAvatarContainer}>
          <UserAvatar
            address={newValue?.profile.walletAddress || ''}
            size="xs"
            notSet={false}
          />
          <UserMention
            username={
              newValue?.profile.displayName || newValue?.profile.username || ''
            }
          />
        </div>
      </div>
    </div>
  );
};

NewRecipient.displayName = displayName;

export default NewRecipient;
