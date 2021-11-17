import React from 'react';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import { defineMessages } from 'react-intl';

import Heading from '~core/Heading';
import MembersList from '~core/MembersList';
import { AnyUser, Colony, useLoggedInUser } from '~data/index';
import { useTransformer } from '~utils/hooks';
import { getAllUserRoles } from '../../../../transformers';
import { canAdminister } from '../../../../users/checks';

import WhitelistMembersListExtraContent from './WhitelistMembersListExtraContent';

import styles from './WhitelistAddresses.css';

interface Props {
  colony: Colony;
  users: AnyUser[];
}

const displayName = 'dashboard.Whitelist.WhitelistAddresses';

const MSG = defineMessages({
  title: {
    id: 'dashboard.Whitelist.WhitelistAddresses.title',
    defaultMessage: 'List of whitelisted addresses',
  },
});

const WhitelistAddresses = ({ colony, users }: Props) => {
  const { walletAddress, username, ethereal } = useLoggedInUser();
  const userHasProfile = !!username && !ethereal;

  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);
  const canAdministerWhitelist = userHasProfile && canAdminister(allUserRoles);

  return (
    <div className={styles.main}>
      <Heading
        text={MSG.title}
        appearance={{ margin: 'small', theme: 'dark', size: 'normal' }}
      />
      <MembersList
        colony={colony}
        domainId={ROOT_DOMAIN_ID}
        users={users}
        showUserReputation={false}
        extraItemContent={(props) => {
          return canAdministerWhitelist ? (
            <WhitelistMembersListExtraContent
              userAddress={props.id}
              colonyAddress={colony.colonyAddress}
            />
          ) : null;
        }}
        listGroupAppearance={{ hoverColor: 'dark' }}
      />
    </div>
  );
};

WhitelistAddresses.displayName = displayName;

export default WhitelistAddresses;
