import React from 'react';

import { TableRow, TableCell } from '~core/Table';
import HookedUserAvatar from '~users/HookedUserAvatar';

import styles from './ActionsListItem.css';

const displayName = 'ActionsList.ActionsListItem';

const UserAvatar = HookedUserAvatar();

interface Props {
  /*
   * @TODO This should be an array of Events, Actions or Logs types
   */
  item: any;
  handleOnClick?: () => void;
}

const ActionsListItem = ({
  item: { userAddress },
  item,
  handleOnClick,
}: Props) => (
  <TableRow className={styles.main} onClick={handleOnClick}>
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

ActionsListItem.displayName = displayName;

export default ActionsListItem;
