import { useEffect, useState } from 'react';

import { getSafeTransactionFromAnnotation } from '~utils/events';
import {
  getTransactionStatuses,
  TRANSACTION_STATUS,
} from '~utils/safes/getTransactionStatuses';
import { getProvider } from '~modules/core/sagas/utils';

export const useFetchSafeTransactionData = (
  transactionHash: string,
  metadata: string | undefined,
) => {
  const [safeTransactionData, setSafeTransactionData] = useState<{
    transactionTitle: string;
    safeTransactionStatus: TRANSACTION_STATUS | null;
  }>({
    transactionTitle: '',
    safeTransactionStatus: null,
  });

  useEffect(() => {
    const fetchSafeTxData = async () => {
      if (metadata) {
        // eslint-disable-next-line max-len
        const safeTransactionAnnotation = await getSafeTransactionFromAnnotation(
          metadata,
        );
        if (safeTransactionAnnotation) {
          const parsedAnnotation = JSON.parse(safeTransactionAnnotation);
          if (parsedAnnotation) {
            const provider = getProvider();
            const transactionReceipt = await provider.getTransactionReceipt(
              transactionHash,
            );
            const safeTransactionStatuses = await getTransactionStatuses(
              parsedAnnotation.safeData.chainId,
              transactionReceipt,
            );
            const safeTransactionStatus = safeTransactionStatuses.find(
              (status) => status === TRANSACTION_STATUS.PENDING,
            )
              ? TRANSACTION_STATUS.PENDING
              : TRANSACTION_STATUS.SUCCESS;
            setSafeTransactionData({
              transactionTitle: parsedAnnotation.title,
              safeTransactionStatus,
            });
          }
        }
      }
    };

    fetchSafeTxData();
  }, [transactionHash, metadata]);

  return safeTransactionData;
};
