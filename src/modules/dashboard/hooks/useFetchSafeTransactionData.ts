import { useEffect, useState } from 'react';

import { SafeTransaction } from '~data/index';
import { getSafeTransactionFromAnnotation } from '~utils/events';

export const useFetchSafeTransactionTitle = (metadata?: string) => {
  const [safeTransactionsTitle, setSafeTransactionTitle] = useState<
    SafeTransaction[]
  >();

  useEffect(() => {
    const fetchSafeTxData = async () => {
      if (metadata) {
        const safeTransactionData = await getSafeTransactionFromAnnotation(
          metadata,
        );
        if (safeTransactionData) {
          const parsedAnnotation = JSON.parse(safeTransactionData);
          if (parsedAnnotation) {
            setSafeTransactionTitle(parsedAnnotation.title);
          }
        }
      }
    };

    fetchSafeTxData();
  }, [metadata]);

  return safeTransactionsTitle;
};
