import React from 'react';

import HookedUserAvatar from '~users/HookedUserAvatar';
import { getMainClasses } from '~utils/css';

import styles from './ActionsListItem.css';

const displayName = 'ActionsList.ActionsListItem';

const UserAvatar = HookedUserAvatar();

/*
 * @NOTE This would be better served as an enum
 *
 * But b/c statuses are passes in as number id, and since enum can't handle numeric names
 * we have to rely on an plain Object here
 *
 * The only way I can see this working with an enum is to have some other form of
 * identification for statuses
 */
const STATUS = {
  1: 'red',
  2: 'blue',
  3: 'yellow',
};

interface Props {
  /*
   * @TODO This should be a type of Events, Actions or Logs
   */
  item: any;
  handleOnClick?: () => void;
}

const ActionsListItem = ({ item: { userAddress, statusId }, item }: Props) => {
  return (
    <li
      className={getMainClasses({}, styles, { [STATUS[statusId]]: !!statusId })}
    >
      <div className={styles.avatar}>
        {userAddress && (
          <UserAvatar size="s" address={userAddress} notSet={false} />
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.title} title={item.title}>
          {item.title}
        </div>
        <div className={styles.meta}>
          <span className={styles.date}>{item.date}</span>
          <span className={styles.domain}>{item.domain.name}</span>
          <span className={styles.commentCount}>{item.commentCount}</span>
        </div>
      </div>
    </li>
  );
};

ActionsListItem.displayName = displayName;

export default ActionsListItem;
