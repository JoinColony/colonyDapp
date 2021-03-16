import React, { ReactNode } from 'react';

import ListGroup from '~core/ListGroup';
import { AnyUser } from '~data/index';
import { Address } from '~types/index';

import MembersListItem from './MembersListItem';

interface Reputation {
  userReputation: string;
}

interface Props<U> {
  colonyAddress: Address;
  extraItemContent?: (user: U) => ReactNode;
  onRowClick?: (user: U) => void;
  showUserInfo?: boolean;
  domainId: number | undefined;
  users: U[];
}

const displayName = 'MembersList';

const MembersList = <U extends AnyUser = AnyUser>({
  colonyAddress,
  extraItemContent,
  onRowClick,
  showUserInfo = true,
  domainId,
  users,
}: Props<U>) => (
  <ListGroup>
    {users.map((user) => (
      <MembersListItem<U>
        colonyAddress={colonyAddress}
        extraItemContent={extraItemContent}
        key={user.id}
        onRowClick={onRowClick}
        showUserInfo={showUserInfo}
        domainId={domainId}
        user={user}
      />
    ))}
  </ListGroup>
);

MembersList.displayName = displayName;

export default MembersList;
