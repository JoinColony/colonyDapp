/* @flow */

import React from 'react';

import { getMainClasses } from '~utils/css';

import type { NetworkHealthIconSize } from '../types';

import styles from './NetworkHealthIcon.css';

type Appearance = {|
  /** Size of the main network health icon that's being wrapped in the popover. */
  size?: NetworkHealthIconSize,
|};

type Props = {|
  health: number,
  appearance?: Appearance,
|};

const displayName = 'NetworkHealth.NetworkHealthIcon';

const healthMap = {
  '3': 'good',
  '2': 'soso',
  '1': 'poor',
};

const NetworkHealthIcon = ({
  health,
  appearance: { size } = { size: 'normal' },
}: Props) => (
  <span
    className={getMainClasses({ health: healthMap[health], size }, styles)}
  />
);

NetworkHealthIcon.displayName = displayName;

export default NetworkHealthIcon;
