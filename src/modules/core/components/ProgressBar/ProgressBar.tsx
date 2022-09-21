import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import classnames from 'classnames';

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
  hidePercentage?: boolean;
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
  hidePercentage = false,
}: Props) => {
  const { formatMessage } = useIntl();
  const titleText = formatMessage(MSG.titleProgress, { value, max });
  const visible = styles.thresholdVisibility;
  const belowThreshold = styles.barColorBelowThreshold;

  return (
    <div
      className={`${styles.wrapper} ${getMainClasses(
        appearance,
        styles,
      )} ${classnames({ [belowThreshold]: threshold && value < threshold })}`}
    >
      {!!threshold && (
        <div
          style={{
            left: `calc(${threshold}% - 14px)`,
          }}
          className={styles.threshold}
        >
          <span
            className={classnames(styles.thresholdPercentage, {
              [visible]: hidePercentage,
            })}
          >
            {threshold}%
          </span>
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
