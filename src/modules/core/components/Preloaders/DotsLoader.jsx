/* @flow */

import React from 'react';

import { getMainClasses } from '~utils/css';

import styles from './DotsLoader.css';

type Appearance = {
  size: 'small' | 'medium' | 'large' | 'huge' | 'massive',
  theme?: 'primary',
};

type Props = {|
  /** Appearance object */
  appearance?: Appearance,
|};

const DotsLoader = ({ appearance = { size: 'small' } }: Props) => (
  <div className={getMainClasses(appearance, styles)}>
    <div className={styles.dotLoader}>
      <div className={[styles.dotLoaderDot, styles.dot1].join(' ')} />
      <div className={[styles.dotLoaderDot, styles.dot2].join(' ')} />
      <div className={[styles.dotLoaderDot, styles.dot3].join(' ')} />
    </div>
  </div>
);

export default DotsLoader;
