import React from 'react';

import { Colony } from '~data/index';
import { FormattedAction } from '~types/index';

import ActionsListItem from './ActionsListItem';

import styles from './ActionsList.css';

const displayName = 'ActionsList';

export interface ClickHandlerProps {
  id: string;
  transactionHash: string;
}

interface Props {
  items: FormattedAction[];
  colony: Colony;
  handleItemClick?: (handlerProps: ClickHandlerProps) => void;
}

const ActionsList = ({ items, handleItemClick, colony }: Props) => (
  <ul className={styles.main}>
    {items.map((item) => (
      <ActionsListItem
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
