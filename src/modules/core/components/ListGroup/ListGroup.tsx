import React, { HTMLAttributes } from 'react';

import { getMainClasses } from '~utils/css';

import styles from './ListGroup.css';

export interface Appearance {
  /** Should there be gaps between each element in the list */
  gaps?: 'true';
  hoverColor?: 'dark';
}

interface Props extends HTMLAttributes<HTMLUListElement> {
  appearance?: Appearance;
}

const displayName = 'ListGroup';

const ListGroup = ({ appearance, children, ...rest }: Props) => (
  <ul className={getMainClasses(appearance, styles)} {...rest}>
    {children}
  </ul>
);

ListGroup.displayName = displayName;

export default ListGroup;
