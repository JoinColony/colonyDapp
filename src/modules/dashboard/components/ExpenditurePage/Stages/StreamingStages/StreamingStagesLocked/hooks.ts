import { useState } from 'react';
import { FundingSource } from '~dashboard/ExpenditurePage/Streaming/types';
import {
  availableToClaim as initialAvailableToClaim,
  paidToDate as initialPaidToDate,
} from './constants';

export const useClaimStreamingPayment = () => {
  // these values are mocks, they're set to state to mock claiming funds functionality
  const [availableToClaim, setAvailableToClaim] = useState<
    FundingSource['rate'][] | undefined
  >(initialAvailableToClaim);
  const [paidToDate, setPaidToDate] = useState<
    FundingSource['rate'][] | undefined
  >(initialPaidToDate);
  const [claimed, setClaimed] = useState(false);

  const claimFunds = () => {
    if (!availableToClaim) {
      return;
    }
    const newPaidToDate = [...(paidToDate || []), ...availableToClaim].reduce(
      (acc: FundingSource['rate'][], curr: FundingSource['rate']) => {
        const { amount, token } = curr || {};
        if (!amount || !token) {
          return acc;
        }
        const tokenInAcc = acc.find((accItem) => accItem.token === token);
        if (tokenInAcc) {
          return acc.map((accItem) => {
            if (accItem.token === token) {
              return { ...accItem, amount: Number(tokenInAcc.amount) + amount };
            }
            return accItem;
          });
        }
        return [...acc, curr];
      },
      [],
    );

    setPaidToDate(newPaidToDate);
    setAvailableToClaim((available) =>
      available?.map((availableItem) => ({ ...availableItem, amount: 0 })),
    );
    setClaimed(true);
  };

  return { availableToClaim, paidToDate, claimFunds, claimed };
};
