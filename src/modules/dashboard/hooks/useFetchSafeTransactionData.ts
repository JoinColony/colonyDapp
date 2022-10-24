import { useEffect, useState } from 'react';

import { SafeTransaction } from '~data/index';
import { getColonyMetadataIPFS } from '~utils/events';

export const useFetchSafeTransactionTitle = (metadata?: string) => {
  const [safeTransactionsTitle, setSafeTransactionTitle] = useState<
    SafeTransaction[]
  >();

  useEffect(() => {
    const fetchSafeTxData = async () => {
      if (metadata) {
        const safeTransactionData = await getColonyMetadataIPFS(metadata);
        if (safeTransactionData) {
          const { annotationMessage } = JSON.parse(safeTransactionData);
          setSafeTransactionTitle(annotationMessage?.title);
        }
      }
    };

    fetchSafeTxData();
  }, [metadata]);

  return safeTransactionsTitle;
};
