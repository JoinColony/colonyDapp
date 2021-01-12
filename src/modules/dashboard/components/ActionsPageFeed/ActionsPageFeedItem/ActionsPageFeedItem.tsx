import React, { useCallback } from 'react';

import { TransactionMeta } from '~dashboard/ActionsPage';
import UserMention from '~core/UserMention';
import HookedUserAvatar from '~users/HookedUserAvatar';

import { getMainClasses } from '~utils/css';
import TextDecorator from '~lib/TextDecorator';
import { AnyUser } from '~data/index';
import FriendlyName from '~core/FriendlyName';
import { useDataFetcher } from '~utils/hooks';
import { ipfsDataFetcher } from '../../../../core/fetchers';

import styles from './ActionsPageFeedItem.css';

const displayName = 'dashboard.ActionsPageFeed.ActionsPageFeedItem';

interface Props {
  comment?: string;
  user?: AnyUser | null;
  annotation?: boolean;
  createdAt?: Date | number;
}

const UserAvatar = HookedUserAvatar({ fetchUser: false });

const ActionsPageFeedItem = ({
  comment,
  user,
  createdAt,
  annotation = false,
}: Props) => {
  const { Decorate } = new TextDecorator({
    username: (usernameWithAtSign) => (
      <UserMention username={usernameWithAtSign.slice(1)} />
    ),
  });

  const { data: annotationJSON } = useDataFetcher(
    ipfsDataFetcher,
    [annotation ? (comment as string) : ''], // Technically a bug, shouldn't need type override
    [annotation ? comment : ''],
  );

  const getAnnotationMessage = useCallback(() => {
    if (!annotationJSON) {
      return undefined;
    }
    const annotationObject = JSON.parse(annotationJSON);
    if (annotationObject && annotationObject.annotationMessage) {
      return annotationObject.annotationMessage;
    }
    return undefined;
  }, [annotationJSON]);

  const annotationMessage = getAnnotationMessage();

  /*
   * This means that the annotation object is in a format we don't recognize
   */
  if (annotation && !annotationMessage) {
    return null;
  }

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
          <Decorate>{annotation ? annotationMessage : comment}</Decorate>
        </div>
      </div>
    </div>
  );
};

ActionsPageFeedItem.displayName = displayName;

export default ActionsPageFeedItem;
