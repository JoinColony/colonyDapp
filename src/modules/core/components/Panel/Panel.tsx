import React, { HTMLAttributes } from 'react';

import styles from './Panel.css';

const displayName = 'Panel';

const Panel = ({
  children,
  ...rest
}: Omit<HTMLAttributes<HTMLDivElement>, 'className'>) => (
  <div className={styles.main} {...rest}>
    {children}
  </div>
);

Panel.displayName = displayName;

export default Panel;
