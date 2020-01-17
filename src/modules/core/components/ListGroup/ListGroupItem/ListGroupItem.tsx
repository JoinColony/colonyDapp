import React, { ReactNode, FC } from 'react';

import { getMainClasses } from '~utils/css';

import styles from './ListGroupItem.css';

interface Appearance {
  padding: 'none' | 'medium';
}

interface Props {
  appearance?: Appearance;
  children: ReactNode;
}

const displayName = 'ListGroup.ListGroupItem';

const ListGroupItem: FC<Props> = ({ appearance, children, ...rest }: Props) => (
  <li className={getMainClasses(appearance, styles)} {...rest}>
    {children}
  </li>
);

ListGroupItem.displayName = displayName;

export default ListGroupItem;
