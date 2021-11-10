import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import Button from '~core/Button';
import Dialog, { DialogProps, DialogSection } from '~core/Dialog';
import Heading from '~core/Heading';
import MaskedAddress from '~core/MaskedAddress';
import UserMention from '~core/UserMention';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { TransactionMeta } from '~dashboard/ActionsPage';
import { AnyUser, TransactionMessageFragment } from '~data/index';

import styles from './BanUserDialog.css';

const MSG = defineMessages({
  title: {
    id: 'BanUserDialog.title',
    defaultMessage: 'Ban user',
  },
  description: {
    id: 'BanUserDialog.description',
    defaultMessage: `Are you sure you want to ban this user from chat?`,
  },
  note: {
    id: 'BanUserDialog.note',
    defaultMessage: `Please note: this only prevents this user from chatting in this colony. They will still be able to interact with any smart contracts they have permission to use.`,
  },
  commentLabel: {
    id: 'BanUserDialog.commentLabel',
    defaultMessage: 'The comment',
  },
  cancelButtonText: {
    id: 'BanUserDialog.cancelButtonText',
    defaultMessage: 'Let’s give one last chance...',
  },
  confirmButtonText: {
    id: 'BanUserDialog.confirmButtonText',
    defaultMessage: 'Ban the troll',
  },
});

const displayName = 'BanUserDialog';

const UserAvatar = HookedUserAvatar({ fetchUser: false });

interface Props extends DialogProps {
  user: AnyUser;
  colonyAddress: string;
  comment: TransactionMessageFragment;
}

const BanUserDialog = ({ cancel, user, comment }: Props) => (
  <Dialog cancel={cancel}>
    <div className={styles.container}>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.modalHeading}>
          <Heading
            appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
            text={MSG.title}
          />
        </div>
        <div className={styles.modalContent}>
          <FormattedMessage {...MSG.description} />
          <div className={styles.userInfoContainer}>
            <UserAvatar
              address={user.profile.walletAddress}
              user={user}
              size="xs"
              notSet={false}
            />
            <div className={styles.userNameAndWallet}>
              {user?.profile?.username && (
                <UserMention username={user.profile.username} />
              )}
              <MaskedAddress address={user.profile.walletAddress} />
            </div>
          </div>
          <p className={styles.note}>
            <FormattedMessage {...MSG.note} />
          </p>
        </div>
        <div className={styles.modalContent}>
          <Heading
            appearance={{ size: 'small', margin: 'none', theme: 'dark' }}
            text={MSG.commentLabel}
          />
          <div className={styles.commentContainer}>
            <TransactionMeta createdAt={new Date(comment.createdAt)} />
            <p>{comment.context.message}</p>
          </div>
        </div>
      </DialogSection>
    </div>
    <DialogSection appearance={{ theme: 'footer' }}>
      <div className={styles.buttonContainer}>
        <div className={styles.cancelButtonContainer}>
          <Button
            appearance={{ theme: 'secondary' }}
            text={MSG.cancelButtonText}
            onClick={cancel}
          />
        </div>
        <div className={styles.confirmButtonContainer}>
          <Button
            appearance={{ theme: 'danger', size: 'large' }}
            text={MSG.confirmButtonText}
          />
        </div>
      </div>
    </DialogSection>
  </Dialog>
);

BanUserDialog.displayName = displayName;

export default BanUserDialog;
