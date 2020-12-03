import React, { useMemo } from 'react';

import { SpinnerLoader } from '~core/Preloaders';

import { useTransactionMessagesQuery, ParsedEvent } from '~data/index';
import { getActionsPageFeedItems } from '../../../transformers';
import { ActionsPageFeedItem as ActionsPageFeedItemType } from '~types/index';

import ActionsPageFeedItem from './ActionsPageFeedItem';
import ActionsPageEvent from './ActionsPageEvent';

import styles from './ActionsPageFeed.css';

const displayName = 'dashboard.ActionsPageFeed';

interface Props {
  transactionHash: string;
  networkEvents?: ParsedEvent[];
}

const ActionsPageFeed = ({ transactionHash, networkEvents }: Props) => {
  const { data, loading, error } = useTransactionMessagesQuery({
    variables: { transactionHash },
  });

  const feedItems = useMemo(
    () =>
      getActionsPageFeedItems(
        networkEvents,
        data?.transactionMessages.messages,
      ),
    [networkEvents, data],
  );

  if (error) {
    return null;
  }

  if (loading || !data?.transactionMessages) {
    <div className={styles.main}>
      <SpinnerLoader />
      <span>Loading Transaction Messages</span>
    </div>;
  }

  const getFeedComponent = ({
    type,
    id,
    name,
    message,
    from,
    createdAt,
  }: ActionsPageFeedItemType) => {
    switch (type) {
      case 'message': {
        return (
          <li key={id}>
            <ActionsPageFeedItem
              createdAt={createdAt}
              comment={message}
              walletAddress={from}
            />
          </li>
        );
      }
      case 'event': {
        return (
          <li key={id}>
            <ActionsPageEvent
              createdAt={createdAt}
              transactionHash={transactionHash}
              eventName={name}
            />
          </li>
        );
      }
      default: {
        return null;
      }
    }
  };

  return <ul className={styles.main}>{feedItems.map(getFeedComponent)}</ul>;
};

ActionsPageFeed.displayName = displayName;

export default ActionsPageFeed;
