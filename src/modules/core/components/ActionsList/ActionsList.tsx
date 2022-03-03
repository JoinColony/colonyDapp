import React, { ComponentType } from 'react';

import { Colony } from '~data/index';

import ActionsListItem from './ActionsListItem';

import styles from './ActionsList.css';

const displayName = 'ActionsList';

export interface ClickHandlerProps {
  id: string;
  transactionHash: string;
}

interface Props {
  items;
  colony: Colony;
  handleItemClick?: (handlerProps: ClickHandlerProps) => void;
  /*
   * @NOTE we type the item prop as any in order to give it the liberty
   * of receiving any type of values.
   *
   * Otherwise we would just be locked into either actions or events, but not both
   */
  itemComponent?: ComponentType<{
    key: string;
    handleOnClick?: (handlerProps: ClickHandlerProps) => void;
    colony: Colony;
    item: any;
  }>;
}

const ActionsList = ({
  items,
  handleItemClick,
  colony,
  itemComponent: Item = ActionsListItem,
}: Props) => (
  <ul className={styles.main}>
    {items.map((item) => (
      <Item
        key={item.id}
        item={item}
        handleOnClick={handleItemClick}
        colony={colony}
      />
    ))}
  </ul>
);

ActionsList.displayName = displayName;

export default ActionsList;
