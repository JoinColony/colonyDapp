import React, { ComponentProps, useMemo } from 'react';

import { GnosisSafe } from '~dashboard/Dialogs/GnosisControlSafeDialog';

import SingleUserPicker from './SingleUserPicker';

interface Props extends ComponentProps<typeof SingleUserPicker> {
  data: GnosisSafe[];
}

const displayName = 'SingleUserPicker.SingleSafePicker';

const SingleSafePicker = ({ data, ...props }: Props) => {
  const formattedData = useMemo(
    () =>
      data.map((item) => ({
        profile: {
          displayName: `${item.name} (${item.chain})`,
          walletAddress: item.address,
        },
      })),
    [data],
  );

  return <SingleUserPicker {...props} data={formattedData} />;
};

SingleSafePicker.displayName = displayName;

export default SingleSafePicker;
