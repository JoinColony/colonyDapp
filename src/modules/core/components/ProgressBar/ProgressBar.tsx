import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { getMainClasses } from '~utils/css';

import styles from './ProgressBar.css';

interface Appearance {
  theme?: 'default' | 'dark' | 'transparent';
  size?: 'small' | 'normal';
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
  appearance = { theme: 'default', size: 'normal' },
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
