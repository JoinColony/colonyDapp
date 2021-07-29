import React, { ReactElement, HTMLAttributes } from 'react';

import styles from './TableHeader.css';

interface Props extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactElement | ReactElement[];
}

const displayName = 'TableHeader';

const TableHeader = ({ children, ...props }: Props) => (
  <thead className={styles.main} {...props}>
    {children}
  </thead>
);

TableHeader.displayName = displayName;

export default TableHeader;
