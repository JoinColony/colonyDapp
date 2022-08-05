import { nanoid } from 'nanoid';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import { FormSection } from '~core/Fields';
import UserAvatar from '~core/UserAvatar';
import UserMention from '~core/UserMention';

import styles from './NewRecipient.css';

export const MSG = defineMessages({
  newRecipient: {
    id: 'dashboard.EditExpenditureDialog.newRecipient',
    defaultMessage: 'New recipient',
  },
});

const displayName = 'dashboard.EditExpenditureDialog.NewRecipient';

interface Props {
  newValue: any;
}

const NewRecipient = ({ newValue }: Props) => {
  return (
    <FormSection appearance={{ border: 'bottom' }} key={nanoid()}>
      <div className={classNames(styles.row, styles.smallerPadding)}>
        <span className={styles.label}>
          <FormattedMessage {...MSG.newRecipient} />
        </span>
        <div className={styles.valueContainer}>
          <div className={styles.userAvatarContainer}>
            <UserAvatar
              address={newValue.profile.walletAddress}
              size="xs"
              notSet={false}
            />
            <UserMention
              username={
                newValue.profile.username || newValue.profile.displayName || ''
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
