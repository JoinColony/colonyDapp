/* @flow */
import type { Node } from 'react';
import type { MessageDescriptor } from 'react-intl';

import React from 'react';

import { SpinnerLoader } from '~core/Preloaders';

import styles from './LoadingTemplate.css';

type Props = {|
  children?: Node,
  loadingText?: string | MessageDescriptor,
|};

const LoadingTemplate = ({ children, loadingText }: Props) => (
  <div className={styles.main}>
    <main className={styles.mainContent}>
      <div>
        <div className={styles.loaderContainer}>
          <SpinnerLoader
            loadingText={loadingText}
            appearance={{ theme: 'primary', size: 'massive' }}
          />
        </div>
        {children}
      </div>
    </main>
  </div>
);

export default LoadingTemplate;
