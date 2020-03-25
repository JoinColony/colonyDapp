import React, { ReactNode } from 'react';

import ListGroup from '~core/ListGroup';
import { AnyUser } from '~data/index';
import { Address } from '~types/index';

import MembersListItem from './MembersListItem';

interface Props<U> {
  colonyAddress: Address;
  extraItemContent?: (user: U) => ReactNode;
  onRowClick?: (user: U) => void;
  showUserInfo?: boolean;
  skillId: number | undefined;
  users: U[];
}

const displayName = 'MembersList';

const MembersList = <U extends AnyUser = AnyUser>({
  colonyAddress,
  extraItemContent,
  onRowClick,
  showUserInfo = true,
  skillId,
  users,
}: Props<U>) => (
  <ListGroup>
    {users.map(user => (
      <MembersListItem<U>
        colonyAddress={colonyAddress}
        extraItemContent={extraItemContent}
        key={user.id}
        onRowClick={onRowClick}
        showUserInfo={showUserInfo}
        skillId={skillId}
        user={user}
      />
    ))}
  </ListGroup>
);

MembersList.displayName = displayName;

export default MembersList;
