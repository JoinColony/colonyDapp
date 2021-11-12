import React, { useState, useMemo } from 'react';

import { TransactionMeta } from '~dashboard/ActionsPage';
import UserMention from '~core/UserMention';
import HookedUserAvatar from '~users/HookedUserAvatar';
import Icon from '~core/Icon';

import { getMainClasses } from '~utils/css';
import TextDecorator from '~lib/TextDecorator';
import { AnyUser, useLoggedInUser } from '~data/index';
import FriendlyName from '~core/FriendlyName';
import CommentActions from './CommentActions';

import styles from './Comment.css';

const displayName = 'Comment';

export interface Appearance {
  theme?: 'primary' | 'danger';
}

export interface Props {
  appearance?: Appearance;
  comment?: string;
  user?: AnyUser | null;
  annotation?: boolean;
  createdAt?: Date | number;
}

const UserAvatar = HookedUserAvatar({ fetchUser: false });

const Comment = ({
  appearance = { theme: 'primary' },
  comment,
  user,
  createdAt,
  annotation = false,
}: Props) => {

  const [hoverState, setHoverState] = useState<boolean>(false);
  const { username } = useLoggedInUser();

  const { Decorate } = new TextDecorator({
    username: (usernameWithAtSign) => (
      <UserMention username={usernameWithAtSign.slice(1)} />
    ),
  });

  return (
    <div
      className={getMainClasses(appearance, styles, { annotation })}
      onMouseEnter={() => setHoverState(true)}
      onMouseLeave={() => setHoverState(false)}
    >
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
      <div className={styles.actions}>
        {username && user && (          
          <CommentActions
            user={user}
            comment={comment}
            hoverState={hoverState}
          />
        )}
      </div>
    </div>
  );
};

Comment.displayName = displayName;

export default Comment;
