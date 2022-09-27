import { useState } from 'react';
import { useField } from 'formik';

const displayName = 'dashboard.ExpenditurePage.Payments.useErrorRecipientField';

const useErrorRecipientField = (
  index: number,
  tokens?: { amount?: string; tokenAddress?: string; id: string }[],
) => {
  const [, { error: userError }] = useField(`recipients[${index}].recipient`);
  const [hasErrorFields, setHasErrorFields] = useState(false);

  tokens?.map((token, idx) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [, { error: amountError }] = useField(
      `recipients[${index}].value[${idx}].amount`,
    );

    if (hasErrorFields) return;

    if (amountError || userError) {
      setHasErrorFields(true);
    }
  });

  return hasErrorFields;
};

useErrorRecipientField.displayName = displayName;

export default useErrorRecipientField;
