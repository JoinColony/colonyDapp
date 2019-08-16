import React from 'react';

import styles from './DotsLoader.css';

const DotsLoader = () => (
  <div className={styles.dotLoader}>
    <div className={[styles.dotLoaderDot, styles.dot1].join(' ')} />
    <div className={[styles.dotLoaderDot, styles.dot2].join(' ')} />
    <div className={[styles.dotLoaderDot, styles.dot3].join(' ')} />
  </div>
);

export default DotsLoader;
