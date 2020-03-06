import React, { HTMLAttributes } from 'react';

import styles from './PanelSection.css';

const displayName = 'Panel.PanelSection';

const PanelSection = ({
  children,
  ...rest
}: Omit<HTMLAttributes<HTMLDivElement>, 'className'>) => (
  <div className={styles.main} {...rest}>
    {children}
  </div>
);

PanelSection.displayName = displayName;

export default PanelSection;
