/* @flow */
import type { Node } from 'react';
import type { MessageDescriptor } from 'react-intl';

import React from 'react';
import { defineMessages } from 'react-intl';

import { SpinnerLoader } from '~core/Preloaders';
import Button from '~core/Button';

import styles from './LoadingTemplate.css';

const MSG = defineMessages({
  helpLinkText: {
    id: 'LoadingTemplate.helpLinkText',
    defaultMessage: 'Help',
  },
});

type Props = {
  children?: Node,
  loadingText?: string | MessageDescriptor,
};

const LoadingTemplate = ({ children, loadingText }: Props) => (
  <div className={styles.main}>
    <header className={styles.header}>
      <Button to="/" text={MSG.helpLinkText} appearance={{ theme: 'blue' }} />
    </header>
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
