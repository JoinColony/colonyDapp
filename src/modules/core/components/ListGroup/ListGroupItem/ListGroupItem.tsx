import React, { ReactNode, FC } from 'react';

import { getMainClasses } from '~utils/css';

import styles from './ListGroupItem.css';

interface Props {
  children: ReactNode;
}

const displayName = 'ListGroup.ListGroupItem';

const ListGroupItem: FC<Props> = ({ children, ...rest }: Props) => (
  <li className={getMainClasses({}, styles)} {...rest}>
    {children}
  </li>
);

ListGroupItem.displayName = displayName;

export default ListGroupItem;
