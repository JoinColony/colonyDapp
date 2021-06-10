import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { getMainClasses } from '~utils/css';

import styles from './ProgressBar.css';

interface Appearance {
  barTheme?: 'primary' | 'danger';
  backgroundTheme?: 'default' | 'dark' | 'transparent';
  size?: 'small' | 'normal';
  borderRadius?: 'default' | 'small';
}

const MSG = defineMessages({
  titleProgress: {
    id: 'ProgressBar.titleProgress',
    defaultMessage: '{value} / {max}',
  },
});

interface Props {
  appearance?: Appearance;
  value?: number;
  max?: number;
  threshold?: number;
}

const displayName = 'ProgressBar';

/* Trying to use an actual ProgressBar here to be semantic and accessible */
const ProgressBar = ({
  appearance = {
    barTheme: 'primary',
    backgroundTheme: 'default',
    size: 'normal',
    borderRadius: 'default',
  },
  value = 0,
  max = 100,
  threshold,
}: Props) => {
  const { formatMessage } = useIntl();
  const titleText = formatMessage(MSG.titleProgress, { value, max });
  return (
    <div className={`${styles.wrapper} ${getMainClasses(appearance, styles)}`}>
      {threshold && (
        <div
          style={{
            left: `calc(${threshold}% - 12px)`,
          }}
          className={styles.threshold}
        >
          <span className={styles.thresholdPercentage}>{threshold}%</span>
          <div className={styles.thresholdSeparator} />
        </div>
      )}
      <progress
        className={styles.main}
        value={value}
        max={max}
        title={titleText}
      />
    </div>
  );
};

ProgressBar.displayName = displayName;

export default ProgressBar;
