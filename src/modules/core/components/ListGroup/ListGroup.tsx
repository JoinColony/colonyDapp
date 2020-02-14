import React, { ReactNode, HTMLAttributes } from 'react';

import { getMainClasses } from '~utils/css';

import styles from './ListGroup.css';

interface Props extends HTMLAttributes<HTMLUListElement> {
  children: ReactNode;
}

const displayName = 'ListGroup';

const ListGroup = ({ children, ...rest }: Props) => (
  <ul className={getMainClasses({}, styles)} {...rest}>
    {children}
  </ul>
);

ListGroup.displayName = displayName;

export default ListGroup;
