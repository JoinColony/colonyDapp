import React, { useCallback } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import Button from '~core/Button';
import Dialog, { DialogProps, DialogSection } from '~core/Dialog';
import Heading from '~core/Heading';
import MaskedAddress from '~core/MaskedAddress';
import UserMention from '~core/UserMention';
import HookedUserAvatar from '~users/HookedUserAvatar';
import Comment, { Props as CommentProps } from '~core/Comment';
import {
  AnyUser,
  useBanUserTransactionMessagesMutation,
  useUnBanUserTransactionMessagesMutation,
  BannedUsersDocument,
} from '~data/index';

import styles from './CommentBanUserDialog.css';

const MSG = defineMessages({
  title: {
    id: 'CommentBanUserDialog.title',
    defaultMessage: `{unban, select,
      true {Unban}
      other {Ban}
    } user`,
  },
  description: {
    id: 'CommentBanUserDialog.description',
    defaultMessage: `Are you sure you want to {unban, select,
      true {unban this user and allow them to chat?}
      other {ban this user from chat?}
    }`,
  },
  note: {
    id: 'CommentBanUserDialog.note',
    /* eslint-disable max-len */
    defaultMessage: `Please note: {unban, select,
      true {this only allows this user chatting in this colony. They will still be able to interact with any smart contracts they have permission to use.}
      other {this only prevents this user from chatting in this colony. They will still be able to interact with any smart contracts they have permission to use.}
    }`,
    /* eslint-enable max-len */
  },
  commentLabel: {
    id: 'CommentBanUserDialog.commentLabel',
    defaultMessage: 'The comment',
  },
  cancelButtonText: {
    id: 'CommentBanUserDialog.cancelButtonText',
    defaultMessage: `{unban, select,
      true {Cancel}
      other {Let’s give one last chance...}
    }`,
  },
  confirmButtonText: {
    id: 'CommentBanUserDialog.confirmButtonText',
    defaultMessage: `{unban, select,
      true {Unban the user}
      other {Ban the troll}
    }`,
  },
});

const displayName = 'CommentBanUserDialog';

const UserAvatar = HookedUserAvatar({ fetchUser: false });

interface Props extends DialogProps {
  comment: CommentProps;
  unban?: boolean;
}

const CommentBanUserDialog = ({
  cancel,
  close,
  comment,
  comment: { user, colony },
  unban = false,
}: Props) => {
  const updateMutationHook = !unban
    ? useBanUserTransactionMessagesMutation
    : useUnBanUserTransactionMessagesMutation;
  const [updateTransactionMessage, { loading }] = updateMutationHook();

  const handleSubmit = useCallback(
    () =>
      (updateTransactionMessage({
        variables: {
          input: {
            colonyAddress: colony.colonyAddress,
            userAddress: (user as AnyUser).profile.walletAddress,
            ...(!unban ? { eventId: comment?.commentMeta?.id } : {}),
          },
        },
        refetchQueries: [
          {
            query: BannedUsersDocument,
            variables: { colonyAddress: colony.colonyAddress },
          },
        ],
      }) as Promise<boolean>).then(close),
    [close, colony, comment, unban, updateTransactionMessage, user],
  );

  return (
    <Dialog cancel={cancel}>
      <div className={styles.container}>
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.modalHeading}>
            <Heading
              appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
              text={MSG.title}
              textValues={{ unban }}
            />
          </div>
          <div className={styles.modalContent}>
            <FormattedMessage {...MSG.description} values={{ unban }} />
            <div className={styles.userInfoContainer}>
              <UserAvatar
                address={(user as AnyUser).profile.walletAddress}
                user={user as AnyUser}
                size="xs"
                notSet={false}
              />
              <div className={styles.userNameAndWallet}>
                {user?.profile?.username && (
                  <UserMention username={user.profile.username} />
                )}
                <MaskedAddress
                  address={(user as AnyUser).profile.walletAddress}
                />
              </div>
            </div>
            <p className={styles.note}>
              <FormattedMessage {...MSG.note} values={{ unban }} />
            </p>
          </div>
          {!unban && (
            <div className={styles.modalContent}>
              <Heading
                appearance={{ size: 'small', margin: 'none', theme: 'dark' }}
                text={MSG.commentLabel}
              />
              {comment && (
                <div className={styles.commentContainer}>
                  <Comment {...comment} />
                </div>
              )}
            </div>
          )}
        </DialogSection>
      </div>
      <DialogSection appearance={{ theme: 'footer' }}>
        <div className={styles.buttonContainer}>
          <div className={styles.cancelButtonContainer}>
            <Button
              appearance={{ theme: 'secondary' }}
              text={MSG.cancelButtonText}
              textValues={{ unban }}
              onClick={cancel}
            />
          </div>
          <div className={styles.confirmButtonContainer}>
            <Button
              appearance={{ theme: unban ? 'primary' : 'pink', size: 'large' }}
              text={MSG.confirmButtonText}
              textValues={{ unban }}
              loading={loading}
              onClick={handleSubmit}
            />
          </div>
        </div>
      </DialogSection>
    </Dialog>
  );
};

CommentBanUserDialog.displayName = displayName;

export default CommentBanUserDialog;
