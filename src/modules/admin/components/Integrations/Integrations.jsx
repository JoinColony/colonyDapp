/* @flow */

// $FlowFixMe until hooks flow types
import React from 'react';
import { defineMessages } from 'react-intl';

import Heading from '~core/Heading';

import IntegrationList from './IntegrationList.jsx';

import styles from './Integrations.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.Integrations.title',
    defaultMessage: 'Integrations',
  },
});

const Integrations = () => {
  /* Fetch integrations available for that certain colony
   * if they differ per Colony?
   */
  const integrations = [{ name: 'Github', installed: false }];

  return (
    <div className={styles.main}>
      <main>
        <div className={styles.titleContainer}>
          <Heading
            text={MSG.title}
            appearance={{ size: 'medium', theme: 'dark' }}
          />
        </div>
        {integrations && (
          <IntegrationList
            integrations={integrations}
            appearance={{ numCols: '3' }}
          />
        )}
      </main>
    </div>
  );
};

Integrations.displayName = 'admin.Integrations';

export default Integrations;
