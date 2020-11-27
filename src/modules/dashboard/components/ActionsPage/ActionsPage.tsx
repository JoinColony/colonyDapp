import React from 'react';
import { useParams } from 'react-router-dom';

import styles from './ActionsPage.css';

const displayName = 'dashboard.ActionsPage';

const ActionsPage = () => {
  const { transactionHash } = useParams<{
    transactionHash?: string;
  }>();
  return <div className={styles.main}>{transactionHash}</div>;
};

ActionsPage.displayName = displayName;

export default ActionsPage;
