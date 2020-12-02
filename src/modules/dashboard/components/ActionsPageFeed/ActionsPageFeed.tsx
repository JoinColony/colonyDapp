import React from 'react';

import { SpinnerLoader } from '~core/Preloaders';
import { useTransactionMessagesQuery } from '~data/index';

import styles from './ActionsPageFeed.css';

const displayName = 'dashboard.ActionsPageFeed';

interface Props {
  transactionHash: string;
}

const ActionsPageFeed = ({ transactionHash }: Props) => {
  const { data, loading, error } = useTransactionMessagesQuery({
    variables: { transactionHash },
  });

  if (error) {
    return null;
  }

  if (loading || !data?.transactionMessages) {
    <div className={styles.main}>
      <SpinnerLoader />
      <span>Loading Transaction Messages</span>
    </div>;
  }

  if (data?.transactionMessages) {
    const {
      transactionMessages: { messages },
    } = data;

    return (
      <ul className={styles.main}>
        {!!messages?.length &&
          messages.map(({ sourceId, context: { message } }) => (
            <li key={sourceId}>{message}</li>
          ))}
      </ul>
    );
  }

  return null;
};

ActionsPageFeed.displayName = displayName;

export default ActionsPageFeed;
