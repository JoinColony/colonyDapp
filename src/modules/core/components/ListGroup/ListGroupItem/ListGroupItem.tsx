import React, { Ref, HTMLAttributes } from 'react';

import { getMainClasses } from '~utils/css';

import styles from './ListGroupItem.css';

interface Appearance {
  padding: 'none' | 'medium';
}

interface Props extends HTMLAttributes<HTMLLIElement> {
  appearance?: Appearance;
  innerRef?: Ref<HTMLLIElement>;
}

const displayName = 'ListGroup.ListGroupItem';

const ListGroupItem = ({ appearance, children, innerRef, ...rest }: Props) => (
  <li className={getMainClasses(appearance, styles)} ref={innerRef} {...rest}>
    {children}
  </li>
);

ListGroupItem.displayName = displayName;

export default ListGroupItem;
