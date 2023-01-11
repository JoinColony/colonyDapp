import React from 'react';

import { Tooltip } from '~core/Popover';

import styles from './ErrorDot.css';

const displayName = 'dashboard.ExpenditurePage.ErrorDot';

export interface Props {
  tooltipContent?: React.ReactNode;
}

const ErrorDot = ({ tooltipContent }: Props) => {
  return (
    <div className={styles.error}>
      <Tooltip content={tooltipContent}>
        <span className={styles.errorDot} />
      </Tooltip>
    </div>
  );
};

ErrorDot.displayName = displayName;

export default ErrorDot;
