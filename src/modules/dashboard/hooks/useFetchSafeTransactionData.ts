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
          const {
            data: { annotationMsg },
          } = JSON.parse(safeTransactionData);
          if (annotationMsg) {
            const parsedAnnotation = JSON.parse(annotationMsg);
            setSafeTransactionTitle(parsedAnnotation.title);
          }
        }
      }
    };

    fetchSafeTxData();
  }, [metadata]);

  return safeTransactionsTitle;
};
