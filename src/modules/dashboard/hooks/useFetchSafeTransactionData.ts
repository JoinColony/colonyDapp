import { useEffect, useState } from 'react';

import { SafeTransaction } from '~data/index';
import { getColonyMetadataIPFS } from '~utils/events';

export const useFetchSafeTransactionData = (metadata?: string) => {
  const [safeTransactions, setSafeTransactions] = useState<SafeTransaction[]>();

  useEffect(() => {
    const fetchSafeTxData = async () => {
      if (metadata) {
        const safeTransactionData = await getColonyMetadataIPFS(metadata);
        if (safeTransactionData) {
          const { annotationMessage } = JSON.parse(safeTransactionData);
          setSafeTransactions(annotationMessage?.transactions);
        }
      }
    };

    fetchSafeTxData();
  }, [metadata]);

  return safeTransactions;
};
