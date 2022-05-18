import React, { ReactNode } from 'react';

import ListGroup, { ListGroupAppearance } from '~core/ListGroup';
import { AnyUser, Colony } from '~data/index';

import MembersListItem from './MembersListItem';

interface Props<U> {
  colony: Colony;
  extraItemContent?: (user: U) => ReactNode;
  onRowClick?: (user: U) => void;
  showUserInfo?: boolean;
  showUserReputation?: boolean;
  domainId: number | undefined;
  users: U[];
  listGroupAppearance?: ListGroupAppearance;
  canAdministerComments?: boolean;
}

const displayName = 'MembersList';

const MembersList = <U extends AnyUser = AnyUser>({
  colony,
  extraItemContent,
  onRowClick,
  showUserInfo = true,
  showUserReputation = true,
  domainId,
  users,
  listGroupAppearance,
  canAdministerComments,
}: Props<U>) => (
  <ListGroup appearance={listGroupAppearance}>
    {users.map((user) => (
      <MembersListItem<U>
        colony={colony}
        extraItemContent={extraItemContent}
        key={user.id}
        onRowClick={onRowClick}
        showUserInfo={showUserInfo}
        showUserReputation={showUserReputation}
        domainId={domainId}
        user={user}
        canAdministerComments={canAdministerComments}
      />
    ))}
  </ListGroup>
);

MembersList.displayName = displayName;

export default MembersList;
