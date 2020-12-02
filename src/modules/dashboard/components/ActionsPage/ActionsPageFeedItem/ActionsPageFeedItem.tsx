import React from 'react';
import TransactionMeta from '../TransactionMeta';
import { Address } from '~types/index';
import TextDecorator from '~lib/TextDecorator';
import UserMention from '~core/UserMention';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { getMainClasses } from '~utils/css';

import styles from './ActionsPageFeedItem.css';

const displayName = 'dashboard.ActionsPage.ActionsPageFeedItem';

interface Props {
  comment: string;
  username: string;
  walletAddress?: Address;
  annotation?: boolean;
  createdAt?: number;
}

const ActionsPageFeedItem = ({
  comment,
  username,
  walletAddress,
  createdAt,
  annotation = false,
}: Props) => {
  const { Decorate } = new TextDecorator({
    username: (usernameWithAtSign) => (
      <UserMention username={usernameWithAtSign.slice(1)} />
    ),
  });
  const UserAvatar = HookedUserAvatar({ fetchUser: false });
  return (
    <div className={getMainClasses({}, styles, { annotation })}>
      <div className={styles.avatar}>
        <UserAvatar size="xs" address={walletAddress || ''} />
      </div>
      <div className={styles.content}>
        <div className={styles.details}>
          <Decorate key={walletAddress}>{`@${username}`}</Decorate>
          {createdAt && <TransactionMeta createdAt={createdAt} />}
        </div>
        <div className={styles.text}>{comment}</div>
      </div>
    </div>
  );
};

ActionsPageFeedItem.displayName = displayName;

export default ActionsPageFeedItem;
