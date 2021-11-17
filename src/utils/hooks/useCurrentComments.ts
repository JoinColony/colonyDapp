import { useState } from 'react';
import {
  useCommentsSubscription,
  TransactionMessageFragment,
} from '~data/index';

export const useCurrentComments = (transactionHash: string) => {
  const [currentComments, setCurrentComments] = useState<
    TransactionMessageFragment[]
  >([]);

  const { loading, error } = useCommentsSubscription({
    variables: { transactionHash },
    onSubscriptionData: ({ subscriptionData }) => {
      const transactionMessages = subscriptionData.data?.transactionMessages;

      if (transactionMessages) {
        if (transactionMessages.transactionHash === transactionHash) {
          setCurrentComments(transactionMessages.messages);
        }
      }
    },
  });

  return {
    currentComments,
    loading,
    error,
  };
};
