import { isEmpty } from 'lodash';
import React from 'react';

import UploadAddressesWidget from './UploadAddressesWidget';
import WhitelistAddresses from './WhitelistAddresses';

export interface Props {
  colonyAddress: string;
}

const Whitelist = ({ colonyAddress }: Props) => {
  const users = []; // @TODO: Connect with real added users

  return (
    <div>
      <UploadAddressesWidget />
      {!isEmpty(users) && (
        <WhitelistAddresses colonyAddress={colonyAddress} users={users} />
      )}
    </div>
  );
};

export default Whitelist;
