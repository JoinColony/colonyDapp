/* @flow */
import React from 'react';

import Card from '../Card';

import styles from './CardList.css';

type Props = {
  cardContentItems: Array<Object>,
  cardItemComponent: Node,
  onCardClick?: (idx: number) => void,
};

const CardList = ({
  cardContentItems,
  onCardClick,
  cardItemComponent,
}: Props) => (
  <div className={styles.main}>
    {cardContentItems.map((cardContentItem, idx) => (
      <div className={styles.cardItem} key={`card-list-item-${idx}`}>
        <Card
          content={cardContentItem}
          onCardClick={onCardClick}
          idx={idx}
          childComponent={cardItemComponent}
        />
      </div>
    ))}
  </div>
);

export default CardList;
