import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~core/Button';
import UserMention from '~core/UserMention';
import { AnyUser } from '~data/index';
import { useDialog } from '~core/Dialog';
import RemoveNominationDialog from '~dashboard/Dialogs/RemoveNominationDialog';

import styles from './VerificationBanner.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.DAOIncorporation.VerificationBanner.title',
    defaultMessage: '{user} Verify your identity',
  },
  description: {
    id: 'dashboard.DAOIncorporation.VerificationBanner.title',
    defaultMessage: `To be a Protector of the incorporated organisation, you need to verify your identity. You can also remove your nomination.`,
  },
  remove: {
    id: 'dashboard.DAOIncorporation.VerificationBanner.remove',
    defaultMessage: 'Remove',
  },
  verify: {
    id: 'dashboard.DAOIncorporation.VerificationBanner.verify',
    defaultMessage: 'Verify',
  },
});

const displayName = 'dashboard.DAOIncorporation.VerificationBanner';

export interface Props {
  user: AnyUser;
}

const VerificationBanner = ({ user }: Props) => {
  const openRemoveDialog = useDialog(RemoveNominationDialog);

  const handleRemove = useCallback(
    () =>
      openRemoveDialog({
        onClick: () => {
          // logic to remove nominated protector
        },
      }),
    [openRemoveDialog],
  );

  return (
    <div className={styles.wrapper}>
      <div>
        <div className={styles.title}>
          <FormattedMessage
            {...MSG.title}
            values={{
              user: (
                <UserMention
                  username={
                    user.profile.username || user.profile.displayName || ''
                  }
                />
              ),
            }}
          />
        </div>
        <div className={styles.description}>
          <FormattedMessage {...MSG.description} />
        </div>
      </div>
      <div className={styles.buttonsWrapper}>
        <Button
          text={MSG.remove}
          className={styles.removeButton}
          onClick={handleRemove}
        />
        <Button text={MSG.verify} className={styles.verifyButton} />
      </div>
    </div>
  );
};

VerificationBanner.displayName = displayName;

export default VerificationBanner;
