import React, { FC } from 'react';
import { defineMessages } from 'react-intl';

import { Address } from '~types/index';
import { useColonySubscribedUsersQuery } from '~data/index';

import { Table, TableBody } from '~core/Table';
import { SpinnerLoader } from '~core/Preloaders';
import UserListItem from '~admin/UserListItem';

import styles from './Community.css';

const MSG = defineMessages({
  loading: {
    id: 'dashboard.Community.loading',
    defaultMessage: "Loading Colony's users...",
  },
});

interface Props {
  colonyAddress: Address;
}

const Community = ({ colonyAddress }: Props) => {
  const {
    data: colonySubscribedUsers,
    loading,
  } = useColonySubscribedUsersQuery({
    variables: {
      colonyAddress,
    },
  });

  if (!colonySubscribedUsers || loading) {
    return (
      <div className={styles.main}>
        <SpinnerLoader
          loadingText={MSG.loading}
          appearance={{ size: 'massive', theme: 'primary' }}
        />
      </div>
    );
  }

  const {
    colony: { subscribedUsers },
  } = colonySubscribedUsers;

  return (
    <div className={styles.main}>
      <Table scrollable>
        <TableBody className={styles.tableBody}>
          {subscribedUsers.map(({ id: userAddress }) => (
            <UserListItem
              address={userAddress}
              key={userAddress}
              showDisplayName
              showMaskedAddress
              showUsername
              showInfo={false}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

Community.displayName = 'admin.Community';

export default Community as FC<Props>;
