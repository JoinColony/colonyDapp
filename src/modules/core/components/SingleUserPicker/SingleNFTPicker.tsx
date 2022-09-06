import React, { ComponentProps, useMemo } from 'react';
import { NftData } from '~data/index';

import SingleUserPicker from './SingleUserPicker';

/* SingleNFTPicker is a wrapper around SingleUserPicker component */
interface Props extends ComponentProps<typeof SingleUserPicker> {
  data: NftData[];
}

const displayName = 'SingleUserPicker.SingleNFTPicker';

const SingleNFTPicker = ({ data, ...props }: Props) => {
  const formattedData = useMemo(
    () =>
      data.map((item) => ({
        id: `${item.address} ${item.id}`,
        profile: {
          displayName: `${item.name || item.tokenName} #${item.id}`,
          walletAddress: item.address,
        },
      })),
    [data],
  );

  return (
    <SingleUserPicker
      {...props}
      data={formattedData}
      placeholderIconName="nft-icon"
    />
  );
};

SingleNFTPicker.displayName = displayName;

export default SingleNFTPicker;
