import { Streaming } from '~dashboard/ExpenditurePage/Streaming/types';
import { ExpenditureEndDateTypes } from '~pages/ExpenditurePage/types';

import { checkIfRateIsChanged } from './ChangedRate/utils';

export const hasChanges = ({ newValue, oldValue, endDate }) => {
  if (!oldValue) {
    return true;
  }

  if ('removed' in newValue) {
    return true;
  }

  if (newValue.team && newValue.team !== oldValue.team) {
    return true;
  }

  if (endDate === ExpenditureEndDateTypes.LimitIsReached) {
    return true;
  }

  // check if rates array has been changed
  let changedRate = false;
  if (newValue.rates?.length !== oldValue.rates?.length) {
    return true;
  }

  newValue.rates?.forEach((rateItem) => {
    const changed = checkIfRateIsChanged(
      rateItem,
      oldValue.rates.find((item) => item.id === rateItem.id),
    );
    if (changed) {
      changedRate = true;
    }
  });

  return changedRate;
};

export const isStreamingPaymentType = (obj: any): obj is Streaming => {
  return Object.prototype.hasOwnProperty.call(obj, 'fundingSources');
};
