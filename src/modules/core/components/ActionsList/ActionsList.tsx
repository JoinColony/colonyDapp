import React from 'react';

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
  /*
   * @NOTE This is a list, since this is the only way I could get a dynmic
   * width text ellipsis to work reliably
   */
  <ul className={styles.main}>
    {items.map((item) => (
      <ActionsListItem key={item.id} item={item} />
    ))}
  </ul>
);

ActionsList.displayName = displayName;

export default ActionsList;
