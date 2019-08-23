import React, { ReactNode } from 'react';
import { MessageDescriptor } from 'react-intl';

import { SpinnerLoader } from '~core/Preloaders';

import styles from './LoadingTemplate.css';

interface Props {
  children?: ReactNode;
  loadingText?: string | MessageDescriptor;
}

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
