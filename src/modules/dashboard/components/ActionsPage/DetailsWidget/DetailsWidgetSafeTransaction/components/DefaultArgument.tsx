import React from 'react';

import styles from '../DetailsWidgetSafeTransaction.css';

interface DefaultArgumentProps {
  argument: string;
}

export const DefaultArgument = ({ argument }: DefaultArgumentProps) => (
  <span title={argument} className={styles.functionArg}>
    {argument}
  </span>
);
