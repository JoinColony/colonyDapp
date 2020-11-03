import React from 'react';

import HookedUserAvatar from '~users/HookedUserAvatar';
import { getMainClasses } from '~utils/css';

import styles from './ActionsListItem.css';

const displayName = 'ActionsList.ActionsListItem';

const UserAvatar = HookedUserAvatar();

const STATUS = {
  1: 'red',
  2: 'blue',
  3: 'yellow',
};

interface Props {
  /*
   * @TODO This should be an array of Events, Actions or Logs types
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
          {item.date} | {item.domain.name} | {item.commentCount}
        </div>
      </div>
    </li>
  );
};

ActionsListItem.displayName = displayName;

export default ActionsListItem;
