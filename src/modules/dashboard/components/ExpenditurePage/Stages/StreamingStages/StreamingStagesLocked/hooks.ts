import { useState } from 'react';
import { Rate } from '~dashboard/ExpenditurePage/Streaming/types';

export const useClaimStreamingPayment = (
  initialAvailableToClaim?: Rate[],
  initialPaidToDate?: Rate[],
) => {
  // these values are mocks, they're set to state to mock claiming funds functionality
  const [availableToClaim, setAvailableToClaim] = useState<Rate[] | undefined>(
    initialAvailableToClaim,
  );
  const [paidToDate, setPaidToDate] = useState<Rate[] | undefined>(
    initialPaidToDate,
  );
  const [claimed, setClaimed] = useState(false);

  const claimFunds = () => {
    if (!availableToClaim) {
      return;
    }
    const newPaidToDate = [...(paidToDate || []), ...availableToClaim].reduce(
      (acc: Rate[], curr: Rate) => {
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
    // it's a mock, it just sets available amount to 0
    setAvailableToClaim((available) =>
      available?.map((availableItem) => ({ ...availableItem, amount: 0 })),
    );
    setClaimed(true);
  };

  return {
    availableToClaim,
    paidToDate,
    claimFunds,
    claimed,
    setAvailableToClaim,
  };
};
