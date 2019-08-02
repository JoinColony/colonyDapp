/* @flow */

import React from 'react';

import { getMainClasses } from '~utils/css';

import styles from './NetworkHealthIcon.css';

type Appearance = {|
  /** Size of the main network health icon that's being wrapped in the popover. */
  size?: 'tiny' | 'small' | 'normal' | 'medium' | 'large' | 'huge',
|};

type Props = {|
  health: 'good' | 'mean' | 'critical',
  appearance?: Appearance,
|};

const displayName = 'NetworkHealth.NetworkHealthIcon';

const NetworkHealthIcon = ({
  health,
  appearance: { size } = { size: 'normal' },
}: Props) => <span className={getMainClasses({ health, size }, styles)} />;

NetworkHealthIcon.displayName = displayName;

export default NetworkHealthIcon;
