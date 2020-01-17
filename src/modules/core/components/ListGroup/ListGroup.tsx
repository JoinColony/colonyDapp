import React, { ReactNode } from 'react';

import { getMainClasses } from '~utils/css';

import styles from './ListGroup.css';

interface Props {
  children: ReactNode;
}

const displayName = 'ListGroup';

const ListGroup = ({ children }: Props) => (
  <ul className={getMainClasses({}, styles)}>{children}</ul>
);

ListGroup.displayName = displayName;

export default ListGroup;
