import React from 'react';

import { useWhitelistedUsersQuery } from '~data/index';

import UploadAddressesWidget from './UploadAddressesWidget';
import WhitelistAddresses from './WhitelistAddresses';

export interface Props {
  colonyAddress: string;
}

const Whitelist = ({ colonyAddress }: Props) => {
  const { data, loading } = useWhitelistedUsersQuery({
    variables: { colonyAddress },
  });
  return (
    <div>
      <UploadAddressesWidget />
      {data?.whitelistedUsers?.length && (
        <WhitelistAddresses
          colonyAddress={colonyAddress}
          users={data.whitelistedUsers}
        />
      )}
    </div>
  );
};

export default Whitelist;
