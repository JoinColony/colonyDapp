/* @flow */
import type { Node } from 'react';
import { getMainClasses } from '~utils/css';

import React from 'react';

import styles from './Table.css';

type Appearance = {
  theme?: 'default' | 'dark',
  separators?: 'borders' | 'none' | 'rows',
};

type Props = {
  /** Appearance object */
  appearance?: Appearance,
  /** Child elements to render */
  children: Node,
};

const Table = ({
  appearance = { theme: 'default', separators: 'rows' },
  children,
}: Props) => (
  <table className={getMainClasses(appearance, styles)}>{children}</table>
);

export default Table;
