import React from 'react';

import { TableRow, TableCell } from '~core/Table';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { getMainClasses } from '~utils/css';

import styles from './ActionsListItem.css';

const displayName = 'ActionsList.ActionsListItem';

const UserAvatar = HookedUserAvatar();

const STATUS = {
  1: 'red',
  2: 'blue',
};

interface Props {
  /*
   * @TODO This should be an array of Events, Actions or Logs types
   */
  item: any;
  handleOnClick?: () => void;
}

const ActionsListItem = ({
  item: { userAddress, statusId },
  item,
  handleOnClick,
}: Props) => {
  return (
    <TableRow
      className={getMainClasses({}, styles, { [STATUS[statusId]]: !!statusId })}
      onClick={handleOnClick}
    >
      <TableCell className={styles.avatar}>
        {userAddress && (
          <UserAvatar size="s" address={userAddress} notSet={false} />
        )}
      </TableCell>
      <TableCell>{item.title}</TableCell>
      <TableCell>{item.eventTopic}</TableCell>
      <TableCell>{item.date}</TableCell>
      <TableCell>{item.domain.name}</TableCell>
      <TableCell>{item.commentCount}</TableCell>
    </TableRow>
  );
};

ActionsListItem.displayName = displayName;

export default ActionsListItem;
