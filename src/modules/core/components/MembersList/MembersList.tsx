import React, { ReactNode } from 'react';

import ListGroup, { ListGroupAppearance } from '~core/ListGroup';
import { AnyUser } from '~data/index';
import { Address } from '~types/index';
import MembersListItem from './MembersListItem';

interface Props<U> {
  colonyAddress: Address;
  extraItemContent?: (user: U) => ReactNode;
  onRowClick?: (user: U) => void;
  showUserInfo?: boolean;
  showUserReputation?: boolean;
  domainId: number | undefined;
  users: U[];
  listGroupAppearance?: ListGroupAppearance;
}

const displayName = 'MembersList';

const MembersList = <U extends AnyUser = AnyUser>({
  colonyAddress,
  extraItemContent,
  onRowClick,
  showUserInfo = true,
  showUserReputation = true,
  domainId,
  users,
  listGroupAppearance,
}: Props<U>) => (
  <ListGroup appearance={listGroupAppearance}>
    {users.map((user) => (
      <MembersListItem<U>
        colonyAddress={colonyAddress}
        extraItemContent={extraItemContent}
        key={user.id}
        onRowClick={onRowClick}
        showUserInfo={showUserInfo}
        showUserReputation={showUserReputation}
        domainId={domainId}
        user={user}
      />
    ))}
  </ListGroup>
);

MembersList.displayName = displayName;

export default MembersList;
