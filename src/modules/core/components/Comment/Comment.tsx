import React, { useState } from 'react';

import { getMainClasses } from '~utils/css';
import { COMMENT_MODERATION } from '~immutable/index';

import { TransactionMeta } from '~dashboard/ActionsPage';
import UserMention from '~core/UserMention';
import FriendlyName from '~core/FriendlyName';
import Tag from '~core/Tag';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { AnyUser, Colony } from '~data/index';
import TextDecorator from '~lib/TextDecorator';

import styles from './Comment.css';

const displayName = 'Comment';

export interface Appearance {
  theme?: 'primary' | 'danger' | 'ghost';
}

export interface CommentMeta {
  deleted?: null | boolean;
  adminDelete?: null | boolean;
  userBanned?: null | boolean;
  id: null | string;
}

export interface Props {
  appearance?: Appearance;
  comment?: string;
  commentMeta?: CommentMeta;
  colony?: Colony;
  user?: AnyUser | null;
  annotation?: boolean;
  createdAt?: Date | number;
  showControls?: boolean;
  disableHover?: boolean;
}

const UserAvatar = HookedUserAvatar({ fetchUser: false });

const Comment = ({
  appearance = { theme: 'primary' },
  comment,
  commentMeta,
  user,
  createdAt,
  annotation = false,
  showControls = false,
  disableHover = false,
}: Props) => {
  const permission = COMMENT_MODERATION.NONE;

  const [hoverState] = useState<boolean>(false);

  const { Decorate } = new TextDecorator({
    username: (usernameWithAtSign) => (
      <UserMention username={usernameWithAtSign.slice(1)} />
    ),
  });

  const { deleted = false, adminDelete = false, userBanned = false } =
    commentMeta || {};

  return (
    <div
      className={getMainClasses(appearance, styles, {
        annotation,
        ghosted:
          showControls &&
          permission !== COMMENT_MODERATION.NONE &&
          !!(deleted || adminDelete || userBanned),
        hideControls: !showControls || permission === COMMENT_MODERATION.NONE,
        activeActions: hoverState,
        disableHover,
      })}
    >
      <div className={styles.avatar}>
        <UserAvatar
          size="xs"
          address={user?.profile.walletAddress || ''}
          user={user as AnyUser}
          showInfo
          notSet={false}
          popperProps={{
            showArrow: false,
            placement: 'bottom',
          }}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.details}>
          <span className={styles.username}>
            <FriendlyName user={user as AnyUser} />
          </span>
          {createdAt && <TransactionMeta createdAt={createdAt} />}
          {userBanned &&
            showControls &&
            permission !== COMMENT_MODERATION.NONE && (
              <div className={styles.bannedTag}>
                <Tag
                  text={{ id: 'label.banned' }}
                  appearance={{ theme: 'banned' }}
                />
              </div>
            )}
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
