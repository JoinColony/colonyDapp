import React from 'react';
import { Address } from '~types/index';
import Dialog from '~core/Dialog';
import { useColonyQuery } from '~data/index';

interface Props {
  cancel: () => void;
  close: (params: object) => void;
  colonyAddress: Address;
}

const PaymentDialog = ({
  colonyAddress,
  cancel,
  close,
}: Props) => {

  const { data: colonyData } = useColonyQuery({
    variables: { address: colonyAddress },
  });

  return (
    <Dialog cancel={cancel}>Test</Dialog>
  );
};

PaymentDialog.displayName = 'dashboard.PaymentDialog';

export default PaymentDialog;
