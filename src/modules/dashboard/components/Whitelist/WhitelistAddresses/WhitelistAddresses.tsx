import React from 'react';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import { defineMessages } from 'react-intl';

import { AnyUser } from '~data/index';
import MembersList from '~core/MembersList';
import WhitelistMembersListExtraContent from './WhitelistMembersListExtraContent';

import styles from './WhitelistAddresses.css';
import Heading from '~core/Heading';

interface Props {
  colonyAddress: string;
  users: AnyUser[];
}

const displayName = 'dashboard.Whitelist.WhitelistAddresses';

const MSG = defineMessages({
  title: {
    id: 'dashboard.Whitelist.WhitelistAddresses.title',
    defaultMessage: 'List of whitelisted addresses',
  },
});

const WhitelistAddresses = ({ colonyAddress, users }: Props) => {
  return (
    <div className={styles.main}>
      <Heading
        text={MSG.title}
        appearance={{ margin: 'small', theme: 'dark', size: 'normal' }}
      />
      <MembersList
        colonyAddress={colonyAddress}
        domainId={ROOT_DOMAIN_ID}
        users={users}
        showUserReputation={false}
        extraItemContent={(props) => {
          return (
            <WhitelistMembersListExtraContent
              userAddress={props.id}
              colonyAddress={colonyAddress}
            />
          );
        }}
        listGroupAppearance={{ hoverColor: 'dark' }}
      />
    </div>
  );
};

WhitelistAddresses.displayName = displayName;

export default WhitelistAddresses;
