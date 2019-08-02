/* @flow */

import React from 'react';

import { getMainClasses } from '~utils/css';

import type { NetworkHealth, NetworkHealthIconSize } from '../types';

import styles from './NetworkHealthIcon.css';

type Appearance = {|
  /** Size of the main network health icon that's being wrapped in the popover. */
  size?: NetworkHealthIconSize,
|};

type Props = {|
  health: NetworkHealth,
  appearance?: Appearance,
|};

const displayName = 'NetworkHealth.NetworkHealthIcon';

const NetworkHealthIcon = ({
  health,
  appearance: { size } = { size: 'normal' },
}: Props) => <span className={getMainClasses({ health, size }, styles)} />;

NetworkHealthIcon.displayName = displayName;

export default NetworkHealthIcon;
