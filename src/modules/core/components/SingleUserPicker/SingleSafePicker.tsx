import React, { ComponentProps, useMemo } from 'react';

import { GNOSIS_SAFE_NETWORKS } from '~constants';
import { ColonySafe } from '~data/index';

import SingleUserPicker from './SingleUserPicker';

/* SingleSafePicker is a wrapper around SingleUserPicker component */
interface Props extends ComponentProps<typeof SingleUserPicker> {
  data: ColonySafe[];
}

const displayName = 'SingleUserPicker.SingleSafePicker';

const SingleSafePicker = ({ data, ...props }: Props) => {
  const formattedData = useMemo(
    () =>
      data.map((item) => {
        const safeNetwork = GNOSIS_SAFE_NETWORKS.find(
          (network) => network.chainId === Number(item.chainId),
        );
        return {
          id: item.contractAddress,
          profile: {
            displayName: `${item.safeName} (${safeNetwork?.name})`,
            walletAddress: item.contractAddress,
          },
        };
      }),
    [data],
  );

  return (
    <SingleUserPicker
      {...props}
      data={formattedData}
      placeholderIconName="gnosis-logo"
    />
  );
};

SingleSafePicker.displayName = displayName;

export default SingleSafePicker;
