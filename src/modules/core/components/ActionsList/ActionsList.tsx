import React from 'react';

import ActionsListItem from './ActionsListItem';
import { Address } from '~types/index';
import { nanoid } from 'nanoid';

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

const ActionsList = ({ items, handleItemClick }: Props) => (
  <ul className={styles.main}>
    {items.map((item) => (
      <ActionsListItem
        key={item.id || nanoid()}
        item={item}
        handleOnClick={handleItemClick}
      />
    ))}
  </ul>
);

ActionsList.displayName = displayName;

export default ActionsList;
