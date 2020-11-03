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
    <Table
      data-test="dashboardTaskList"
      appearance={{ theme: 'rounder' }}
      scrollable
    >
      <TableBody>
        {items.map((item) => (
          <ActionsListItem key={item.key} item={item} />
        ))}
      </TableBody>
    </Table>
  </div>
);

ActionsList.displayName = displayName;

export default ActionsList;
