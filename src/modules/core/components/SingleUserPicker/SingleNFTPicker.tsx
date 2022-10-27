import React, { ComponentProps, useMemo } from 'react';

import Avatar from '~core/Avatar';
import { NFT } from '~dashboard/Dialogs/ControlSafeDialog/TransactionTypesSection/TransferNFTSection';
import {
  nftNameContainsTokenId,
  SelectedNFT,
} from '~modules/dashboard/sagas/utils/safeHelpers';
import { getSelectedNFTData } from '~utils/safes';

import SingleUserPicker from './SingleUserPicker';

/* SingleNFTPicker is a wrapper around SingleUserPicker component */
interface Props extends ComponentProps<typeof SingleUserPicker> {
  data: NFT[];
}

const displayName = 'SingleUserPicker.SingleNFTPicker';

const SingleNFTPicker = ({ data, ...props }: Props) => {
  const renderAvatar = (_, item: SelectedNFT) => {
    const selectedNFTData = getSelectedNFTData(item, data);
    return (
      <Avatar
        size="xs"
        placeholderIcon="nft-icon"
        title="NFT"
        avatarURL={selectedNFTData?.imageUri || undefined}
        notSet={!selectedNFTData?.imageUri}
      />
    );
  };

  const formattedData = useMemo(
    () =>
      data.map((item) => {
        const tokenName = item.name || item.tokenName;
        const nftDisplayName = nftNameContainsTokenId(tokenName)
          ? tokenName
          : `${tokenName} #${item.id}`;
        return {
          id: `${item.address} ${item.id}`,
          profile: {
            displayName: nftDisplayName,
            walletAddress: item.address,
          },
        };
      }),
    [data],
  );

  return (
    <SingleUserPicker
      {...props}
      data={formattedData}
      placeholderIconName="nft-icon"
      renderAvatar={renderAvatar}
    />
  );
};

SingleNFTPicker.displayName = displayName;

export default SingleNFTPicker;
