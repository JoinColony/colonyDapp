import React from 'react';

import { nanoid } from 'nanoid';
import ActionsListItem from './ActionsListItem';
import { Address } from '~types/index';

import styles from './ActionsList.css';

const displayName = 'ActionsList';

export interface ClickHandlerProps {
  id: string;
  userAddress: Address;
  topic?: string;
  domainId?: number;
}

interface Props {
  /*
   * @TODO This should be an array of Events, Actions or Logs types
   */
  items: any[];
  handleItemClick?: (handlerProps: ClickHandlerProps) => void;
}

const ActionsList = ({ items, handleItemClick }: Props) => {
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
        />
      ))}
    </ul>
  );
};

ActionsList.displayName = displayName;

export default ActionsList;
