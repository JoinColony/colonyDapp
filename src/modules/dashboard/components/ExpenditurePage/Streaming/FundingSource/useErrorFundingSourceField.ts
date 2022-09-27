import { useField } from 'formik';
import { useState } from 'react';

import { FundingSource as FundingSourceType } from '../types';

const displayName =
  'dashboard.ExpenditurePage.Streaming.useErrorFundingSourceField';

const useErrorFundingSourceField = (
  fundingSource: FundingSourceType,
  index: number,
) => {
  const [hasErrorFields, setHasErrorFields] = useState(false);

  fundingSource.rate?.map((rateItem, rateIndex) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [, { error: amountError }] = useField(
      `streaming.fundingSources[${index}].rate[${rateIndex}].amount`,
    );

    if (hasErrorFields) return;

    if (amountError) {
      setHasErrorFields(true);
    }
  });

  return hasErrorFields;
};

useErrorFundingSourceField.displayName = displayName;

export default useErrorFundingSourceField;
