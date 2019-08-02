/* @flow */

import React from 'react';

import NetworkHealthIcon from './NetworkHealthIcon';

import styles from './NetworkHealth.css';

type Appearance = {|
  /** Size of the main network health icon that's being wrapped in the popover. */
  size?: 'tiny' | 'small' | 'normal' | 'medium' | 'large' | 'huge',
|};

type Props = {|
  appearance?: Appearance,
  className?: string,
|};

const NetworkHealth = ({ appearance, className }: Props) => (
  <div className={className}>
    <button type="button" className={styles.main}>
      <NetworkHealthIcon health="mean" appearance={appearance} />
    </button>
  </div>
);

export default NetworkHealth;
