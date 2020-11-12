import React from 'react';
import { useColonyTransfersQuery } from '~data/index';

import { Address } from '~types/index';
import { SpinnerLoader } from '~core/Preloaders';

const displayName = 'dashboard.UnclaimedTransfers';

interface Props {
  colonyAddress: Address;
}

const UnclaimedTransfers = ({ colonyAddress }: Props) => {

  const { data, error } = useColonyTransfersQuery({
    variables: { address: colonyAddress },
  });
  if (error) console.warn(error);

  console.log(data);

  return (
    <div>
      {data ? (
          <div>{data.colony.unclaimedTransfers.length}</div>
        ) : (
          <SpinnerLoader />
        )}
    </div>
  );
};

UnclaimedTransfers.displayName = displayName;

export default UnclaimedTransfers;
