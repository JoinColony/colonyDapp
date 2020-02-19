import React, { ReactNode, HTMLAttributes } from 'react';

import { getMainClasses } from '~utils/css';

import styles from './ListGroup.css';

interface Appearance {
  gaps?: 'true';
}

interface Props extends HTMLAttributes<HTMLUListElement> {
  appearance?: Appearance;
  children: ReactNode;
}

const displayName = 'ListGroup';

const ListGroup = ({ appearance, children, ...rest }: Props) => (
  <ul className={getMainClasses(appearance, styles)} {...rest}>
    {children}
  </ul>
);

ListGroup.displayName = displayName;

export default ListGroup;
