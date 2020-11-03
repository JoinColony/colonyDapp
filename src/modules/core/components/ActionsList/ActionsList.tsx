import React from 'react';

import { Table, TableBody } from '~core/Table';
import ActionsListItem from './ActionsListItem';

import styles from './ActionsList.css';

const displayName = 'ActionsList';

interface Props {
  /*
   * @TODO This should be an array of Events, Actions or Logs types
   */
  items: any[];
}

const ActionsList = ({ items }: Props) => (
  <div className={styles.main}>
    <Table appearance={{ separators: 'none' }} className={styles.table}>
      <TableBody>
        {items.map((item) => (
          <ActionsListItem key={item.id} item={item} />
        ))}
      </TableBody>
    </Table>
  </div>
);

ActionsList.displayName = displayName;

export default ActionsList;
