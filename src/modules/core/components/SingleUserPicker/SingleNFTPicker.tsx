import React, { ComponentProps, useMemo } from 'react';

import { NFT } from '~dashboard/Dialogs/GnosisControlSafeDialog';

import SingleUserPicker from './SingleUserPicker';

/* SingleNFTPicker is a wrapper around SingleUserPicker component */
interface Props extends ComponentProps<typeof SingleUserPicker> {
  data: NFT[];
}

const displayName = 'SingleUserPicker.SingleNFTPicker';

const SingleNFTPicker = ({ data, ...props }: Props) => {
  const formattedData = useMemo(
    () =>
      data.map((item) => ({
        id: item.address,
        profile: {
          displayName: `${item.name} #${item.safeID}`,
          walletAddress: item.address,
        },
      })),
    [data],
  );

  return (
    <SingleUserPicker
      {...props}
      data={formattedData}
      placholderIconName="nft-icon"
    />
  );
};

SingleNFTPicker.displayName = displayName;

export default SingleNFTPicker;
