import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import styles from './ProgressBar.css';

const MSG = defineMessages({
  titleProgress: {
    id: 'ProgressBar.titleProgress',
    defaultMessage: '{value} / {max}',
  },
});

interface Props {
  value?: number;
  max?: number;
}

const displayName = 'ProgressBar';

/* Trying to use an actual ProgressBar here to be semantic and accessible */
const ProgressBar = ({ value = 0, max = 100 }: Props) => {
  const { formatMessage } = useIntl();
  const titleText = formatMessage(MSG.titleProgress, { value, max });
  return (
    <progress
      className={styles.main}
      value={value}
      max={max}
      title={titleText}
    />
  );
};

ProgressBar.displayName = displayName;

export default ProgressBar;
