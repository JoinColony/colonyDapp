import React, { ComponentProps, useMemo } from 'react';

import { GnosisSafe } from '~dashboard/Dialogs/GnosisControlSafeDialog';

import SingleUserPicker from './SingleUserPicker';

/* SingleSafePicker is a wrapper around SingleUserPicker component */
interface Props extends ComponentProps<typeof SingleUserPicker> {
  data: GnosisSafe[];
}

const displayName = 'SingleUserPicker.SingleSafePicker';

const SingleSafePicker = ({ data, ...props }: Props) => {
  const formattedData = useMemo(
    () =>
      data.map((item) => ({
        id: item.address,
        profile: {
          displayName: `${item.name} (${item.chain})`,
          walletAddress: item.address,
        },
      })),
    [data],
  );

  return (
    <SingleUserPicker
      {...props}
      data={formattedData}
      placholderIconName="gnosis-logo"
    />
  );
};

SingleSafePicker.displayName = displayName;

export default SingleSafePicker;
