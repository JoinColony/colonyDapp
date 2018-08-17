/* @flow */
import type { Element } from 'react';

import React, { createElement } from 'react';

import styles from './Card.css';

type Props = {
  content: Object,
  idx: number,
  onCardClick: (idx: number) => void,
  childComponent: Element<any>,
};

const Card = ({ content, idx, onCardClick, childComponent }: Props) => (
  <div className={styles.main} onClick={() => onCardClick(idx)}>
    {childComponent ? (
      createElement(childComponent, {...content})
    ) : (
      <p>Content</p>
    )}
  </div>
);

export default Card;
