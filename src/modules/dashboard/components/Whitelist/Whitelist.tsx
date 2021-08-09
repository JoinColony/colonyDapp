import React from 'react';
import { defineMessage } from 'react-intl';

import { useWhitelistedUsersQuery, Colony } from '~data/index';
import { MiniSpinnerLoader } from '~core/Preloaders';

import UploadAddressesWidget from './UploadAddressesWidget';
import WhitelistAddresses from './WhitelistAddresses';

const MSG = defineMessage({
  loadingText: {
    id: 'dashboard.Whitelist.loadingText',
    defaultMessage: 'Loading whitelist',
  },
});

interface Props {
  colony: Colony;
}

const Whitelist = ({ colony: { colonyAddress }, colony }: Props) => {
  const { data: usersData, loading: usersLoading } = useWhitelistedUsersQuery({
    variables: { colonyAddress },
  });

  return (
    <div>
      <UploadAddressesWidget colony={colony} />
      {usersLoading && <MiniSpinnerLoader loadingText={MSG.loadingText} />}
      {(usersData?.whitelistedUsers?.length && !usersLoading && (
        <WhitelistAddresses
          colonyAddress={colonyAddress}
          users={usersData.whitelistedUsers}
        />
      )) ||
        null}
    </div>
  );
};

export default Whitelist;
