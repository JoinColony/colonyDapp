import React, { ReactNode } from 'react';

import ListGroup, { ListGroupAppearance } from '~core/ListGroup';
import { AnyUser, Colony } from '~data/index';

import MembersListItem from './MembersListItem';

interface Props {
  colony: Colony;
  domainId: number | undefined;
  users: AnyUser[];
  listGroupAppearance?: ListGroupAppearance;
  canAdministerComments?: boolean;
  extraItemContent?: (user: AnyUser) => ReactNode;
  showUserInfo?: boolean;
  showUserReputation?: boolean;
}

const displayName = 'MembersList';

const MembersList = ({
  colony,
  extraItemContent,
  showUserInfo = true,
  showUserReputation = true,
  domainId,
  users,
  listGroupAppearance,
  canAdministerComments,
}: Props) => {
  return (
    <ListGroup appearance={listGroupAppearance}>
      {users.map((user: AnyUser) => (
        <MembersListItem
          colony={colony}
          extraItemContent={extraItemContent}
          key={user.id}
          showUserInfo={showUserInfo}
          showUserReputation={showUserReputation}
          domainId={domainId}
          user={user}
          canAdministerComments={canAdministerComments}
        />
      ))}
    </ListGroup>
  );
};

MembersList.displayName = displayName;

export default MembersList;
