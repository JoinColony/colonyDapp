import React from 'react';
import { useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import Heading from '~core/Heading';

import styles from './ActionsPage.css';

const MSG = defineMessages({
  genericAction: {
    id: 'dashboard.ActionsPage.genericAction',
    /*
     * @TODO The action title needs to be decorated with the user mention
     */
    defaultMessage: 'Generic Action',
  },
});

const displayName = 'dashboard.ActionsPage';

const ActionsPage = () => {
  const { transactionHash } = useParams<{
    transactionHash?: string;
  }>();
  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <Heading
          text={MSG.genericAction}
          appearance={{
            size: 'medium',
            weight: 'medium',
            theme: 'dark',
          }}
        />
        {transactionHash}
      </div>
      <div className={styles.details}>
        {/*
         * @TODO Add in DEV-45
         */}
        Details component goes here
      </div>
    </div>
  );
};

ActionsPage.displayName = displayName;

export default ActionsPage;
