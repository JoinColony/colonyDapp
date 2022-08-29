import React, { useState } from 'react';
import { ColonyRole, ROOT_DOMAIN_ID } from '@colony/colony-js';
import parse from 'html-react-parser';

import { getMainClasses } from '~utils/css';
import { useTransformer } from '~utils/hooks';
import { COMMENT_MODERATION } from '~immutable/index';

import { TransactionMeta } from '~dashboard/ActionsPage';
import UserMention from '~core/UserMention';
import FriendlyName from '~core/FriendlyName';
import Tag from '~core/Tag';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { AnyUser, Colony, useLoggedInUser } from '~data/index';
import TextDecorator from '~lib/TextDecorator';
import { userHasRole } from '~modules/users/checks';
import { getUserRolesForDomain } from '~modules/transformers';

import CommentActions from './Actions';

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
  colony: Colony;
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
  colony,
  user,
  createdAt,
  annotation = false,
  showControls = false,
  disableHover = false,
}: Props) => {
  const { walletAddress } = useLoggedInUser();
  const rootRoles = useTransformer(getUserRolesForDomain, [
    colony,
    walletAddress,
    ROOT_DOMAIN_ID,
  ]);

  // Check for permissions for comment actions
  let permission = COMMENT_MODERATION.NONE;

  // Check for permissions to edit own comment
  // if (user?.profile.walletAddress === walletAddress) {
  //   permission = COMMENT_MODERATION.CAN_EDIT;
  // }

  // Check for permissions to moderate
  if (
    userHasRole(rootRoles, ColonyRole.Root) ||
    userHasRole(rootRoles, ColonyRole.Administration)
  ) {
    permission = COMMENT_MODERATION.CAN_MODERATE;
  }

  const [hoverState, setHoverState] = useState<boolean>(false);

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
          colony={colony}
          size="xs"
          address={user?.profile.walletAddress || ''}
          user={user as AnyUser}
          showInfo
          notSet={false}
          popperOptions={{
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
        <div className={styles.text} data-test="comment">
          <Decorate>{comment ? parse(comment) : comment}</Decorate>
        </div>
      </div>
      <div className={styles.actions}>
        {showControls && permission !== COMMENT_MODERATION.NONE && user && (
          <CommentActions
            permission={permission}
            fullComment={{
              appearance,
              comment,
              commentMeta,
              colony,
              user,
              createdAt,
              annotation,
              showControls,
            }}
            onHoverActiveState={setHoverState}
          />
        )}
      </div>
    </div>
  );
};

Comment.displayName = displayName;

export default Comment;
