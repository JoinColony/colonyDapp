import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import UserAvatar from '~core/UserAvatar';
import UserMention from '~core/UserMention';
import { Recipient } from '~dashboard/ExpenditurePage/Payments/types';

import styles from './NewRecipient.css';

export const MSG = defineMessages({
  newRecipient: {
    id: 'dashboard.EditExpenditureDialog.NewRecipient.newRecipient',
    defaultMessage: 'New recipient',
  },
  none: {
    id: 'dashboard.EditExpenditureDialog.NewRecipient.none',
    defaultMessage: 'None',
  },
});

const displayName = 'dashboard.EditExpenditureDialog.NewRecipient';

interface Props {
  newValue?: Recipient['recipient'];
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
