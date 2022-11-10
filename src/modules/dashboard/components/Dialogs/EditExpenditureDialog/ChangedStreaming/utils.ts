import {
  FundingSource,
  Streaming,
} from '~dashboard/ExpenditurePage/Streaming/types';
import { ExpenditureEndDateTypes } from '~pages/ExpenditurePage/types';

import { checkIfRateIsChanged } from './ChangedRate/utils';

interface Params {
  newValue: Partial<FundingSource>;
  oldValue?: FundingSource;
  endDate: ExpenditureEndDateTypes;
}

export const fundingSourceWasChanged = ({
  newValue,
  oldValue,
  endDate,
}: Params) => {
  if (!oldValue) {
    return true; // funding shource has been added
  }

  if ('removed' in newValue) {
    return true; // removed funding source
  }

  if (newValue.team && newValue.team !== oldValue.team) {
    return true; // changed team property
  }

  if (endDate === ExpenditureEndDateTypes.LimitIsReached) {
    return true; // if limit is required, we want to show every change
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

interface RemovedRatesParams {
  newFundingSource: Partial<FundingSource & { removed?: boolean }>;
  oldFundingSource?: FundingSource;
}

export const findRemovedRates = ({
  newFundingSource,
  oldFundingSource,
}: RemovedRatesParams) => {
  if (newFundingSource.removed) {
    return undefined;
  }
  if (!newFundingSource.rates) {
    return undefined;
  }
  return oldFundingSource?.rates.filter(
    (oldItem) =>
      !newFundingSource?.rates?.find((rate) => rate.id === oldItem.id),
  );
};
