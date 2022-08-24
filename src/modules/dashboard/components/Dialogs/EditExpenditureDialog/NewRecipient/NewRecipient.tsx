import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import { FormSection } from '~core/Fields';
import UserAvatar from '~core/UserAvatar';
import UserMention from '~core/UserMention';

import styles from './NewRecipient.css';
import { Recipient } from '~dashboard/ExpenditurePage/Payments/types';

export const MSG = defineMessages({
  newRecipient: {
    id: 'dashboard.EditExpenditureDialog.NewRecipient.newRecipient',
    defaultMessage: 'New recipient',
  },
});

const displayName = 'dashboard.EditExpenditureDialog.NewRecipient';

interface Props {
  newValue: Recipient['recipient'];
}

const NewRecipient = ({ newValue }: Props) => {
  return (
    <FormSection appearance={{ border: 'bottom' }}>
      <div className={classNames(styles.row, styles.smallerPadding)}>
        <span className={styles.label}>
          <FormattedMessage {...MSG.newRecipient} />
        </span>
        <div className={styles.valueContainer}>
          <div className={styles.userAvatarContainer}>
            <UserAvatar
              address={newValue?.profile.walletAddress || ''}
              size="xs"
              notSet={false}
            />
            <UserMention
              username={
                newValue?.profile.username ||
                newValue?.profile.displayName ||
                ''
              }
            />
          </div>
        </div>
      </div>
    </FormSection>
  );
};

NewRecipient.displayName = displayName;

export default NewRecipient;
