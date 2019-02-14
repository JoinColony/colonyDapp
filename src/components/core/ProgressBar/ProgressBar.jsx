/* @flow */

import React from 'react';

import styles from './ProgressBar.css';

type Props = {|
  value?: number,
  max?: number,
|};

/* Trying to use an actual ProgressBar here to be semantic and accessible */
const ProgressBar = ({ value = 0, max = 100 }: Props) => (
  <progress className={styles.main} value={value || null} max={max} />
);

export default ProgressBar;
