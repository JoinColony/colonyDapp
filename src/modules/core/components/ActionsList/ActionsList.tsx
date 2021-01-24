import React from 'react';

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
  messageDescriptorId?: string;
}

const ActionsList = ({
  items,
  handleItemClick,
  colony,
  messageDescriptorId = 'action.title',
}: Props) => (
  <ul className={styles.main}>
    {items.map((item) => (
      <ActionsListItem
        key={item.id}
        item={item}
        handleOnClick={handleItemClick}
        colony={colony}
        messageDescriptorId={messageDescriptorId}
      />
    ))}
  </ul>
);

ActionsList.displayName = displayName;

export default ActionsList;
