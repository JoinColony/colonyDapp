import React from 'react';
import { defineMessage } from 'react-intl';

import { useWhitelistedUsersQuery } from '~data/index';
import { MiniSpinnerLoader } from '~core/Preloaders';

import UploadAddressesWidget from './UploadAddressesWidget';
import WhitelistAddresses from './WhitelistAddresses';

export interface Props {
  colonyAddress: string;
}

const MSG = defineMessage({
  loadingText: {
    id: 'dashboard.Whitelist.loadingText',
    defaultMessage: 'Loading whitelist',
  },
});

const Whitelist = ({ colonyAddress }: Props) => {
  const { data, loading } = useWhitelistedUsersQuery({
    variables: { colonyAddress },
  });
  return (
    <div>
      <UploadAddressesWidget />
      {loading && <MiniSpinnerLoader loadingText={MSG.loadingText} />}
      {(data?.whitelistedUsers?.length && (
        <WhitelistAddresses
          colonyAddress={colonyAddress}
          users={data.whitelistedUsers}
        />
      )) ||
        null}
    </div>
  );
};

export default Whitelist;
