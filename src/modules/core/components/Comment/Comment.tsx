import React from 'react';

import { TransactionMeta } from '~dashboard/ActionsPage';
import UserMention from '~core/UserMention';
import HookedUserAvatar from '~users/HookedUserAvatar';

import { getMainClasses } from '~utils/css';
import TextDecorator from '~lib/TextDecorator';
import { AnyUser } from '~data/index';
import FriendlyName from '~core/FriendlyName';

import styles from './Comment.css';

const displayName = 'Comment';

export interface Props {
  comment?: string;
  user?: AnyUser | null;
  annotation?: boolean;
  createdAt?: Date | number;
}

const UserAvatar = HookedUserAvatar({ fetchUser: false });

const Comment = ({ comment, user, createdAt, annotation = false }: Props) => {
  const { Decorate } = new TextDecorator({
    username: (usernameWithAtSign) => (
      <UserMention username={usernameWithAtSign.slice(1)} />
    ),
  });

  return (
    <div className={getMainClasses({}, styles, { annotation })}>
      <div className={styles.avatar}>
        <UserAvatar
          size="xs"
          address={user?.profile.walletAddress || ''}
          user={user as AnyUser}
          showInfo
          notSet={false}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.details}>
          <span className={styles.username}>
            <FriendlyName user={user as AnyUser} />
          </span>
          {createdAt && <TransactionMeta createdAt={createdAt} />}
        </div>
        <div className={styles.text}>
          <Decorate>{comment}</Decorate>
        </div>
      </div>
    </div>
  );
};

Comment.displayName = displayName;

export default Comment;
