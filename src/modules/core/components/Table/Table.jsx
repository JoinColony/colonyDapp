/* @flow */
import type { Node } from 'react';

import React from 'react';

import styles from './Table.css';

type Props = {
  striped?: boolean,
  children: Node,
};

const Table = ({ children, striped }: Props) => (
  <table className={`${styles.main} ${striped ? styles.striped : ''}`}>
    {children}
  </table>
);

export default Table;
