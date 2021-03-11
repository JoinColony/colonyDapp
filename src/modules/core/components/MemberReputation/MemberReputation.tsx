import React from 'react';

import { Address } from '~types/index';

interface Props {
  walletAddress: Address;
  colonyAddress: Address;
  domainId?: number;
}

const displayName = 'MemberReputation';

const MemberReputation = ({ walletAddress }: Props) => {
  return <div>{walletAddress}</div>;
};

MemberReputation.displayName = displayName;

export default MemberReputation;
