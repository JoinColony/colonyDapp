import React from 'react';
import { nanoid } from 'nanoid';

import { Colony } from '~data/index';

import ActionsListItem from './ActionsListItem';

import styles from './ActionsList.css';

const displayName = 'ActionsList';

export interface ClickHandlerProps {
  id: string;
  transactionHash: string;
}

interface Props {
  /*
   * @TODO This should be an array of Events, Actions or Logs types
   */
  items: any[];
  colony: Colony;
  handleItemClick?: (handlerProps: ClickHandlerProps) => void;
}

const ActionsList = ({ items, handleItemClick, colony }: Props) => {
  const createKey = (value) => {
    return value + nanoid();
  };

  return (
    <ul className={styles.main}>
      {items.map((item) => (
        <ActionsListItem
          key={item.id || createKey(item.hash || item.name)}
          item={item}
          handleOnClick={handleItemClick}
          colony={colony}
        />
      ))}
    </ul>
  );
};

ActionsList.displayName = displayName;

export default ActionsList;
