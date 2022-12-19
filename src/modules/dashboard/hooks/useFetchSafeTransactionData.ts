import { useEffect, useState } from 'react';

import { TransactionReceipt } from 'ethers/providers';
import { getSafeTransactionFromAnnotation } from '~utils/events';
import {
  getTransactionStatuses,
  TRANSACTION_STATUS,
} from '~utils/safes/getTransactionStatuses';
import { getProvider } from '~modules/core/sagas/utils';
import { ExtendedActions } from '~utils/colonyActions';
import {
  ColonyAndExtensionsEvents,
  ColonyExtendedActions,
} from '~types/colonyActions';
import { useEventsForMotionLazyQuery } from '~data/generated';

export const useFetchSafeTransactionData = (
  transactionHash: string,
  metadata: string | undefined,
  actionType: ExtendedActions,
  colonyAddress: string,
  motionId: string | undefined,
) => {
  const [safeTransactionData, setSafeTransactionData] = useState<{
    transactionTitle: string;
    safeTransactionStatus: TRANSACTION_STATUS | null;
  }>({
    transactionTitle: '',
    safeTransactionStatus: null,
  });
  const [
    transactionReceipt,
    setTransactionReceipt,
  ] = useState<TransactionReceipt | null>(null);
  const [fetchEvents, { data: motionEventsData }] = useEventsForMotionLazyQuery(
    {
      fetchPolicy: 'network-only',
    },
  );

  useEffect(() => {
    if (motionId) {
      fetchEvents({ variables: { colonyAddress, motionId: Number(motionId) } });
    }
  }, [colonyAddress, motionId, fetchEvents]);

  useEffect(() => {
    const fetchTransactionReceipt = async () => {
      const provider = getProvider();
      if (motionId) {
        const motionFinalizedEvent = motionEventsData?.eventsForMotion.find(
          (event) => event.name === ColonyAndExtensionsEvents.MotionFinalized,
        );

        if (motionFinalizedEvent) {
          setTransactionReceipt(
            await provider.getTransactionReceipt(
              motionFinalizedEvent?.transactionHash,
            ),
          );
        }
      } else {
        setTransactionReceipt(
          await provider.getTransactionReceipt(transactionHash),
        );
      }
    };

    if (actionType.includes(ColonyExtendedActions.SafeTransactionInitiated)) {
      fetchTransactionReceipt();
    }
  }, [actionType, motionEventsData, motionId, transactionHash]);

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

    if (actionType.includes(ColonyExtendedActions.SafeTransactionInitiated)) {
      fetchSafeTxData();
    }
  }, [transactionHash, metadata, actionType, transactionReceipt]);

  return safeTransactionData;
};
