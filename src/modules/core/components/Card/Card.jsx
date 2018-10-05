/* @flow */
import type { Node } from 'react';

import React from 'react';

import styles from './Card.css';

type Props = {
  children: Node,
  className?: string,
};

const Card = ({ children, className, ...props }: Props) => {
  const mainClass = styles.main;
  const classNames = className ? `${mainClass} ${className}` : mainClass;
  return (
    <li className={classNames} {...props}>
      {children}
    </li>
  );
};

export default Card;
