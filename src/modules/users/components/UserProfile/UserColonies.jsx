/* @flow */
import React from 'react';

import type { Address } from '~types';
import type { UserType } from '~immutable';

import { useDataFetcher } from '~utils/hooks';
import ColonyGrid from '~dashboard/ColonyGrid';

import { userColoniesFetcher } from '../../../dashboard/fetchers';

type Props = {|
  user: UserType,
|};

const UserColonies = ({ user }: Props) => {
  const { data: colonyAddresses } = useDataFetcher<Address[]>(
    userColoniesFetcher,
    [user.profile.walletAddress],
    [user.profile.walletAddress, user.profile.metadataStoreAddress],
  );
  return <ColonyGrid colonyAddresses={colonyAddresses || []} />;
};

export default UserColonies;
